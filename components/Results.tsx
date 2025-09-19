
import React from 'react';
import { TestResult } from '../types';
import { SpeedIcon } from './icons/SpeedIcon';
import { AccuracyIcon } from './icons/AccuracyIcon';
import { TimerIcon } from './icons/TimerIcon';

interface ResultsProps {
    results: TestResult;
    onRestart: () => void;
}

const ResultCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit: string; colorClass: string }> = ({ icon, label, value, unit, colorClass }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center">
        <div className={`flex items-center space-x-2 ${colorClass}`}>
            {icon}
            <span className="text-lg font-semibold text-slate-300">{label}</span>
        </div>
        <p className={`text-4xl font-bold mt-2 ${colorClass}`}>
            {value} <span className="text-xl font-normal text-slate-400">{unit}</span>
        </p>
    </div>
);


const Results: React.FC<ResultsProps> = ({ results, onRestart }) => {
    return (
        <div className="animate-fade-in mt-6 text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Test Complete!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <ResultCard
                    icon={<SpeedIcon />}
                    label="WPM"
                    value={results.wpm}
                    unit=""
                    colorClass="text-emerald-400"
                />
                <ResultCard
                    icon={<AccuracyIcon />}
                    label="Accuracy"
                    value={results.accuracy}
                    unit="%"
                    colorClass="text-amber-400"
                />
                <ResultCard
                    icon={<TimerIcon />}
                    label="Time"
                    value={results.time}
                    unit="s"
                    colorClass="text-sky-400"
                />
            </div>
            <button
                onClick={onRestart}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200 ease-in-out transform hover:scale-105"
            >
                Try Again
            </button>
        </div>
    );
};

export default Results;
