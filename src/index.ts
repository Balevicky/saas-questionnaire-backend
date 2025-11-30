import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth";

const regionRoute = require("./routes/regionRoute");
const departmentRoute = require("./routes/departmentRoute");
const sectorRoute = require("./routes/sectorRoute");
const villageRoute = require( "./routes/villageRoute");
// import departmentRoutes from "./routes/departmentRoute";
// import sectorRoutes from "./routes/sectorRoute";
// import { authenticateJWT } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes publiques
app.use("/api", authRoutes);
// app.use("/api/:tenant/auth", authRoutes);
//localhost:4000/api/boli/auth/login
// app.use("/:tenant/auth", authRoutes);

// Routes protégées
http: app.use("/api", regionRoute);
app.use("/api", departmentRoute);
app.use("/api", sectorRoute);
app.use("/api", villageRoute);
// app.use("/api/departments", authenticateJWT, departmentRoute);
// app.use("/api/sectors", authenticateJWT, sectorRoutes);
// app.use("/api/villages", authenticateJWT, villageRoutes);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
