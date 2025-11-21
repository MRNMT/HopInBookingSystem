// --- 1. Import necessary libraries ---
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// --- Import your new v1 router ---
import router from './api/v1/index'; // This imports the master router from index.ts


dotenv.config();

// --- 3. Create the Express App ---
// This is the main object that represents our entire web application
const app = express();

// --- 4. Use Middleware ---
// 'app.use()' is how we "plug in" features to our app.

// (a) CORS (Cross-Origin Resource Sharing)
// Your Customer-app (React) and Backend (Node) will run on different addresses
// (e.g., localhost:3000 and localhost:5000). By default, browsers block
// this for security. 'cors()' tells the browser it's safe.
app.use(cors());

// (b) Express JSON Parser
// This middleware reads incoming requests and checks if they have a JSON
// body (e.g., { "email": "test@test.com" }). If so, it parses it
// and makes it available to us in 'req.body'.
app.use(express.json());

// --- 5. Define Your Routes ---

// (a) A simple "test" route to check if the server is alive
// This just says "if someone does a GET request to '/', send this text"
app.get("/", (req: Request, res: Response) => {
  res.send("Hotel App Backend is running!");
});

// (b) Your *real* API routes
// We use the v1Router we imported.
// This tells the app that any URL starting with '/api/v1'
// should be handled by our new v1Router file.
app.use('/api/v1', router);

// --- 6. Export the App ---
// We export the 'app' object so that our server.ts file can import
// and run it. This is the most important part!
export default app;
