
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TestStatus, TestResult } from '../types';
import { fetchTypingTestPrompt } from '../services/geminiService';
import Results from './Results';
import Spinner from './Spinner';
import { TimerIcon } from './icons/TimerIcon';
import ScoreHistory from './ScoreHistory';
import { getOrCreateUserId, submitScore } from '../services/typingTestApi';

const Character = React.memo(({ char, state }: { char: string; state: 'correct' | 'incorrect' | 'current' | 'pending' }) => {
    const getCharClass = () => {
        switch (state) {
            case 'correct':
                return 'text-emerald-400';
            case 'incorrect':
                return 'text-red-500 underline decoration-red-500 decoration-2';
            case 'current':
                return 'bg-cyan-500 text-slate-900 rounded-sm animate-pulse';
            case 'pending':
            default:
                return 'text-slate-500';
        }
    };

    return <span className={`transition-colors duration-100 ${getCharClass()}`}>{char}</span>;
});

const TEST_DURATION = 30;

const TypingTest: React.FC = () => {
    const [status, setStatus] = useState<TestStatus>(TestStatus.Waiting);
    const [prompt, setPrompt] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(TEST_DURATION);
    const [results, setResults] = useState<TestResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [historyRefreshKey, setHistoryRefreshKey] = useState<number>(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const calculateResults = useCallback(() => {
        if (TEST_DURATION <= 0) return;

        const typedPromptSlice = prompt.substring(0, userInput.length);
        const correctChars = userInput.split('').filter((char, index) => char === typedPromptSlice[index]).length;
        const accuracy = userInput.length > 0 ? (correctChars / userInput.length) * 100 : 0;
        
        // CPM (Characters Per Minute) based on correct characters
        const cpm = (correctChars * 60) / TEST_DURATION;
        // WPM (Words Per Minute) - standard is CPM / 5
        const wpm = cpm / 5;

        setResults({
            wpm: Math.round(wpm),
            cpm: Math.round(cpm),
            accuracy: parseFloat(accuracy.toFixed(2)),
            time: TEST_DURATION,
        });
    }, [userInput, prompt]);

    const startNewTest = useCallback(async () => {
        setIsLoading(true);
        setStatus(TestStatus.Waiting);
        setUserInput('');
        setTimeLeft(TEST_DURATION);
        setResults(null);
        
        const newPrompt = await fetchTypingTestPrompt();
        setPrompt(newPrompt);
        setIsLoading(false);
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        startNewTest();
    }, [startNewTest]);

    // Timer effect
    useEffect(() => {
        if (status === TestStatus.Started && timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else if (status === TestStatus.Started && timeLeft === 0) {
            setStatus(TestStatus.Finished);
        }
    }, [status, timeLeft]);

    // Result calculation effect
    useEffect(() => {
        if (status === TestStatus.Finished) {
            calculateResults();
        }
    }, [status, calculateResults]);

    // Submit score when results are available
    useEffect(() => {
        const submit = async () => {
            if (status !== TestStatus.Finished || !results) return;
            try {
                const userId = getOrCreateUserId();
                await submitScore({
                    userId,
                    wordsPerMinute: results.wpm,
                    accuracy: Math.round(results.accuracy),
                });
                setHistoryRefreshKey((k) => k + 1);
            } catch (e) {
                // swallow error to avoid breaking UI; could add toast/log in future
                console.error('Failed to submit score', e);
            }
        };
        submit();
    }, [results, status]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (status === TestStatus.Finished) return;

        if (status === TestStatus.Waiting && value.length > 0) {
            setStatus(TestStatus.Started);
        }

        if (value.length <= prompt.length) {
            setUserInput(value);
        }
    };
    
    const renderPrompt = () => {
        return prompt.split('').map((char, index) => {
            let state: 'correct' | 'incorrect' | 'current' | 'pending' = 'pending';
            if (index < userInput.length) {
                state = char === userInput[index] ? 'correct' : 'incorrect';
            } else if (index === userInput.length) {
                state = 'current';
            }
            return <Character key={`${char}-${index}`} char={char} state={state} />;
        });
    };

    return (
        <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-700 w-full"
            onClick={() => inputRef.current?.focus()}
        >
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 flex items-center space-x-2">
                            <TimerIcon />
                            <span className="text-xl font-semibold text-cyan-400">{timeLeft}s</span>
                        </div>
                        {status !== TestStatus.Finished && <p className="text-slate-400">{userInput.length} / {prompt.length}</p>}
                    </div>
                    
                    <div className="text-2xl tracking-wide leading-relaxed mb-6 select-none" style={{ minHeight: '112px' }}>
                        {renderPrompt()}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        className="opacity-0 absolute w-0 h-0"
                        autoFocus
                        disabled={status === TestStatus.Finished}
                    />

                    {status === TestStatus.Finished && results && (
                        <Results results={results} onRestart={startNewTest} />
                    )}

                    {status !== TestStatus.Finished && (
                      <div className="flex justify-center mt-6">
                          <button
                              onClick={startNewTest}
                              className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                          >
                              Restart
                          </button>
                      </div>
                    )}
                </>
            )}

            {/* History Section */}
            <ScoreHistory refreshKey={historyRefreshKey} />
        </div>
    );
};

export default TypingTest;
