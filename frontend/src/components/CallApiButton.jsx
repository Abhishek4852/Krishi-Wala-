import React, { useState } from 'react';
import { API_BASE_URL } from "../config";

const CallApiButton = () => {
  const [token, setToken] = useState('');

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings/abhishek4852`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      alert(JSON.stringify(data));
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <input
        type="text"
        placeholder="Enter Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border border-gray-300 rounded-lg text-black px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-black font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Call API
      </button>
    </div>
  );
};

export default CallApiButton;