import { useEffect, useState } from 'react';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { AiChatPanel } from '../components/chat/AiChatPanel';
import { CalculatorWidget } from '../components/calculator/CalculatorWidget';
import { GamesPortal } from '../components/calculator/GamesPortal';
import { getSubjects } from '../api/subjects';

export function HomePage() {
  const [subjects, setSubjects] = useState([]);
  const [showGames, setShowGames] = useState(false);
  const [gamesAnimationDone, setGamesAnimationDone] = useState(false);

  useEffect(() => {
    getSubjects().then(setSubjects).catch(() => setSubjects([
      { id: 'math', name: 'Math', icon: '📐', description: 'Algebra, geometry, calculus' },
      { id: 'science', name: 'Science', icon: '🔬', description: 'Physics, chemistry, biology' },
      { id: 'english', name: 'English', icon: '📖', description: 'Grammar, literature, writing' },
    ]));
  }, []);

  const handleCalculatorCode = (code) => {
    if (code === '2012') {
      setShowGames(true);
      setGamesAnimationDone(false);
    }
  };

  return (
    <>
      <div className="home-grid">
        <div>
          <div className="hero-tag">
            <span className="live-dot" /> Core subjects
          </div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
            Math, Science & <em style={{ background: 'linear-gradient(90deg, var(--green-light), var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>English</em>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 20 }}>
            Pick a subject and ask your homework question in the chat.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            {subjects.map((s) => (
              <SubjectCard key={s.id} subject={s} />
            ))}
          </div>
          <CalculatorWidget onCodeUnlock={handleCalculatorCode} />
        </div>
        <div style={{ position: 'sticky', top: 24 }}>
          <AiChatPanel />
        </div>
      </div>

      {showGames && (
        <GamesPortal
          onClose={() => setShowGames(false)}
          onAnimationDone={() => setGamesAnimationDone(true)}
        />
      )}
    </>
  );
}
