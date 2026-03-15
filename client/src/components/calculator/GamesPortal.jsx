import { useState, useEffect } from 'react';

/**
 * Mini-portal of browser games with plane-takeoff animation.
 * Games can be embedded in iframe to run inside the site, with fallback to open in new tab.
 */
const GAMES = [
  { name: 'Quick Math', url: 'https://www.mathplayground.com/math-games.html', id: 'math', embed: true },
  { name: 'Word Play', url: 'https://www.funbrain.com/games', id: 'word', embed: false },
  { name: 'Puzzle', url: 'https://www.coolmathgames.com/', id: 'puzzle', embed: false },
];

export function GamesPortal({ onClose, onAnimationDone }) {
  const [phase, setPhase] = useState('flying');
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('done');
      onAnimationDone?.();
    }, 3200);
    return () => clearTimeout(t);
  }, [onAnimationDone]);

  return (
    <div
      className="games-portal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="games-portal-close"
        aria-label="Close"
      >
        ×
      </button>

      {phase === 'flying' && (
        <div className="plane-takeoff" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flex: 1, justifyContent: 'center' }}>
          <div style={{ fontSize: 48, animation: 'flyUp 2.5s ease-out forwards', transformOrigin: 'center bottom' }}>✈️</div>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--green)', animation: 'fadeIn 1s 1s both' }}>Welcome to the games portal!</p>
        </div>
      )}

      {phase === 'done' && (
        <>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, marginBottom: 16, color: 'var(--text)', flexShrink: 0 }}>🎮 Games</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
            {GAMES.map((g) => (
              <div key={g.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {g.embed ? (
                  <button
                    type="button"
                    className="card"
                    style={{
                      padding: 14,
                      border: '1.5px solid var(--border)',
                      borderRadius: 14,
                      color: 'var(--text)',
                      cursor: 'pointer',
                      background: selectedGame?.id === g.id ? 'rgba(0,200,83,.1)' : 'var(--bg-card)',
                    }}
                    onClick={() => setSelectedGame(g)}
                  >
                    Play here: {g.name}
                  </button>
                ) : null}
                <a href={g.url} target="_blank" rel="noopener noreferrer" className={g.embed ? 'btn-s' : 'card'}
                  style={{ padding: g.embed ? '8px 12px' : 14, fontSize: g.embed ? 12 : 14, textDecoration: 'none', color: 'var(--text)', border: '1.5px solid var(--border)', borderRadius: 14 }}
                >
                  {g.embed ? 'New tab' : g.name + ' →'}
                </a>
              </div>
            ))}
          </div>
          {selectedGame?.embed && (
            <div className="games-portal-embed" style={{ flex: 1, minHeight: 0, marginTop: 16, border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 12px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
                Playing: {selectedGame.name}. If the game doesn’t load (some sites block embedding), use “New tab”.
              </div>
              <iframe
                title={selectedGame.name}
                src={selectedGame.url}
                style={{ flex: 1, width: '100%', border: 'none', minHeight: 300 }}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          )}
        </>
      )}

      <style>{`
        .games-portal-overlay .games-portal-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,.1); color: var(--text); font-size: 20px; cursor: pointer; z-index: 1; }
        @keyframes flyUp { 0% { transform: translateY(80px) scale(0.8); opacity: 0; } 30% { transform: translateY(0) scale(1.2); opacity: 1; } 70% { transform: translateY(-20px) scale(1); opacity: 1; } 100% { transform: translateY(-120px) scale(0.9); opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
