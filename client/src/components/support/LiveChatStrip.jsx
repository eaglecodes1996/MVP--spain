import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || '';

export function LiveChatStrip() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [author, setAuthor] = useState('');
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL || window.location.origin, { path: '/socket.io', transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('live-chat:message', (payload) => {
      setMessages((m) => [...m, { ...payload, isMe: false }]);
    });
    socket.emit('live-chat:join', 'support');
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit('live-chat:message', {
      room: 'support',
      text,
      author: author.trim() || 'Guest',
    });
    setMessages((m) => [...m, { text, author: author.trim() || 'Guest', isMe: true }]);
    setInput('');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 72,
          right: 20,
          zIndex: 90,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, var(--green-light), var(--green))',
          color: 'var(--bg)',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-green)',
        }}
        title="Live chat"
      >
        💬
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 140,
            right: 20,
            zIndex: 91,
            width: 320,
            maxWidth: 'calc(100vw - 40px)',
            height: 360,
            background: 'var(--bg)',
            border: '1.5px solid var(--border)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--text)' }}>Live chat</span>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Say hi! Messages are real-time.</p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: msg.isMe ? 'linear-gradient(135deg, var(--green-light), var(--green))' : 'var(--bg-card)',
                  color: msg.isMe ? 'var(--bg)' : 'var(--text)',
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{msg.author}</div>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ padding: 10, borderTop: '1px solid var(--border)' }}>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', marginBottom: 6, borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)', color: 'var(--text)', fontSize: 12 }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)', color: 'var(--text)', fontSize: 14 }}
              />
              <button type="button" onClick={send} className="btn-p" style={{ padding: '8px 14px' }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
