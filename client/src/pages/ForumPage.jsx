import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getForumPosts, getForumPost, createPost, addReply, searchForum } from '../api/forum';
import { addHistoryItem } from '../context/AuthContext';
import { LiveChatStrip } from '../components/support/LiveChatStrip';
import { VideoCallButton } from '../components/learn/VideoCallButton';

export function ForumPage() {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [thread, setThread] = useState(null);
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', body: '', author: '' });
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  useEffect(() => {
    if (postId) {
      getForumPost(postId).then(setThread).catch(() => setThread(null));
    } else {
      const fn = subject ? () => getForumPosts(subject) : () => getForumPosts();
      fn().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
    }
  }, [postId, subject]);

  const doSearch = () => {
    if (!search.trim()) return;
    setLoading(true);
    searchForum(search.trim()).then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  };

  const submitPost = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    createPost({
      title: form.title.trim(),
      body: form.body.trim(),
      author: form.author.trim() || 'Anonymous',
      subject: subject || 'other',
    })
      .then((newPost) => {
        addHistoryItem({ type: 'forum', title: form.title.trim() });
        setPosts((p) => [newPost, ...p]);
        setForm({ title: '', body: '', author: '' });
      })
      .catch(console.error);
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (!postId || !replyText.trim()) return;
    addReply(postId, { body: replyText.trim(), author: replyAuthor.trim() || 'Anonymous' })
      .then(setThread)
      .then(() => setReplyText(''))
      .catch(console.error);
  };

  if (postId && thread) {
    return (
      <>
        <LiveChatStrip />
        <div style={{ marginBottom: 12 }}>
          <Link to="/forum" style={{ fontSize: 14, color: 'var(--green)' }}>← Back to forum</Link>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>{thread.subject} · {new Date(thread.createdAt).toLocaleDateString()}</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{thread.title}</h1>
          <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{thread.body}</p>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>— {thread.author}</div>
        </div>
        <div className="sec-title">Replies</div>
        {(thread.replies || []).map((r, i) => (
          <div key={i} className="card" style={{ marginBottom: 10 }}>
            <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{r.body}</p>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>— {r.author} · {new Date(r.createdAt).toLocaleString()}</div>
          </div>
        ))}
        <form onSubmit={submitReply} style={{ marginTop: 16 }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }}
          />
          <textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', resize: 'vertical' }}
          />
          <button type="submit" className="btn-p">Post reply</button>
        </form>
      </>
    );
  }

  return (
    <>
      <LiveChatStrip />
      <VideoCallButton />
      <div className="sec-title">Discussion forum</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }}
        >
          <option value="">All subjects</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="english">English</option>
          <option value="other">Other</option>
        </select>
        <div style={{ flex: 1, minWidth: 120, display: 'flex', gap: 6 }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }}
          />
          <button type="button" onClick={doSearch} className="btn-s">Search</button>
        </div>
      </div>
      <form onSubmit={submitPost} className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">New thread</div>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)', color: 'var(--text)' }}
        />
        <textarea
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          rows={3}
          style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)', color: 'var(--text)', resize: 'vertical' }}
        />
        <input
          type="text"
          placeholder="Author (optional)"
          value={form.author}
          onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(0,0,0,.2)', color: 'var(--text)' }}
        />
        <button type="submit" className="btn-p">Create thread</button>
      </form>
      <div className="sec-title">Threads</div>
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No threads yet. Start one above.</p>
      ) : (
        posts.map((p) => (
          <Link
            key={p._id}
            to={`/forum/${p._id}`}
            className="card"
            style={{ display: 'block', marginBottom: 10, color: 'inherit', textDecoration: 'none' }}
          >
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{p.subject} · {new Date(p.createdAt).toLocaleDateString()}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, marginTop: 4 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{(p.replies || []).length} replies</div>
          </Link>
        ))
      )}
    </>
  );
}
