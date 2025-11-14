// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const sessionRoutes = require("./routes/session.routes.js");
const userRoutes = require("./routes/user.routes.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// app.use(jwtCheck);

app.use("/session", sessionRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
