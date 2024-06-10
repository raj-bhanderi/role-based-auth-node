const { sendResponse, deleteImage } = require("../helper");
const { STATUS_CODE } = require("../helper/enum");
const { MESSAGE, ROLES } = require("../helper/localization");
const User = require("../models/user");

module.exports = {
  create: async (req, res) => {
    try {
      const user = await User.findOne({ email: req?.body?.email });
      if (user) {
        return sendResponse(
          res,
          STATUS_CODE?.CONFLICT,
          false,
          MESSAGE?.ALREADY_EXIT("User")
        );
      }
      const create = new User(req?.body);
      const response = await create.save();

      return sendResponse(
        res,
        STATUS_CODE?.CREATED,
        true,
        MESSAGE?.CREATE("User"),
        response
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  findAll: async (req, res) => {
    try {
      const users = await User.find({ role: ROLES?.USER });
      return sendResponse(
        res,
        STATUS_CODE?.OK,
        true,
        MESSAGE?.GET_ALL("Users"),
        users
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  findOne: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req?.params?.id });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }

      return sendResponse(res, STATUS_CODE?.OK, true, MESSAGE?.GET_SINGLE("User"), user);
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  userDelete: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req?.params?.id });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }
      await deleteImage(process.cwd() + "/public" + user?.profile_image)
      
      const deleteUser = await User.deleteOne({ _id: req?.params?.id });

      return sendResponse(
        res,
        STATUS_CODE?.OK,
        true,
        MESSAGE?.DELETE("User"),
        deleteUser
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req?.params?.id });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }

      if(!req?.body?.profile_image){
        await deleteImage(process.cwd() + "/public" + user?.profile_image)
      }

      const updateUser = await User.updateOne(
        { _id: req?.params?.id },
        {
          $set: {
            ...req?.body,
            profile_image:
              req?.body?.profile_image || "/upload/user/" + req?.file?.filename,
          },
        },
        { upsert: true }
      );

      return sendResponse(res, STATUS_CODE?.OK, true, MESSAGE?.UPDATE("User"), {
        update: !!updateUser,
      });
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },
};
