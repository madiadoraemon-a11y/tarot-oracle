/**
 * GestureEngine — MediaPipe Hand Landmarker wrapper.
 * Detects hand gestures and emits GestureIntent events.
 * Pure detection layer; never modifies card state directly.
 */

import { GestureIntent } from '../types';

// ── Configuration ──

export interface GestureConfig {
  /** Minimum confidence for landmark detection (0-1) */
  minDetectionConfidence: number;
  /** Minimum confidence for hand presence (0-1) */
  minPresenceConfidence: number;
  /** Frames required to confirm open palm */
  openPalmFrames: number;
  /** Frames required to confirm closed fist */
  closedFistFrames: number;
  /** Frames required to confirm pinch */
  pinchFrames: number;
  /** Max time (ms) for armed→confirmed transition */
  armingWindowMs: number;
  /** Cooldown after each trigger (ms) */
  cooldownMs: number;
  /** Minimum hand displacement for shuffle direction change (normalized 0-1) */
  shuffleMinDisplacement: number;
  /** Minimum pinch distance (thumb tip to index tip, normalized) */
  pinchMaxDistance: number;
  /** Maximum tip-to-mcp distance for closed fist (normalized) */
  fistMaxExtension: number;
  /** Minimum tip-to-mcp distance for open palm (normalized) */
  palmMinExtension: number;
}

export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  minDetectionConfidence: 0.7,
  minPresenceConfidence: 0.7,
  openPalmFrames: 15,       // ~500ms at 30fps
  closedFistFrames: 12,     // ~400ms at 30fps
  pinchFrames: 12,          // ~400ms at 30fps
  armingWindowMs: 1500,
  cooldownMs: 1200,
  shuffleMinDisplacement: 0.08,
  pinchMaxDistance: 0.06,
  fistMaxExtension: 0.12,
  palmMinExtension: 0.18,
};

// ── Sensitivity presets ──

export type Sensitivity = 'low' | 'standard' | 'high';

export function sensitivityConfig(s: Sensitivity): Partial<GestureConfig> {
  switch (s) {
    case 'low':
      return {
        minDetectionConfidence: 0.8,
        openPalmFrames: 20,
        closedFistFrames: 16,
        pinchFrames: 16,
        pinchMaxDistance: 0.05,
        shuffleMinDisplacement: 0.10,
      };
    case 'high':
      return {
        minDetectionConfidence: 0.6,
        openPalmFrames: 10,
        closedFistFrames: 8,
        pinchFrames: 8,
        pinchMaxDistance: 0.08,
        shuffleMinDisplacement: 0.06,
      };
    default:
      return {};
  }
}

// ── Hand landmark indices ──

const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;
const THUMB_MCP = 2;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const RING_MCP = 13;
const PINKY_MCP = 17;
const PALM_CENTER = 9; // middle finger MCP ≈ palm center

// ── Internal state ──

interface HandState {
  landmarks: NormalizedLandmark[];
  confidence: number;
  palmCenter: { x: number; y: number };
  isOpenPalm: boolean;
  isClosedFist: boolean;
  isPinching: boolean;
  pinchDistance: number;
}

interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

// ── Gesture callback type ──

export type GestureCallback = (intent: GestureIntent) => void;

// ── GestureEngine ──

export class GestureEngine {
  private config: GestureConfig;
  private callback: GestureCallback;
  private handLandmarker: unknown = null;
  private videoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;
  private running = false;

  // Multi-frame tracking
  private openPalmCount = 0;
  private closedFistCount = 0;
  private pinchCount = 0;
  private lastTriggerTime = 0;
  private lastPalmCenter = { x: 0.5, y: 0.5 };
  private lastDirection: -1 | 1 = 1;
  private directionChanges = 0;
  private previousLandmarks: NormalizedLandmark[] | null = null;

  // Smoothing
  private smoothedCenter = { x: 0.5, y: 0.5 };
  private readonly smoothFactor = 0.3;

  // Scroll detection during drawing
  private scrollDirectionChanges = 0;
  private scrollLastDirection: -1 | 1 = 1;
  private scrollLastPalmX = 0.5;
  private scrollCooldownUntil = 0;

  // Mode-switching hysteresis (prevents flicker between scroll/cursor modes)
  private drawMode: 'scroll' | 'cursor' = 'scroll';
  private drawModePending: 'scroll' | 'cursor' | null = null;
  private drawModePendingFrames = 0;
  private readonly drawModeThreshold = 8; // ~270ms at 30fps

  // Hover resolver (set by UI layer)
  private hoverResolver: ((x: number, y: number) => string) | null = null;

  // Phase gating (set externally)
  public activePhase: string = '';

  constructor(config: Partial<GestureConfig> = {}, callback: GestureCallback) {
    this.config = { ...DEFAULT_GESTURE_CONFIG, ...config };
    this.callback = callback;
  }

  /** Update configuration at runtime */
  updateConfig(partial: Partial<GestureConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /** Set gesture callback */
  setCallback(callback: GestureCallback): void {
    this.callback = callback;
  }

  /** Set external hover resolver (maps normalized coords → card id) */
  setHoverResolver(resolver: (x: number, y: number) => string): void {
    this.hoverResolver = resolver;
  }

  /** Start processing a video stream */
  async start(video: HTMLVideoElement): Promise<void> {
    this.videoElement = video;
    this.running = true;

    // Lazy-load MediaPipe
    await this.initHandLandmarker();

    // Reset tracking state
    this.resetTracking();
    this.loop();
  }

  /** Stop processing and release resources */
  stop(): void {
    this.running = false;
    if (this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.handLandmarker = null;
    this.videoElement = null;
  }

  // ── Private ──

  private async initHandLandmarker(): Promise<void> {
    const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: this.config.minDetectionConfidence,
      minHandPresenceConfidence: this.config.minPresenceConfidence,
      minTrackingConfidence: 0.5,
    });
  }

  private resetTracking(): void {
    this.openPalmCount = 0;
    this.closedFistCount = 0;
    this.pinchCount = 0;
    this.directionChanges = 0;
    this.lastPalmCenter = { x: 0.5, y: 0.5 };
    this.smoothedCenter = { x: 0.5, y: 0.5 };
    this.previousLandmarks = null;
  }

  private loop = (): void => {
    if (!this.running || !this.videoElement) return;

    this.detect();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private async detect(): Promise<void> {
    const hl = this.handLandmarker as {
      detectForVideo(video: HTMLVideoElement, timestamp: number): {
        landmarks: Array<NormalizedLandmark[]>;
        worldLandmarks: Array<NormalizedLandmark[]>;
      };
    } | null;
    if (!hl || !this.videoElement || !this.running) return;

    const now = performance.now();
    let result;
    try {
      result = hl.detectForVideo(this.videoElement, now);
    } catch {
      return; // model not ready yet
    }

    if (!result.landmarks || result.landmarks.length === 0) {
      this.onHandLost();
      return;
    }

    const landmarks = result.landmarks[0];
    const hand = this.analyzeHand(landmarks);

    // Smooth palm center
    this.smoothedCenter = {
      x: this.smoothedCenter.x + (hand.palmCenter.x - this.smoothedCenter.x) * this.smoothFactor,
      y: this.smoothedCenter.y + (hand.palmCenter.y - this.smoothedCenter.y) * this.smoothFactor,
    };

    // Emit hand visible
    this.callback({ type: 'HAND_VISIBLE', confidence: hand.confidence });

    // Phase-specific gesture detection
    this.detectPhaseGesture(hand, now);
  }

  private analyzeHand(landmarks: NormalizedLandmark[]): HandState {
    const palmCenter = landmarks[PALM_CENTER] as { x: number; y: number; z: number };

    // Check finger extensions: tip.y should be less than MCP.y (higher on screen)
    const fingerTips = [INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP];
    const fingerMCPs = [INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP];

    let extendedCount = 0;
    let totalExtension = 0;
    for (let i = 0; i < fingerTips.length; i++) {
      const ext = landmarks[fingerMCPs[i]].y - landmarks[fingerTips[i]].y;
      totalExtension += ext;
      if (ext > this.config.palmMinExtension) extendedCount++;
    }

    const isOpenPalm = extendedCount >= 3 && totalExtension / 4 > this.config.palmMinExtension;
    const isClosedFist = extendedCount <= 1 && totalExtension / 4 < this.config.fistMaxExtension;

    // Pinch: distance between thumb tip and index tip
    const dx = landmarks[THUMB_TIP].x - landmarks[INDEX_TIP].x;
    const dy = landmarks[THUMB_TIP].y - landmarks[INDEX_TIP].y;
    const pinchDistance = Math.sqrt(dx * dx + dy * dy);
    const isPinching = pinchDistance < this.config.pinchMaxDistance;

    // Average hand confidence from wrist and finger landmarks
    const avgZ = (landmarks[WRIST].z + landmarks[INDEX_TIP].z + landmarks[PINKY_TIP].z) / 3;
    const confidence = Math.max(0, Math.min(1, 1 - Math.abs(avgZ) * 2));

    return {
      landmarks: landmarks as NormalizedLandmark[],
      confidence,
      palmCenter: { x: palmCenter.x, y: palmCenter.y },
      isOpenPalm,
      isClosedFist,
      isPinching,
      pinchDistance,
    };
  }

  private detectPhaseGesture(hand: HandState, now: number): void {
    const phase = this.activePhase;

    switch (phase) {
      case 'shuffling':
        this.detectShuffle(hand);
        break;
      case 'drawing':
        this.detectDraw(hand, now);
        break;
      case 'revealing':
        this.detectReveal(hand);
        break;
      case 'reading-ready':
        this.detectReadingReady(hand, now);
        break;
      case 'reading-armed':
        this.detectReadingArmed(hand, now);
        break;
    }
  }

  // ── Shuffle detection ──

  private detectShuffle(hand: HandState): void {
    if (!hand.isOpenPalm) {
      this.directionChanges = 0;
      return;
    }

    const cx = hand.palmCenter.x;
    const displacement = cx - this.lastPalmCenter.x;
    this.lastPalmCenter = { x: cx, y: hand.palmCenter.y };

    if (Math.abs(displacement) > this.config.shuffleMinDisplacement) {
      const dir: -1 | 1 = displacement > 0 ? 1 : -1;
      if (dir !== this.lastDirection) {
        this.lastDirection = dir;
        this.directionChanges++;
        const progress = Math.min(1, this.directionChanges / 4);
        this.callback({ type: 'SHUFFLE_PROGRESS', progress, direction: dir });
      }
    }
  }

  // ── Draw detection ──
  // Open palm  → scroll mode  (SCROLL_POSITION)
  // Closed fist → cursor mode (CURSOR_MODE)
  // Pinch       → draw card   (DRAW_CONFIRMED)
  // Uses hysteresis so micro-movements don't cause rapid mode flicker.

  private detectDraw(hand: HandState, now: number): void {
    const cx = this.smoothedCenter.x;
    const cy = this.smoothedCenter.y;

    // Determine which mode this frame suggests
    const frameMode: 'scroll' | 'cursor' | null =
      hand.isOpenPalm ? 'scroll' :
      hand.isClosedFist ? 'cursor' :
      null;

    // Hysteresis: only switch modes after consecutive confirming frames
    if (frameMode === this.drawModePending) {
      this.drawModePendingFrames++;
    } else {
      this.drawModePending = frameMode;
      this.drawModePendingFrames = 1;
    }

    if (
      this.drawModePending !== null &&
      this.drawModePendingFrames >= this.drawModeThreshold &&
      this.drawModePending !== this.drawMode
    ) {
      this.drawMode = this.drawModePending;
    }

    // Emit based on the locked-in mode (not the raw per-frame state)
    if (this.drawMode === 'scroll') {
      this.callback({ type: 'SCROLL_POSITION', normalizedX: cx });
    } else {
      this.callback({ type: 'CURSOR_MODE', normalizedX: cx, normalizedY: cy });
    }

    // ── Pinch-to-draw detection (works regardless of palm/fist state) ──
    if (hand.isPinching) {
      this.pinchCount++;
      // Emit DRAW_ARMED while pinching (for calibration progress feedback)
      if (this.pinchCount >= Math.floor(this.config.pinchFrames / 2)) {
        this.callback({ type: 'DRAW_ARMED', cardId: '' });
      }
      if (this.pinchCount >= this.config.pinchFrames) {
        const cardId = this.hoverResolver
          ? this.hoverResolver(cx, cy)
          : this.resolveHoveredCard(cx, cy);
        this.callback({ type: 'DRAW_CONFIRMED', cardId: cardId || '' });
        this.pinchCount = 0;
        this.enterCooldown();
      }
    } else {
      this.pinchCount = Math.max(0, this.pinchCount - 2);
    }
  }

  // Placeholder: resolve which card the hand is hovering over
  // In practice this is driven by the UI layer mapping screen coords to card positions
  private resolveHoveredCard(_x: number, _y: number): string {
    return ''; // Filled by UI layer
  }

  // ── Reveal (flip palm → flip all cards) ──
  // Detect palm rotating from facing-camera to facing-away.

  private revealWasOpen = false;

  private detectReveal(hand: HandState): void {
    const now = performance.now();

    if (hand.isOpenPalm) {
      this.revealWasOpen = true;
    } else if (this.revealWasOpen) {
      // Palm was open, now it's not → user flipped their palm
      if (!this.isInCooldown()) {
        this.callback({ type: 'REVEAL_TRIGGERED' });
        this.revealWasOpen = false;
        this.enterCooldown();
      }
    }
  }

  // ── Reading ready (open palm) ──

  private detectReadingReady(hand: HandState, _now: number): void {
    if (hand.isOpenPalm) {
      this.openPalmCount++;
      if (this.openPalmCount >= this.config.openPalmFrames) {
        this.callback({ type: 'READING_OPEN_PALM_CONFIRMED' });
        this.openPalmCount = 0;
      }
    } else {
      this.openPalmCount = Math.max(0, this.openPalmCount - 3);
    }
  }

  // ── Reading armed (closed fist within window) ──

  private detectReadingArmed(hand: HandState, now: number): void {
    if (hand.isClosedFist) {
      this.closedFistCount++;
      if (this.closedFistCount >= this.config.closedFistFrames) {
        this.callback({ type: 'READING_FIST_CONFIRMED' });
        this.closedFistCount = 0;
        this.enterCooldown();
      }
    } else {
      this.closedFistCount = Math.max(0, this.closedFistCount - 3);
    }
  }

  // ── Hand lost ──

  private onHandLost(): void {
    this.openPalmCount = Math.max(0, this.openPalmCount - 5);
    this.closedFistCount = Math.max(0, this.closedFistCount - 5);
    this.pinchCount = Math.max(0, this.pinchCount - 3);
    this.callback({ type: 'GESTURE_CANCELLED', reason: 'hand_lost' });
  }

  // ── Cooldown ──

  private enterCooldown(): void {
    this.lastTriggerTime = performance.now();
  }

  isInCooldown(): boolean {
    return performance.now() - this.lastTriggerTime < this.config.cooldownMs;
  }
}
