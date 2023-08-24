require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windoMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const { RateLimiter } = require("rate-limiter");

app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
