
import React, { useRef, useState, useCallback } from 'react';
import PhotoIcon from './icons/PhotoIcon';

interface ImageUploaderProps {
    id: string;
    label: string;
    onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFileName(file.name);
            onImageUpload(file);
        }
    };

    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };
    
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImagePreview(URL.createObjectURL(file));
            setFileName(file.name);
            onImageUpload(file);
        }
    }, [onImageUpload]);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div
                onClick={handleAreaClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors duration-200 aspect-square bg-gray-800/50"
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                    <div className="space-y-1 text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                        <div className="flex text-sm text-gray-400">
                            <p className="pl-1">Click to upload or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                )}
            </div>
            <input
                id={id}
                name={id}
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
             {fileName && <p className="text-xs text-gray-400 mt-2 truncate">{fileName}</p>}
        </div>
    );
};

export default ImageUploader;
