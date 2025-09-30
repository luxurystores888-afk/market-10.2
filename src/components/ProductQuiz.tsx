import React, { useState } from 'react';

const QUESTIONS = [
  { q: 'What is your budget?', a: ['<$50', '$50-$200', '$200+'] },
  { q: 'Preferred style?', a: ['Minimal', 'Futuristic', 'Classic'] },
  { q: 'Main use?', a: ['Work', 'Gaming', 'Everyday'] },
];

const RECOMMENDATIONS = [
  'Cyber Widget Mini',
  'Pulse Pro Max',
  'Quantum Classic',
];

export const ProductQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // Demo: pick a recommendation based on answers
      setResult(RECOMMENDATIONS[newAnswers[0] % RECOMMENDATIONS.length]);
    }
  };

  if (result) {
    return (
      <div style={{
        background: '#23272f',
        color: '#fff',
        padding: 24,
        borderRadius: 16,
        textAlign: 'center',
        margin: '24px auto',
        maxWidth: 400,
        boxShadow: '0 4px 24px #0004',
      }}>
        <h2 style={{ color: '#00d084', marginBottom: 12 }}>🤖 Your Product Match</h2>
        <div style={{ fontSize: 20, margin: '16px 0' }}>{result}</div>
        <button onClick={() => { setStep(0); setAnswers([]); setResult(null); }}
          style={{ background: '#00d084', color: '#fff', padding: '8px 20px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#23272f',
      color: '#fff',
      padding: 24,
      borderRadius: 16,
      textAlign: 'center',
      margin: '24px auto',
      maxWidth: 400,
      boxShadow: '0 4px 24px #0004',
    }}>
      <h2 style={{ color: '#00bcd4', marginBottom: 12 }}>🧩 Product Finder Quiz</h2>
      <div style={{ fontSize: 18, marginBottom: 16 }}>{QUESTIONS[step].q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {QUESTIONS[step].a.map((ans, idx) => (
          <button
            key={ans}
            onClick={() => handleAnswer(idx)}
            style={{
              background: '#00bcd4',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
};
