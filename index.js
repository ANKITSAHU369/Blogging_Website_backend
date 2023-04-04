const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

let port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const dbURI = process.env.CONNECTION_STRING;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(dbURI, options)
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

var generalSchema = new mongoose.Schema({}, { strict: false });
var UsersData = mongoose.model("users", generalSchema);
var BlogsData = mongoose.model("blogs", generalSchema);


// Get All Users
app.get("/getUsers", async (req, res) => {
  let data = await UsersData.find();
  data = JSON.parse(JSON.stringify(data));
  res.send(data);
});

// Get A Single Blog
app.get("/getBlog", async (req, res) => {
  let data = await BlogsData.find({blogId: Number(req.query.blogId)});
  if (data.length > 0) {
    data = JSON.parse(JSON.stringify(data[0]));
  }
  res.send(data);
});

// Get All Blogs
app.get("/getBlogs", async (req, res) => {
  let data = await BlogsData.find();
  data = JSON.parse(JSON.stringify(data));
  res.send(data);
});

// Add Blog
app.post("/addBlog", async (req, res) => {
  const blogToAdd =  new BlogsData(req.body);
  blogToAdd
  .save()
  .then((msg)=> res.status(200).json({data:msg}));
});

// Update Blog
app.put("/updateBlog", async (req, res) => {
  const data = await BlogsData.updateOne(
    { blogId: req.body.blogId },
    req.body
  );
  res.send(data);
});

// Delete Blog
app.delete('/deleteBlog', async (req, res) => {
  const data = await BlogsData.findOneAndDelete({blogId: Number(req.query.blogId)})
  res.status(200).send(data);
}) 

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
