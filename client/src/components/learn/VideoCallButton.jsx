import { useState, useRef, useEffect } from 'react';

/**
 * One-click video call: starts local camera/mic and shows in-call UI.
 * WebRTC peer connection to tutor can be added later via backend signalling.
 */
export function VideoCallButton() {
  const [inCall, setInCall] = useState(false);
  const [lang, setLang] = useState('English');
  const [error, setError] = useState(null);
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!inCall) return;
    setError(null);
    const constraints = { video: true, audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch((err) => setError(err.message || 'Camera/mic access denied'));
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [inCall]);

  const endCall = () => {
    setInCall(false);
    setError(null);
  };

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-light), var(--green))', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--text)' }}>Voice call tutor</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Real-time AI in any language</div>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              marginLeft: 'auto',
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'rgba(0,0,0,.2)',
              color: 'var(--text)',
              fontSize: 13,
            }}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
          <button
            type="button"
            onClick={() => (inCall ? endCall() : setInCall(true))}
            className="btn-p"
            style={{
              background: inCall ? '#cc0000' : 'linear-gradient(135deg, var(--green-light), var(--green))',
              padding: '12px 20px',
            }}
          >
            {inCall ? 'End call' : '📞 Start call'}
          </button>
        </div>
      </div>
      {inCall && (
        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 16,
            border: '2px solid var(--green)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>SolveSnap AI · {lang}</div>
          {error ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
          ) : (
            <>
              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#000', aspectRatio: '16/10', maxWidth: 400 }}>
                <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '4px 8px', background: 'rgba(0,0,0,.6)', borderRadius: 8, fontSize: 12, color: 'var(--green)' }}>You</div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>Tap mic to speak · Red button to end. Tutor connection can be added with WebRTC.</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
