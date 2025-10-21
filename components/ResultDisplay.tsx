
import React from 'react';

interface ResultDisplayProps {
    isLoading: boolean;
    generatedImage: string | null;
    error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error }) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg aspect-square p-4">
            {isLoading ? (
                <div className="flex flex-col items-center text-center">
                    <div className="animate-pulse bg-gray-700 w-64 h-64 rounded-lg mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-300">Generating your new look...</h3>
                    <p className="text-gray-400">This may take a moment.</p>
                </div>
            ) : error ? (
                <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-md">
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            ) : generatedImage ? (
                <img src={generatedImage} alt="Generated virtual try-on" className="max-h-full max-w-full object-contain rounded-md shadow-lg" />
            ) : (
                <div className="text-center text-gray-500">
                    <h3 className="text-lg font-semibold">Your virtual try-on will appear here</h3>
                    <p>Upload an image of a person and an item of clothing to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;
