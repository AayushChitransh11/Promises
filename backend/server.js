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

// Emit events to frontend for visualization
const emitEvent = (eventType, message) => {
    io.emit(eventType, { eventType, message, timestamp: Date.now() });
};

// Root Route
app.get('/', (req, res) => {
    res.send('Running JavaScript Promises Visualizer Backend');
});

// Simulate Chained Promises Execution
app.get('/promise-chaining', async (req, res) => {
    emitEvent('call-stack', 'Creating a chained promise');

    const result = await new Promise((resolve) => {
        setTimeout(() => {
            emitEvent('microtask-queue', 'First promise resolved, chaining next promise');
            resolve('Step 1 Done');
        }, 1000);
    }).then((data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                emitEvent('microtask-queue', 'Second promise resolved');
                resolve(data + ' → Step 2 Done');
            }, 2000);
        });
    }).then((data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                emitEvent('microtask-queue', 'Final promise resolved');
                resolve(data + ' → Step 3 Done');
            }, 3000);
        });
    });

    emitEvent('event-loop', 'Chained promises execution completed');
    res.json({ message: result });
});

//  Nested Promises (Callback Hell Simulation)
app.get('/nested-promises', async (req, res) => {
    emitEvent('call-stack', 'Creating nested promises');

    new Promise((resolve) => {
        setTimeout(() => {
            emitEvent('microtask-queue', 'First promise resolved');
            resolve('Level 1 Done');
        }, 1000);
    }).then((data) => {
        new Promise((resolve) => {
            setTimeout(() => {
                emitEvent('microtask-queue', 'Second nested promise resolved');
                resolve(data + ' → Level 2 Done');
            }, 2000);
        }).then((nestedData) => {
            new Promise((resolve) => {
                setTimeout(() => {
                    emitEvent('microtask-queue', 'Third nested promise resolved');
                    resolve(nestedData + ' → Level 3 Done');
                }, 3000);
            }).then((finalData) => {
                emitEvent('event-loop', 'Nested promises completed');
                res.json({ message: finalData });
            });
        });
    });
});

//  Demonstrate Promise.any()
app.get('/promise-any', async (req, res) => {
    emitEvent('call-stack', 'Starting Promise.any()');

    const promise1 = new Promise((_, reject) => setTimeout(() => reject('Promise 1 failed'), 1000));
    const promise2 = new Promise((resolve) => setTimeout(() => resolve('Promise 2 resolved'), 2000));
    const promise3 = new Promise((_, reject) => setTimeout(() => reject('Promise 3 failed'), 3000));

    emitEvent('microtask-queue', 'Waiting for first resolved promise in Promise.any()');

    try {
        const result = await Promise.any([promise1, promise2, promise3]);
        emitEvent('event-loop', 'Promise.any resolved first promise');
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'All promises failed' });
    }
});

//  Demonstrate Event Loop Behavior (setTimeout inside Promise)
app.get('/event-loop', async (req, res) => {
    emitEvent('call-stack', 'Starting event loop demonstration');

    console.log('Script Start');
    emitEvent('call-stack', 'Script Start');

    setTimeout(() => {
        console.log('setTimeout Callback');
        emitEvent('callback-queue', 'setTimeout executed after delay');
    }, 2000);

    const promise = new Promise((resolve) => {
        console.log('Promise Executed');
        emitEvent('microtask-queue', 'Promise executed immediately');
        resolve('Promise Resolved');
    });

    promise.then((message) => {
        console.log(message);
        emitEvent('microtask-queue', 'Promise then() executed');
    });

    console.log('Script End');
    emitEvent('call-stack', 'Script End');

    res.json({ message: 'Check console for event loop behavior' });
});

//  Demonstrate Promise.finally()
app.get('/promise-finally', async (req, res) => {
    emitEvent('call-stack', 'Starting Promise.finally() demo');

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                resolve('Promise succeeded');
                emitEvent('microtask-queue', 'Promise succeeded, moving to microtask queue');
            } else {
                reject('Promise failed');
                emitEvent('microtask-queue', 'Promise failed, moving to microtask queue');
            }
        }, 2000);
    });

    promise
        .then((message) => {
            emitEvent('event-loop', 'Handling successful promise resolution');
            res.json({ message });
        })
        .catch((error) => {
            emitEvent('event-loop', 'Handling promise rejection');
            res.status(500).json({ error });
        })
        .finally(() => {
            emitEvent('callback-queue', 'Promise.finally() executed');
        });
});

//  Demonstrate long-running task with blocking vs non-blocking behavior
app.get('/blocking-task', (req, res) => {
    emitEvent('call-stack', 'Starting long blocking task');

    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
        sum += i;
    }

    emitEvent('event-loop', 'Blocking task completed');
    res.json({ message: `Blocking task completed, sum = ${sum}` });
});

app.get('/non-blocking-task', (req, res) => {
    emitEvent('call-stack', 'Starting non-blocking task');

    setTimeout(() => {
        emitEvent('callback-queue', 'Non-blocking task executed');
        res.json({ message: 'Non-blocking task completed' });
    }, 3000);
});

//  Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('Client connected to WebSocket');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
