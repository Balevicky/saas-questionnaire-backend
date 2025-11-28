import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import regionRoutes from "./routes/region";
import departmentRoutes from "./routes/department";
import sectorRoutes from "./routes/sector";
import villageRoutes from "./routes/village";
import { authenticateJWT } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes publiques
app.use("/api", authRoutes);
// app.use("/:tenant/auth", authRoutes);

// Routes protégées
app.use("/api/regions", authenticateJWT, regionRoutes);
app.use("/api/departments", authenticateJWT, departmentRoutes);
app.use("/api/sectors", authenticateJWT, sectorRoutes);
app.use("/api/villages", authenticateJWT, villageRoutes);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
