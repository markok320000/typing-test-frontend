
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
        <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-cyan-400 border-t-transparent"
        ></div>
        <p className="text-slate-400">Generating new prompt...</p>
    </div>
  );
};

export default Spinner;
