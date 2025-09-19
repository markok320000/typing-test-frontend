
import React from 'react';
import TypingTest from './components/TypingTest';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 font-mono p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider">
          Gemini Typing Test
        </h1>
        <p className="text-slate-400 mt-2">How fast can you type? Get a new challenge every time.</p>
      </header>
      <main className="w-full max-w-4xl">
        <TypingTest />
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Powered by React, Tailwind CSS, and the Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
