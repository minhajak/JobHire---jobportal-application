import React from "react";

const ErrorAlert: React.FC<{ message?: string }> = ({ message }) => {
  if (message) {
    return (
      <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default ErrorAlert;
