var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');

var adminRouter = require("./routes/users/admin");
var farmersRouter = require("./routes/users/farmer");
var ownerRouter = require("./routes/users/owner");
var greenhouseRouter = require("./routes/greenhouses");
var productsRouter = require("./routes/products");
var shopsRouter = require("./routes/shops");
var usersRouter = require("./routes/users");
var stripeRouter = require("./routes/users/stripe")

var app = express();

app.use(
  cors({
    origin: "*"
  })
)

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users/admin", adminRouter);
app.use("/users/farmer", farmersRouter);
app.use("/users/owner", ownerRouter);
app.use("/greenhouses", greenhouseRouter);
app.use("/products", productsRouter);
app.use("/shops", shopsRouter);
app.use("/users", usersRouter);
app.use("/users/stripe", stripeRouter);


module.exports = app;
