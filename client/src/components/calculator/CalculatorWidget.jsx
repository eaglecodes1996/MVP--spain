import { useState, useRef } from 'react';
import { validateCalculatorCode } from '../../api/subjects';

/**
 * Smart calculator widget. When user enters code "2012", onCodeUnlock is called.
 * Input is validated (digits only, max length) before sending to backend.
 */
export function CalculatorWidget({ onCodeUnlock }) {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState('');
  const lastCheck = useRef('');

  const append = (char) => {
    if (display.length >= 8) return;
    if (char !== '0' && char !== '1' && char !== '2' && char !== '3' && char !== '4' && char !== '5' && char !== '6' && char !== '7' && char !== '8' && char !== '9' && char !== '.' && char !== '+' && char !== '-' && char !== '*' && char !== '/') return;
    setError('');
    const next = display + char;
    setDisplay(next);
    if (next === '2012') {
      onCodeUnlock('2012');
      return;
    }
    if (next.length >= 4 && /^[0-9]+$/.test(next) && next !== lastCheck.current) {
      lastCheck.current = next;
      validateCalculatorCode(next)
        .then((res) => {
          if (res.valid && res.code === '2012') onCodeUnlock('2012');
        })
        .catch(() => {});
    }
  };

  const clear = () => {
    setDisplay('');
    setError('');
    lastCheck.current = '';
  };

  const evaluate = () => {
    try {
      const sanitized = display.replace(/[^0-9+\-*/().\s]/g, '');
      if (sanitized.length > 20) {
        setError('Expression too long');
        return;
      }
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('Invalid');
      setDisplay(String(result));
    } catch {
      setError('Invalid expression');
    }
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="sec-title">Calculator</div>
      <div
        style={{
          padding: '12px 14px',
          background: 'rgba(0,0,0,.2)',
          borderRadius: 10,
          fontFamily: 'monospace',
          fontSize: 18,
          marginBottom: 10,
          minHeight: 44,
          color: 'var(--text)',
        }}
      >
        {display || '0'}
      </div>
      {error && <div style={{ fontSize: 12, color: '#ff6b6b', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((k) => (
          <button
            key={k}
            type="button"
            onClick={k === '=' ? evaluate : () => (k === 'C' ? clear() : append(k))}
            style={{
              padding: 14,
              border: '1px solid var(--border)',
              borderRadius: 10,
              background: k === '=' ? 'linear-gradient(135deg, var(--green-light), var(--green))' : 'rgba(255,255,255,.06)',
              color: k === '=' ? 'var(--bg)' : 'var(--text)',
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          onClick={clear}
          style={{
            gridColumn: 'span 2',
            padding: 14,
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'rgba(255,255,255,.06)',
            color: 'var(--text)',
            fontSize: 16,
          }}
        >
          Clear
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
        Tip: enter a 4-digit code to unlock something special.
      </p>
    </div>
  );
}
