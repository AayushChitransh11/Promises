import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:5001";

const eventVariants = {
  callStack: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1, transition: { duration: 0.5 } }, exit: { x: -50, opacity: 0, transition: { duration: 0.3 } } },
  microtaskQueue: { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1, transition: { duration: 0.4 } }, exit: { y: -20, opacity: 0, transition: { duration: 0.3 } } },
  callbackQueue: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } }, exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } } },
  eventLoop: { initial: { rotateX: 90, opacity: 0 }, animate: { rotateX: 0, opacity: 1, transition: { duration: 0.6 } }, exit: { rotateX: 90, opacity: 0, transition: { duration: 0.3 } } },
};

const EventLog = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const addEvent = (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
      setTimeout(() => {
        setEvents((prevEvents) => prevEvents.slice(1)); // Auto-remove event after 5 seconds
      }, 5000);
    };

    socket.on("call-stack", (event) => addEvent({ ...event, type: "callStack" }));
    socket.on("microtask-queue", (event) => addEvent({ ...event, type: "microtaskQueue" }));
    socket.on("callback-queue", (event) => addEvent({ ...event, type: "callbackQueue" }));
    socket.on("event-loop", (event) => addEvent({ ...event, type: "eventLoop" }));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="event-log p-4 bg-gray-900 text-white rounded-lg mt-4 shadow-md">
      <h2 className="text-lg font-bold mb-2">Event Log</h2>
      <ul className="space-y-2">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.li
              key={index}
              initial={eventVariants[event.type].initial}
              animate={eventVariants[event.type].animate}
              exit={eventVariants[event.type].exit}
              className={`p-2 rounded shadow ${
                event.type === "callStack"
                  ? "bg-blue-500"
                  : event.type === "microtaskQueue"
                  ? "bg-green-500"
                  : event.type === "callbackQueue"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              <strong>{event.eventType}:</strong> {event.message}{" "}
              <span className="text-sm text-gray-300">({new Date(event.timestamp).toLocaleTimeString()})</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default EventLog;
