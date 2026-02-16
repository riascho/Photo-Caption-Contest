import express from "express";
import session from "express-session";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { initializeRepositories } from "./repositories";
import { viewsRouter } from "./routes/views";
import { apiRouter } from "./routes/api";
import { authRouter } from "./routes/auth";
import { seedImages } from "./seed";
import { swaggerSpec } from "./swagger";

const app = express(); // creating express app
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs"); // sets EJS as the view engine
app.set("views", path.join(__dirname, "../views")); // sets the views directory
app.use(expressLayouts); // enables layout support
app.set("layout", "layout"); // sets layout.ejs as the default layout

// Middleware

app.use(express.json()); // for API requests
app.use(express.urlencoded({ extended: true })); // for HTML form submissions
app.use(express.static(path.join(__dirname, "../public"))); // serves static files from the public directory

// Session configuration
const sessionOptions: session.SessionOptions = {
  name: "connect.sid", // default cookie name
  secret: process.env.SESSION_SECRET || "default_secret", // should be set in environment variable for production
  resave: false,
  saveUninitialized: false,
  store: new session.MemoryStore(), // In production, use a more robust session store like connect-redis
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production (requires HTTPS)
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "strict",
  },
};
app.use(session(sessionOptions));

declare module "express-session" {
  // extends the SessionData interface to include our custom properties
  interface SessionData {
    userId?: number;
    userName?: string;
  }
}

// Middleware to make session data available to all routes (via express response object)
app.use((req, res, next) => {
  // the res.locals object is available in all EJS templates, so we can use it to pass session data to the views
  res.locals.userId = req.session.userId;
  res.locals.userName = req.session.userName;
  next();
});

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
app.use("/", viewsRouter);
app.use("/api", apiRouter);
app.use("/", authRouter);

// Initialize database
AppDataSource.initialize() // connects to db using config from data-source.ts
  .then(async () => {
    initializeRepositories(AppDataSource); // initializes repositories with the connected data source

    // seed initial images if db empty
    await seedImages();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });
