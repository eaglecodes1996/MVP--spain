/**
 * Reusable subject card. Add more subjects in server/routes/subjects.js
 * and they will appear here when fetched.
 */
export function SubjectCard({ subject, onClick }) {
  const { id, name, icon, description } = subject;
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="card"
      style={{
        flex: '1 1 140px',
        textAlign: 'left',
        border: '1.5px solid var(--border)',
        borderRadius: 14,
        padding: 14,
        background: 'rgba(255,255,255,.05)',
        cursor: 'pointer',
        transition: 'border-color .2s, box-shadow .2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--green)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,200,83,.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <span style={{ fontSize: 24, marginBottom: 6, display: 'block' }}>{icon}</span>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{description}</div>
    </button>
  );
}
