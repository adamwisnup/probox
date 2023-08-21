const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
// const DB_HOST = process.env.DB_HOST;

const telemetryRoutes = require("./routes/telemetry.js");
const proboxRoutes = require("./routes/probox.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", telemetryRoutes);
app.use("/api", proboxRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(`Server is running on port ${DB_HOST}`);
});
