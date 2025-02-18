import React from "react";
import ApiTester from "./components/ApiTester";
import EventLog from "./components/EventLog";
import "./index.css";

function App() {
  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">JavaScript Promises Visualizer</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ApiTester />
        <EventLog />
      </div>
    </div>
  );
}

export default App;
