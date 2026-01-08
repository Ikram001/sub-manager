import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import subRoutes from "./routes/subRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sub-manager";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Connection Error:", err));

app.use("/api/subs", subRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
