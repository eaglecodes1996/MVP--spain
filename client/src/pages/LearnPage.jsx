import { useState, useEffect } from 'react';
import { getSubjects } from '../api/subjects';
import { AiChatPanel } from '../components/chat/AiChatPanel';
import { VideoCallButton } from '../components/learn/VideoCallButton';
import { LiveChatStrip } from '../components/support/LiveChatStrip';

const LEARN_YEAR_KEY = 'solvesnap_learn_year';

const YEAR_OPTIONS = [
  { id: '7', label: 'Year 7', icon: '🏆' },
  { id: '8', label: 'Year 8', icon: '📗' },
  { id: '9', label: 'Year 9', icon: '📘' },
  { id: '10', label: 'Year 10', icon: '📙' },
  { id: '11', label: 'Year 11', icon: '🔬' },
  { id: '12', label: 'Year 12', icon: '🎯' },
  { id: '13', label: 'Year 13', icon: '🏆' },
  { id: 'university', label: 'University', icon: '🎓' },
];

function getStoredYear() {
  try {
    return localStorage.getItem(LEARN_YEAR_KEY) || '';
  } catch {
    return '';
  }
}

export function LearnPage() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState(getStoredYear);
  const [yearStepDone, setYearStepDone] = useState(!!getStoredYear());

  useEffect(() => {
    getSubjects().then(setSubjects).catch(() => setSubjects([
      { id: 'math', name: 'Math', icon: '📐' },
      { id: 'science', name: 'Science', icon: '🔬' },
      { id: 'english', name: 'English', icon: '📖' },
    ]));
  }, []);

  const handleYearSelect = (id) => {
    setSelectedYear(id);
  };

  const handleContinue = () => {
    if (selectedYear) {
      try {
        localStorage.setItem(LEARN_YEAR_KEY, selectedYear);
      } catch {}
      setYearStepDone(true);
    }
  };

  const handleChangeYear = () => {
    setYearStepDone(false);
  };

  return (
    <>
      <LiveChatStrip />

      {/* Year selection block — "What year are you in?" */}
      <section className="learn-year-block card">
        <div className="learn-year-icon">🎓</div>
        <h2 className="learn-year-title">What year are you in?</h2>
        <p className="learn-year-sub">We'll tailor everything to your level.</p>
        <div className="learn-year-grid">
          {YEAR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`learn-year-chip ${selectedYear === opt.id ? 'selected' : ''}`}
              onClick={() => handleYearSelect(opt.id)}
            >
              <span className="learn-year-chip-icon">{opt.icon}</span>
              <span className="learn-year-chip-label">{opt.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-green learn-year-continue"
          onClick={handleContinue}
          disabled={!selectedYear}
        >
          Continue →
        </button>
        {yearStepDone && selectedYear && (
          <p className="learn-year-done">
            Level set to {YEAR_OPTIONS.find((o) => o.id === selectedYear)?.label}.
            <button type="button" className="learn-year-change" onClick={handleChangeYear}>Change</button>
          </p>
        )}
      </section>

      {/* Rest of Learn: Voice call, subjects, chat — show after user has continued from year step */}
      {(yearStepDone || !!getStoredYear()) && (
        <>
          <VideoCallButton />
          <div className="hero-tag"><span className="live-dot" /> Learn</div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, marginBottom: 12, color: 'var(--text)' }}>
            Practice & call tutor
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
            Choose a subject and use the chat below, or start a one-click video call with the AI tutor.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubject(s.id)}
                className={subject === s.id ? 'btn-p' : 'btn-s'}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>
          <AiChatPanel subject={subject} />
        </>
      )}
    </>
  );
}
