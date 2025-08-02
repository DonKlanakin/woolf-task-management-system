const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const apiErrorHandler = require("./utils/apiErrorHandler");
const dateTimeManager = require("./utils/dateTimeManager");

dotenv.config({ path: "./configs/config.env" });
const port = process.env.PORT || 8080;

const app = express();
app.use(helmet());
app.use(express.json({limit : "100kb"}));
app.use(express.static("./public"));
app.use(morgan("dev"));
app.use(dateTimeManager.updateRequestInfo);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/", systemRoutes);
app.use(apiErrorHandler);
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
