import React, { useEffect, useState } from 'react';
import { fetchScores, getOrCreateUserId, TypingTestRecord } from '../services/typingTestApi';

interface ScoreHistoryProps {
  refreshKey?: number; // increment to force reload
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ refreshKey = 0 }) => {
  const [scores, setScores] = useState<TypingTestRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userId = getOrCreateUserId();
    setLoading(true);
    setError(null);
    fetchScores(userId)
      .then((data) => {
        setScores(data || []);
      })
      .catch((e: any) => {
        setError(e?.message || 'Failed to load score history');
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <h3 className="text-xl font-semibold text-cyan-400 mb-3">Your Score History</h3>
      {loading && <p className="text-slate-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && (
        scores && scores.length > 0 ? (
          <ul className="space-y-2">
            {scores.map((s, idx) => (
              <li key={s.id || idx} className="flex justify-between items-center bg-slate-900/40 border border-slate-700 rounded-lg px-3 py-2">
                <span className="text-slate-300">WPM: <span className="text-emerald-400 font-semibold">{s.wordsPerMinute}</span></span>
                <span className="text-slate-300">Accuracy: <span className="text-amber-400 font-semibold">{s.accuracy}%</span></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No scores yet. Complete a test to see your history here.</p>
        )
      )}
    </div>
  );
};

export default ScoreHistory;
