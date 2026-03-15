import { useState, useRef, useEffect } from 'react';
import { sendChat } from '../../api/ai';
import { addHistoryItem } from '../../context/AuthContext';

export function AiChatPanel({ subject: subjectProp }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm your AI tutor.\n\n📷 Add a photo of your homework, type any question, or pick a subject above. What are you studying?" },
  ]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState(subjectProp || '');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (subjectProp !== undefined) setSubject(subjectProp);
  }, [subjectProp]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if ((!text && !attachment) || loading) return;
    setInput('');
    const userContent = text || 'What do you see in this homework image? Explain or solve it.';
    const userMsg = { role: 'user', content: userContent };
    setMessages((m) => [...m, userMsg]);
    addHistoryItem({ type: 'chat', text: (text || 'Photo').slice(0, 80) });
    setLoading(true);
    const imageBase64 = attachment ? attachment.replace(/^data:image\/\w+;base64,/, '') : undefined;
    try {
      const history = [...messages, userMsg];
      const reply = await sendChat(
        history.map((m) => ({ role: m.role, content: m.content })),
        subject || undefined,
        undefined,
        imageBase64
      );
      setMessages((m) => [...m, { role: 'assistant', content: reply || 'No response.' }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: `😕 Error: ${err.message}. Check your connection or try again.` }]);
    } finally {
      setLoading(false);
      setAttachment(null);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setAttachment(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-light), var(--green))', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--text)' }}>SolveSnap AI</div>
          <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'blink 2s infinite' }} />
            Live
          </div>
        </div>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            marginLeft: 'auto',
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'rgba(0,0,0,.2)',
            color: 'var(--text)',
            fontSize: 12,
          }}
        >
          <option value="">Any</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="english">English</option>
        </select>
      </div>
      <div
        ref={listRef}
        style={{
          height: 280,
          overflowY: 'auto',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: 14,
              background: m.role === 'user' ? 'linear-gradient(135deg, var(--green-light), var(--green))' : 'rgba(255,255,255,.08)',
              color: m.role === 'user' ? 'var(--bg)' : 'var(--text)',
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,.08)', borderRadius: 14, fontSize: 14, color: 'var(--text-muted)' }}>
            <span style={{ animation: 'blink 1s infinite' }}>...</span>
          </div>
        )}
      </div>
      {attachment && (
        <div style={{ padding: '0 10px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={attachment} alt="Homework" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Photo attached</span>
          <button type="button" className="btn-s" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setAttachment(null)}>Remove</button>
        </div>
      )}
      <div style={{ padding: 10, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <input type="file" ref={fileInputRef} accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-s" style={{ padding: '10px 12px' }} title="Upload homework photo">📷</button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Ask anything about your homework..."
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'rgba(0,0,0,.2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            color: 'var(--text)',
            fontSize: 14,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button type="button" onClick={send} className="btn-p" style={{ padding: '12px 16px' }}>
          →
        </button>
      </div>
    </div>
  );
}
