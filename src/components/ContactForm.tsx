import React, { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '', honey: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (sent) {
    return (
      <div style={{ background: '#23272f', color: '#00d084', padding: 24, borderRadius: 16, margin: '24px auto', maxWidth: 500, textAlign: 'center', boxShadow: '0 4px 24px #0004' }}>
        <h2>✅ Thank you for contacting us!</h2>
        <div>We received your message and will get back to you soon.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#23272f', color: '#fff', padding: 24, borderRadius: 16, margin: '24px auto', maxWidth: 500, boxShadow: '0 4px 24px #0004' }}>
      <h2 style={{ color: '#00bcd4', marginBottom: 16 }}>📬 Contact Us</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8 }}
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8 }}
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Your Message"
        required
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, minHeight: 80 }}
      />
      {/* Honeypot field for spam protection */}
      <input
        name="honey"
        value={form.honey}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      <button
        type="submit"
        style={{ background: '#00d084', color: '#fff', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Send
      </button>
      <div style={{ fontSize: 14, color: '#aaa', marginTop: 8 }}>
        (Your message is protected from spam bots. For real email, connect to a backend or free service.)
      </div>
    </form>
  );
};
