import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; // Ensure this is correct

const EventLog = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("call-stack", (data) => addEvent(data));
    socket.on("microtask-queue", (data) => addEvent(data));
    socket.on("callback-queue", (data) => addEvent(data));
    socket.on("event-loop", (data) => addEvent(data));

    return () => socket.disconnect();
  }, []);

  const addEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  return (
    <div className="event-log">
      <h2>Event Log</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.eventType}:</strong> {event.message} <span>({new Date(event.timestamp).toLocaleTimeString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
