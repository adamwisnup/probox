const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT;

const telemetryRoutes = require("./routes/telemetry.js");
const proboxRoutes = require("./routes/probox.js");

const app = express();

app.use(express.json());
app.use("/api", telemetryRoutes);
app.use("/api", proboxRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
