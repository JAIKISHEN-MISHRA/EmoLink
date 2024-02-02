
  import express from 'express';
  import bodyParser from 'body-parser';
  import mongoose from 'mongoose';
  import { config } from 'dotenv';
  import cors from 'cors';
  import multer from 'multer';
  import http from 'http';
  import { Server as SocketIOServer } from 'socket.io';
  import auth from './routes/auth.js';
  import addPost from './routes/addPost.js';
  import getPost from './routes/getPost.js';
  import analyticsRouter from './routes/analytics.js';
  import profileRouter from './routes/profile.js';
  import chatRoute from './routes/chatRoutes.js';
  import messageRouter from './routes/messageRoutes.js';
  import setupSocketIO from './config/socket.js';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';
  import friendRouter from './routes/friendrequest.js';
  import { spawn } from 'child_process';
  import Storyrouter from './routes/addStory.js';
  
  config();
  
  const app = express();
  const server = http.createServer(app);
  
  app.use(bodyParser.json());
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  }));
  
  // Define routes after applying CORS middleware
  app.use(auth);
  app.use('/chat', chatRoute);
  app.use('/message', messageRouter);
  app.use('/api/addPost', multer({ storage: multer.memoryStorage() }).single('image'), addPost);
  app.use('/api/getPost', getPost);
  app.use('/analytics', analyticsRouter);
  app.use('/profile', profileRouter);
  app.use('/friendRequests', friendRouter);
  app.use(Storyrouter);

 
  
  // Set up Socket.io with the server
  const io = new SocketIOServer(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    },
  });
  
  // Call setupSocketIO function
  setupSocketIO(io);
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  app.post('/predict-sentiment', (req, res) => {
    // const { text } = req.body;
    const { text } = "I have best parents in world";


    // Spawn a child process to execute the Python script
    const pythonProcess = spawn('python',['config/Model.py', text]);

    // Capture the output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        const prediction = parseInt(data.toString().trim(), 10);
        const sentiment = prediction === 0 ? 'Negative' : 'Positive';
        console.log(prediction+" "+sentiment);
        // res.json({ prediction, sentiment });
    });

    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: 'An error occurred while predicting sentiment' });
    });
});
  app.get('/forgot-pass/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'components/forgotpass', 'forgot.html'));
  });
  
  const CONNECTION_URL = process.env.MONGODB_URI;
  const PORT = process.env.PORT || 5000;
  
  mongoose
    .connect(CONNECTION_URL)
    .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
  