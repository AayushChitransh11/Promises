import React from "react";
import axios from "axios";

const API_URL = "http://localhost:5001"; // Ensure this is the correct backend URL

const ApiTester = () => {
  const callApi = async (endpoint) => {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      alert(`Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="api-tester">
      <h2>Test API Endpoints</h2>
      <button onClick={() => callApi("/promise-chaining")}>Promise Chaining</button>
      <button onClick={() => callApi("/nested-promises")}>Nested Promises</button>
      <button onClick={() => callApi("/promise-any")}>Promise.any()</button>
      <button onClick={() => callApi("/event-loop")}>Event Loop</button>
      <button onClick={() => callApi("/promise-finally")}>Promise.finally()</button>
      <button onClick={() => callApi("/blocking-task")}>Blocking Task</button>
      <button onClick={() => callApi("/non-blocking-task")}>Non-Blocking Task</button>
    </div>
  );
};

export default ApiTester;
