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


app.use(express.static(path.resolve("./frontend/public")));


app.get('/home', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/playlist', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/browse', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

app.get('/add', (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});
app.get('/admin', (req, res) => {
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

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./backend/userApi.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
