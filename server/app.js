import "./env.js";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
