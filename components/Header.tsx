
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                Virtual Try-On Studio
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Powered by Gemini 2.5 Flash Image
            </p>
        </header>
    );
};

export default Header;
