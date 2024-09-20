import express from "express";
import * as path from "node:path";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import session from 'express-session';

const UserRoutes = require(path.resolve("./backend/userApi.js"));
const connectDB = require(path.resolve("./backend/db.js"));
dotenv.config();

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api', UserRoutes);

// Serve static files
app.use(express.static(path.resolve("./frontend/public")));

// Catch-all route for serving the frontend application
app.get('/home', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/profile/*', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/playlist/*', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/browse', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/add/*', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});


const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
