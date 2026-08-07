import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import styles from './CameraSetup.module.css';

type CheckStatus = 'pending' | 'loading' | 'ok' | 'warning' | 'error';

interface CameraState {
  stream: MediaStream | null;
  browserSupport: CheckStatus;
  cameraPermission: CheckStatus;
  cameraActive: CheckStatus;
  handVisible: CheckStatus;
  errorMessage: string;
}

export default function CameraSetup() {
  const { switchMode, cameraReady } = useGame();
  const [camState, setCamState] = useState<CameraState>({
    stream: null,
    browserSupport: 'pending',
    cameraPermission: 'pending',
    cameraActive: 'pending',
    handVisible: 'pending',
    errorMessage: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkBrowser = useCallback((): CheckStatus => {
    if (!navigator.mediaDevices?.getUserMedia) return 'error';
    if (!window.isSecureContext) return 'warning';
    return 'ok';
  }, []);

  const requestCamera = useCallback(async () => {
    setIsLoading(true);
    const support = checkBrowser();
    setCamState(prev => ({ ...prev, browserSupport: support }));

    if (support === 'error') {
      setCamState(prev => ({
        ...prev,
        cameraPermission: 'error',
        errorMessage: '浏览器不支持摄像头访问。请使用HTTPS连接或更换浏览器。',
      }));
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      setCamState(prev => ({
        ...prev,
        stream,
        cameraPermission: 'ok',
        cameraActive: 'ok',
        errorMessage: '',
      }));
      // Cleanup previous stream if any
      return stream;
    } catch (err: unknown) {
      const msg = err instanceof DOMException
        ? err.name === 'NotAllowedError' ? '摄像头权限被拒绝。请在浏览器设置中允许摄像头访问。'
        : err.name === 'NotFoundError' ? '未检测到摄像头设备。'
        : err.name === 'NotReadableError' ? '摄像头被其他应用占用。'
        : `摄像头访问失败：${err instanceof Error ? err.message : String(err)}`
        : '摄像头访问失败';
      setCamState(prev => ({
        ...prev,
        cameraPermission: 'error',
        errorMessage: msg,
      }));
      setIsLoading(false);
      return null;
    }
  }, [checkBrowser]);

  const handleStartCamera = useCallback(async () => {
    const stream = await requestCamera();
    if (stream) {
      setIsLoading(false);
    }
  }, [requestCamera]);

  const handleProceed = useCallback(() => {
    // Stop any existing stream — calibration will request its own
    if (camState.stream) {
      camState.stream.getTracks().forEach(t => t.stop());
    }
    cameraReady();
  }, [camState.stream, cameraReady]);

  const handleUseClassic = useCallback(() => {
    if (camState.stream) {
      camState.stream.getTracks().forEach(t => t.stop());
    }
    switchMode('classic');
  }, [camState.stream, switchMode]);

  const canProceed = camState.browserSupport !== 'error' && camState.cameraPermission === 'ok';

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>摄像头准备</h2>

        {/* Privacy notice */}
        <p className={styles.privacy}>
          摄像头画面仅在本地设备上处理手势识别，默认不录制、不上传。
          <button className={styles.linkBtn}>查看隐私说明</button>
        </p>

        {/* Status checklist */}
        <div className={styles.checks}>
          <CheckRow
            label="浏览器支持"
            status={camState.browserSupport === 'pending' ? 'loading' : camState.browserSupport}
            okText="支持"
            errText="不支持"
          />
          <CheckRow
            label="摄像头权限"
            status={camState.cameraPermission === 'pending' ? 'loading' : camState.cameraPermission}
            okText="已授权"
            errText={camState.errorMessage || '未授权'}
          />
          <CheckRow
            label="摄像头状态"
            status={camState.cameraActive}
            okText="工作中"
            errText="未启动"
          />
          <CheckRow
            label="手势模型"
            status={isLoading ? 'loading' : 'pending'}
            okText="已就绪"
            errText="加载失败"
          />
        </div>

        {/* Camera preview */}
        <div className={styles.previewArea}>
          {camState.stream ? (
            <video
              autoPlay
              playsInline
              muted
              ref={el => { if (el && el.srcObject !== camState.stream) el.srcObject = camState.stream; }}
              className={styles.preview}
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <span>摄像头预览</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {camState.errorMessage && (
          <motion.div
            className={styles.errorBanner}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {camState.errorMessage}
          </motion.div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {!camState.stream && camState.cameraPermission !== 'ok' && (
            <button className={styles.primaryBtn} onClick={handleStartCamera} disabled={isLoading}>
              开启摄像头
            </button>
          )}
          {canProceed && (
            <motion.button
              className={styles.primaryBtn}
              onClick={handleProceed}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              继续 → 快速校准
            </motion.button>
          )}
          <button className={styles.secondaryBtn} onClick={handleUseClassic}>
            使用经典模式
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Check Row ──

function CheckRow({ label, status, okText, errText }: {
  label: string;
  status: CheckStatus;
  okText: string;
  errText: string;
}) {
  const icon = status === 'ok' ? '✓' : status === 'error' ? '✗' : status === 'loading' ? '○' : '—';
  const cls = styles[`status-${status}`] ?? '';
  return (
    <div className={`${styles.checkRow} ${cls}`}>
      <span className={styles.checkIcon}>{icon}</span>
      <span className={styles.checkLabel}>{label}</span>
      <span className={styles.checkStatus}>
        {status === 'ok' ? okText : status === 'error' ? errText : status === 'loading' ? '检查中...' : '等待中'}
      </span>
    </div>
  );
}
