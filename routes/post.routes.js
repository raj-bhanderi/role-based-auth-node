const express = require("express");
const router = express();
const {
  create,
  findAll,
  findOne,
  deletePost,
  update,
} = require("../controller/post.controller");
const { authenticate } = require("../helper/middleware");
const { configureMulter } = require("../helper");

router
  .get("/post/all", authenticate, findAll)
  .post(
    "/post/create",
    authenticate,
    configureMulter("post")?.single("image"),
    create
  )
  .put("/post/:id", authenticate, update)
  .get("/post/:id", authenticate, findOne)
  .delete("/post/:id", authenticate, deletePost);

module.exports = router;
