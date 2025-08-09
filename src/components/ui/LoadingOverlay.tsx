import React from 'react';
import Spinner from './Spinner';
interface LoadingOverlayProps {
    loadingText?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingText = "Loading books..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-10">
            <Spinner size="16" color="zinc-200" />
            <p className="mt-6 text-lg font-semibold text-zinc-300">
                {loadingText}
            </p>
        </div>
    );
};

export default LoadingOverlay;