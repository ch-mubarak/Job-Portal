require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const jobRoute = require("./routes/jobRoute");
const errorHandler = require("./middleware/errorHandler");
const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);
// app.use("/api/job", jobRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server up and running on port ${PORT}`));
