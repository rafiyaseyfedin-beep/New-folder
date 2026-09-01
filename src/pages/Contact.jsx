import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        Get in <span className="gradient-text">Touch</span>
      </h1>

      {submitted ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Message Sent!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Name</label>
            <input required type="text" placeholder="Your name" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
            <input required type="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Message</label>
            <textarea required rows={4} placeholder="How can we help?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Send Message</button>
        </form>
      )}
    </div>
  );
}
