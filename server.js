const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.static("./public"));
app.use(morgan());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ statusCode: 200, message: "Hello, world" });
});

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/post.routes"));
app.use("/api", require("./routes/admin.routes"));



const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server on port number ${PORT}`);
    });
  })
  .on("error", (error) => {
    console.log("Connection error:", error);
  });

