import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const SOCKET_URL = "http://localhost:5001";

const EventLog = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const addEvent = (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
      setTimeout(() => {
        setEvents((prevEvents) => prevEvents.slice(1)); // Auto-remove event
      }, 5000);
    };

    socket.on("call-stack", addEvent);
    socket.on("microtask-queue", addEvent);
    socket.on("callback-queue", addEvent);
    socket.on("event-loop", addEvent);

    return () => socket.disconnect();
  }, []);

  return (
    <div className="event-log p-4 bg-gray-900 text-white rounded-lg mt-4 shadow-md">
      <h2 className="text-lg font-bold mb-2">Event Log</h2>
      <ul className="space-y-2">
        {events.map((event, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-2 bg-blue-500 rounded shadow"
          >
            <strong>{event.eventType}:</strong> {event.message} <span className="text-sm text-gray-300">({new Date(event.timestamp).toLocaleTimeString()})</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
