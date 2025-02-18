import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001";

const ApiTester = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const callApi = async (endpoint) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.get(`${API_URL}${endpoint}`);
      setResponse(res.data);
    } catch (error) {
      setResponse({ error: error.response ? error.response.data.error : error.message });
    }
    setLoading(false);
  };

  return (
    <div className="api-tester p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Test API Endpoints</h2>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-green-500 p-2 rounded shadow" onClick={() => callApi("/promise-chaining")}>Promise Chaining</button>
        <button className="bg-red-500 p-2 rounded shadow" onClick={() => callApi("/nested-promises")}>Nested Promises</button>
        <button className="bg-blue-500 p-2 rounded shadow" onClick={() => callApi("/promise-any")}>Promise.any()</button>
        <button className="bg-yellow-500 p-2 rounded shadow" onClick={() => callApi("/event-loop")}>Event Loop</button>
        <button className="bg-purple-500 p-2 rounded shadow" onClick={() => callApi("/promise-finally")}>Promise.finally()</button>
        <button className="bg-orange-500 p-2 rounded shadow" onClick={() => callApi("/blocking-task")}>Blocking Task</button>
        <button className="bg-gray-500 p-2 rounded shadow" onClick={() => callApi("/non-blocking-task")}>Non-Blocking Task</button>
      </div>
      {loading && <p className="mt-4 text-yellow-400">Loading...</p>}
      {response && (
        <div className="mt-4 p-4 bg-gray-800 rounded shadow">
          <h3 className="text-md font-semibold">Response:</h3>
          <pre className="text-sm text-green-400">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;
