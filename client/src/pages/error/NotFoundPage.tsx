import React, { type JSX } from 'react';

const NotFoundPage: React.FC = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-4">
      <h1 className="text-7xl font-extrabold mb-6">404</h1>
      <p className="text-xl text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="p-2 bg-blue-600 text-white font-medium rounded-sm shadow-md hover:bg-blue-700 transition-all duration-200"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
