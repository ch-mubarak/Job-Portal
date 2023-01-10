require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();
app.use(express.json());

const authRoute = require("./routes/authRoute");
const applicationRoute = require("./routes/applicationRoute");
const jobRoute = require("./routes/jobRoute");

app.use("/api/auth", authRoute);
app.use("/api/jobs", jobRoute);
// app.use("/api/user", applicationRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server up and running on port ${PORT}`));
