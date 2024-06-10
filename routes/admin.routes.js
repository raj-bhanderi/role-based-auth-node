const express = require("express");
const router = express();

const {
  create,
  findAll,
  findOne,
  userDelete,
  update,
} = require("../controller/admin.controller");

const { authenticate } = require("../helper/middleware");
const { configureMulter } = require("../helper");
const { checkRole } = require("../helper/roleMiddleware");
const { ROLES } = require("../helper/localization");

router
  .post("/admin/user/create",checkRole([ROLES.ADMIN]), create)
  .get("/admin/user/all", authenticate, checkRole([ROLES.ADMIN]), findAll)
  .get("/admin/user/:id", authenticate, checkRole([ROLES.ADMIN, ROLES.USER]), findOne)
  .delete("/admin/user/:id", authenticate, checkRole([ROLES.ADMIN]), userDelete)
  .put(
    "/admin/user/:id",
    authenticate,
    checkRole([ROLES.ADMIN, ROLES.USER]),
    configureMulter("user")?.single("profile_image"),
    update
  );

module.exports = router;
