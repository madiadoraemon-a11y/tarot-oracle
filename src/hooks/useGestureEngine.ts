import { useRef, useCallback, useEffect } from 'react';
import { GestureEngine, GestureConfig, GestureCallback } from '../engine/GestureEngine';

export function useGestureEngine(
  config?: Partial<GestureConfig>,
) {
  const engineRef = useRef<GestureEngine | null>(null);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new GestureEngine(config, () => {
        // Default no-op; set callback via engine directly
      });
    }
    return engineRef.current;
  }, [config]);

  const start = useCallback(async (video: HTMLVideoElement, onGesture: GestureCallback) => {
    const engine = getEngine();
    engine.setCallback(onGesture);
    await engine.start(video);
  }, [getEngine]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const setPhase = useCallback((phase: string) => {
    if (engineRef.current) {
      engineRef.current.activePhase = phase;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  return { start, stop, setPhase, engineRef };
}
