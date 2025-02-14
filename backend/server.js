const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running JavaScript Promises Visualizer Backend');
});

// Function to emit events to the frontend
const emitEvent = (eventType, message) => {
    io.emit(eventType, { eventType, message, timestamp: Date.now() });
};

// Simulate a simple resolved promise
app.get('/promise-resolve', async (req, res) => {
    emitEvent('call-stack', 'Promise created');
    
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve('Promise resolved');
            emitEvent('microtask-queue', 'Promise resolved, moving to microtask queue');
        }, 2000);
    });

    const result = await promise;
    res.json({ message: result });
});

// Simulate a rejected promise
app.get('/promise-reject', async (req, res) => {
    emitEvent('call-stack', 'Promise created');

    const promise = new Promise((_, reject) => {
        setTimeout(() => {
            reject('Promise rejected');
            emitEvent('microtask-queue', 'Promise rejected, moving to microtask queue');
        }, 2000);
    });

    try {
        const result = await promise;
        res.json({ message: result });
    } catch (error) {
        emitEvent('event-loop', 'Handling promise rejection');
        res.status(500).json({ error });
    }
});

// Demonstrate Promise.all
app.get('/promise-all', async (req, res) => {
    emitEvent('call-stack', 'Creating multiple promises');

    const promise1 = new Promise((resolve) => setTimeout(() => resolve('Promise 1 resolved'), 1000));
    const promise2 = new Promise((resolve) => setTimeout(() => resolve('Promise 2 resolved'), 2000));
    const promise3 = new Promise((resolve) => setTimeout(() => resolve('Promise 3 resolved'), 3000));

    emitEvent('microtask-queue', 'Waiting for all promises in Promise.all');

    const results = await Promise.all([promise1, promise2, promise3]);
    emitEvent('event-loop', 'All promises resolved, moving to event loop');

    res.json({ message: 'All promises resolved', results });
});

// Demonstrate Promise.race
app.get('/promise-race', async (req, res) => {
    emitEvent('call-stack', 'Creating race between promises');

    const promise1 = new Promise((resolve) => setTimeout(() => resolve('Fastest promise wins!'), 1000));
    const promise2 = new Promise((resolve) => setTimeout(() => resolve('Slow promise'), 3000));

    emitEvent('microtask-queue', 'Waiting for the fastest promise in race');

    const result = await Promise.race([promise1, promise2]);
    emitEvent('event-loop', 'Promise.race resolved, moving to event loop');

    res.json({ message: result });
});

// Demonstrate async/await execution
app.get('/async-await', async (req, res) => {
    emitEvent('call-stack', 'Starting async function');

    try {
        const result = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.5) {
                    resolve('Async operation succeeded');
                    emitEvent('microtask-queue', 'Async operation succeeded, moving to microtask queue');
                } else {
                    reject('Async operation failed');
                    emitEvent('microtask-queue', 'Async operation failed, moving to microtask queue');
                }
            }, 2000);
        });

        res.json({ message: result });
    } catch (error) {
        emitEvent('event-loop', 'Handling async/await rejection');
        res.status(500).json({ error });
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('Client connected to WebSocket');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
