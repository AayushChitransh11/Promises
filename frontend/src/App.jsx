import React from "react";
import ApiTester from "./components/ApiTester";
import EventLog from "./components/EventLog";
import "./index.css";

function App() {
  return (
    <div className="container">
      <h1>JavaScript Promises Visualizer</h1>
      <ApiTester />
      <EventLog />
    </div>
  );
}

export default App;
