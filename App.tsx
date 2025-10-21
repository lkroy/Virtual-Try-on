
import React, { useState } from 'react';
import type { ImageFile } from './types';
import { generateVirtualTryOn } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
    const [personImage, setPersonImage] = useState<ImageFile | null>(null);
    const [clothingImage, setClothingImage] = useState<ImageFile | null>(null);
    const [prompt, setPrompt] = useState('Combine the two images. Place the clothing item from the second image onto the person in the first image, creating a realistic "virtual try-on" look. Maintain the original background and the person\'s pose.');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fileToImageFile = (file: File): Promise<ImageFile> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const mimeType = result.split(';')[0].split(':')[1];
                const base64 = result.split(',')[1];
                if (!mimeType || !base64) {
                    reject(new Error("Failed to parse file data."));
                    return;
                }
                resolve({ base64, mimeType });
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (file: File, setImage: React.Dispatch<React.SetStateAction<ImageFile | null>>) => {
        if (!file) return;
        try {
            const imageFile = await fileToImageFile(file);
            setImage(imageFile);
        } catch (err) {
            setError('Failed to load image. Please try another file.');
            console.error(err);
        }
    };

    const handleGenerate = async () => {
        if (!personImage || !clothingImage) {
            setError('Please upload both a person and a clothing image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateVirtualTryOn(personImage, clothingImage, prompt);
            setGeneratedImage(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const isButtonDisabled = !personImage || !clothingImage || isLoading;

    return (
        <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-900 text-gray-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div className="flex flex-col gap-6">
                    <Header />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ImageUploader id="person-image" label="1. Upload Person" onImageUpload={(file) => handleImageUpload(file, setPersonImage)} />
                        <ImageUploader id="clothing-image" label="2. Upload Clothing" onImageUpload={(file) => handleImageUpload(file, setClothingImage)} />
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                           3. Refine with a prompt (optional)
                        </label>
                        <textarea
                            id="prompt"
                            rows={4}
                            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-500"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Change the background to a beach"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isButtonDisabled}
                        className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Generating...' : 'Virtual Try-On'}
                    </button>
                </div>

                {/* Right Column: Output */}
                <div className="lg:sticky top-8 self-start">
                    <ResultDisplay
                        isLoading={isLoading}
                        generatedImage={generatedImage}
                        error={error}
                    />
                </div>
            </div>
        </main>
    );
};

export default App;
