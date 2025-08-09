// src/components/ui/Spinner.tsx

import React from 'react';

interface SpinnerProps {
    /**
     * The size of the spinner. Maps to h- and w- Tailwind classes.
     * @default '12' -> h-12 w-12
     */
    size?: string;
    /**
     * The main color of the spinner's moving part.
     * @default 'teal-500'
     */
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = '12', color = 'zinc-500' }) => {
    const spinnerColorClass = `border-t-${color}`;
    const spinnerSizeClass = `h-${size} w-${size}`;

    return (
        <div
            className={`
                animate-spin 
                rounded-full 
                border-4 
                border-solid 
                border-zinc-200 
                ${spinnerColorClass} 
                ${spinnerSizeClass}
            `}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;