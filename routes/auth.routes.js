const express = require("express");
const router = express();
const {
  signUp,
  signIn,
  forgotPassword,
  verifyTokenWithEmail,
  resetPassword,
} = require("../controller/auth.controller");
const { configureMulter } = require("../helper");
const {
  forgotPasswordSchema,
  signUpSchema,
  signInSchema,
  verifyTokenWithEmailSchema,
  resetPasswordSchema,
} = require("../validation/auth.validation");

router
  .post(
    "/auth/sign-up",
    signUpSchema,
    configureMulter("user")?.single("profile_image"),
    signUp
  )
  .post("/auth/sign-in", signInSchema, signIn)
  .post("/auth/forgot-password", forgotPasswordSchema, forgotPassword)
  .post("/auth/verify-token", verifyTokenWithEmailSchema, verifyTokenWithEmail)
  .post("/auth/reset-password", resetPasswordSchema, resetPassword);

module.exports = router;
