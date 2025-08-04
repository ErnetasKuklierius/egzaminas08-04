const dotenv = require("dotenv")
const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes.js");
const adsRouter = require("./routes/adsRoutes.js");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config()

app.use(express.json());
app.use(cors());
app.options("", cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

//ROUTES
app.use("/users", userRouter); // www.localhost:3000/users/register
app.use("/ads", adsRouter); // www.localhost:3000/ads


app.listen(`${process.env.PORT}`, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
