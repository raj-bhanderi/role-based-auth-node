
const {
  sendResponse,
  generateToken,
  deleteImage,
  hashPassword,
  comparePassword,
  verifyToken,
  commonSendMail,
} = require("../helper");
const { MESSAGE, ROLES } = require("../helper/localization");
const { STATUS_CODE } = require("../helper/enum");
const User = require("../models/user");

module.exports = {
  signUp: async (req, res) => {
    try {
      const user = await User.findOne({ email: req?.body?.email });

      if (user) {
        await deleteImage(req?.file?.path);
        return sendResponse(
          res,
          STATUS_CODE?.CONFLICT,
          false,
          MESSAGE?.ALREADY_EXIT("User")
        );
      }

      const password = await hashPassword(req?.body?.password);

      const create = new User({
        ...req?.body,
        profile_image: req?.file?.filename ?  "/upload/user/" + req?.file?.filename : "",
        password,
      });

      const response = await create.save();

      const authToken = await generateToken({
        _id: response?._id,
        role: ROLES?.USER,
      });

      await commonSendMail({
        fileName: "signup.ejs",
        data: {
          username: `${response?.first_name} ${response?.last_name}`,
        },
        to: req?.body?.email,
        subject: MESSAGE?.SIGNUP_SUBJECT,
        text: MESSAGE?.SIGNUP_REQ_TEXT,
        res,
      });

      return sendResponse(res, STATUS_CODE?.CREATED, true, MESSAGE?.SIGN_UP, {
        authToken,
      });
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  signIn: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req?.body?.email,
      });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.CONFLICT,
          false,
          MESSAGE?.INVALID_USER
        );
      }

      const checkPassword = await comparePassword(
        req?.body?.password,
        user?.password
      );

      if (checkPassword) {
        const authToken = await generateToken({
          _id: user?._id,
          role: user?.role,
        });

        await commonSendMail({
          fileName: "signin.ejs",
          data: {
            username: `${user?.first_name} ${user?.last_name}`,
          },
          to: user?.email,
          subject: MESSAGE?.SIGNUP_SUBJECT,
          text: MESSAGE?.SIGNUP_REQ_TEXT,
          res,
        });

        return sendResponse(
          res,
          STATUS_CODE?.OK,
          true,
          MESSAGE?.SIGN_IN(user?.role === ROLES?.ADMIN ? "Admin" : "User"),
          {
            authToken,
          }
        );
      }
      return sendResponse(
        res,
        STATUS_CODE?.CONFLICT,
        false,
        MESSAGE?.INVALID_USER
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }

      const authToken = await generateToken(
        {
          _id: user?._id,
          role: ROLES?.USER,
        },
        "1m"
      );

      const resetUrl = `${process.env.BASEURL}?token=${authToken}`;

      await commonSendMail({
        fileName: "forgot-password.ejs",
        data: {
          username: `${user?.first_name} ${user?.last_name}`,
          resetUrl,
        },
        to: req?.body?.email,
        subject: MESSAGE?.PASS_RESET_SUBJECT,
        text: MESSAGE?.PASS_RESET_REQ_TEXT,
        res,
      });

      return sendResponse(res, STATUS_CODE.OK, true, MESSAGE.EMAIL_SEND);
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  verifyTokenWithEmail: async (req, res) => {
    try {
      if (!req?.body?.token) {
        return sendResponse(
          res,
          STATUS_CODE?.BAD_REQUEST,
          false,
          error?.message
        );
      }

      const response = await verifyToken(req.body.token);
      if (response?.error) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED,
          false,
          response?.message
        );
      }
      const user = await User.findById(response?._id);
      return sendResponse(res, STATUS_CODE?.OK, true, MESSAGE.TOKEN_VERIFY, {
        user_id: user?._id,
      });
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const user = await User.findById(req?.body?.user_id);

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NO_EXIT
        );
      }

      const password = await hashPassword(req.body.password);

      const update = await User.updateOne(
        { _id: user?._id },
        { $set: { password } }
      );

      await commonSendMail({
        fileName: "reset-password.ejs",
        data: {
          username: `${user?.first_name} ${user?.last_name}`,
          resetUrl,
        },
        to: req?.body?.email,
        subject: MESSAGE?.PASS_RESET_SUBJECT,
        text: MESSAGE?.PASS_RESET_REQ_TEXT,
        res,
      });

      return sendResponse(
        res,
        STATUS_CODE?.OK,
        !!update,
        MESSAGE.PASSWORD_UPDATE
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },
};
