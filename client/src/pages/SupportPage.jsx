import { useState, useEffect } from 'react';
import { createTicket, getFaq, searchFaq } from '../api/support';
import { LiveChatStrip } from '../components/support/LiveChatStrip';
import { addHistoryItem } from '../context/AuthContext';

export function SupportPage() {
  const [faqs, setFaqs] = useState([]);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqResults, setFaqResults] = useState(null);
  const [ticket, setTicket] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFaq().then(setFaqs).catch(() => setFaqs([]));
  }, []);

  const doFaqSearch = () => {
    if (!faqSearch.trim()) {
      setFaqResults(null);
      return;
    }
    setLoading(true);
    searchFaq(faqSearch.trim())
      .then((list) => {
        setFaqResults(list);
      })
      .catch(() => setFaqResults([]))
      .finally(() => setLoading(false));
  };

  const submitTicket = (e) => {
    e.preventDefault();
    if (!ticket.email || !ticket.subject.trim() || !ticket.message.trim()) return;
    setLoading(true);
    createTicket(ticket)
      .then(() => {
        addHistoryItem({ type: 'support', text: ticket.subject });
        setSent(true);
        setTicket({ email: '', subject: '', message: '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const displayFaqs = faqResults !== null ? faqResults : faqs;

  const inputStyle = {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'rgba(0,0,0,.2)',
    color: 'var(--text)',
    fontSize: 14,
  };

  return (
    <>
      <LiveChatStrip />
      <div className="page-header">
        <div className="sec-title">Support hub</div>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>
          In-page live chat, email ticket, and searchable FAQ.
        </p>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">📧 Email ticket</div>
          {sent ? (
            <p style={{ color: 'var(--green)' }}>Ticket sent. We'll get back to you at your email.</p>
          ) : (
            <form onSubmit={submitTicket}>
              <input
                type="email"
                placeholder="Your email"
                value={ticket.email}
                onChange={(e) => setTicket((t) => ({ ...t, email: e.target.value }))}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Subject"
                value={ticket.subject}
                onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))}
                required
                style={inputStyle}
              />
              <textarea
                placeholder="Message"
                value={ticket.message}
                onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))}
                required
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <button type="submit" className="btn-p" disabled={loading}>Send ticket</button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="card-title">🔍 FAQ search</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Search FAQ..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doFaqSearch()}
              style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
            />
            <button type="button" onClick={doFaqSearch} className="btn-p">Search</button>
          </div>
          {loading && <p style={{ color: 'var(--text-muted)' }}>Searching...</p>}
          {displayFaqs.length === 0 && !loading && (
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>No FAQ entries yet. Add some in the database or try a different search.</p>
          )}
          {displayFaqs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayFaqs.map((f) => (
                <div key={f._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{f.question}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{f.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
