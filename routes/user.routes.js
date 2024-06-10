const express = require("express");
const router = express();

const {
  findOne,
  update,
} = require("../controller/user.controller");
const { authenticate } = require("../helper/middleware");
const { configureMulter } = require("../helper");
const { checkRole } = require("../helper/roleMiddleware");
const { ROLES } = require("../helper/localization");
const { updateUserSchema } = require("../validation/user.validation");

router
  .get("/user", authenticate, checkRole([ROLES.ADMIN, ROLES.USER]), findOne)
  .put(
    "/user",
    updateUserSchema,
    authenticate,
    checkRole([ROLES.ADMIN, ROLES.USER]),
    configureMulter("user")?.single("profile_image"),
    update
  );

module.exports = router;
