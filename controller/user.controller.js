const { sendResponse, deleteImage } = require("../helper");
const { STATUS_CODE } = require("../helper/enum");
const { MESSAGE } = require("../helper/localization");
const User = require("../models/user");

module.exports = {
  findOne: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req?.userId });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }

      return sendResponse(res, STATUS_CODE?.OK, true, MESSAGE?.GET_ALL, user);
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  update: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req?.userId });
      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("User")
        );
      }

      if (!req?.body?.profile_image) {
        await deleteImage(process.cwd() + "/public" + user?.profile_image);
      }

      const updateUser = await User.updateOne(
        { _id: req?.userId },
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
