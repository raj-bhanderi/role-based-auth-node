const mongoose = require("mongoose");
const { sendResponse, deleteImage } = require("../helper");
const { STATUS_CODE } = require("../helper/enum");
const { MESSAGE } = require("../helper/localization");
const Post = require("../models/post");

module.exports = {
  create: async (req, res) => {
    try {
      const post = await Post.findOne({ title: req?.body?.title });

      if (post) {
        await deleteImage(req?.file?.path);
        return sendResponse(
          res,
          STATUS_CODE?.CONFLICT,
          false,
          MESSAGE?.ALREADY_EXIT("Post")
        );
      }

      const create = new Post({
        ...req?.body,
        userId: req?.userId,
        image: "/upload/post/" + req?.file?.filename,
      });

      const response = await create.save();

      return sendResponse(
        res,
        STATUS_CODE?.CREATED,
        true,
        MESSAGE?.CREATE("Post"),
        response
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req?.query;
      const skip = (page - 1) * limit;

      const posts = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $addFields: {
            user_details: { $arrayElemAt: ["$user_details", 0] },
          },
        },
        {
          $match: {
            $or: [
              {
                title: {
                  $regex: search?.toString()?.trim() || "",
                  $options: "i",
                },
              },
              {
                "user_details.email": {
                  $regex: search?.toString()?.trim() || "",
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            image: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            "user_details.first_name": 1,
            "user_details.last_name": 1,
            "user_details.email": 1,
          },
        },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);

      const totalPosts = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $addFields: {
            user_details: { $arrayElemAt: ["$user_details", 0] },
          },
        },
        {
          $match: {
            $or: [
              {
                title: {
                  $regex: search?.toString()?.trim() || "",
                  $options: "i",
                },
              },
              {
                "user_details.email": {
                  $regex: search?.toString()?.trim() || "",
                  $options: "i",
                },
              },
            ],
          },
        },
        { $count: "total" },
      ]);

      const total = totalPosts?.length > 0 ? totalPosts[0]?.total : 0;

      return sendResponse(
        res,
        STATUS_CODE?.OK,
        true,
        MESSAGE?.GET_ALL("Posts"),
        {
          posts,
          pagination: {
            total,
            page: +page,
            limit,
          },
        }
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  findOne: async (req, res) => {
    try {
      const post = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $addFields: {
            user_details: { $arrayElemAt: ["$user_details", 0] },
          },
        },
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req?.params?.id?.toString()),
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            image: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            "user_details.first_name": 1,
            "user_details.last_name": 1,
            "user_details.email": 1,
            "user_details.profile_image": 1,
          },
        },
      ]);

      if (!post) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("Post")
        );
      }

      return sendResponse(
        res,
        STATUS_CODE?.OK,
        true,
        MESSAGE?.GET_SINGLE("Post"),
        { post: post?.at(0) }
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req?.params?.id });

      if (!post) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("Post")
        );
      }

      await deleteImage(process.cwd() + "/public" + post?.image);

      const deletePost = await Post.deleteOne({ _id: req?.params?.id });

      return sendResponse(
        res,
        STATUS_CODE?.OK,
        true,
        MESSAGE?.DELETE("Post"),
        deletePost
      );
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },

  update: async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req?.params?.id });

      if (!post) {
        return sendResponse(
          res,
          STATUS_CODE?.NOT_FOUND,
          false,
          MESSAGE?.NOT_FOUND("Post")
        );
      }

      const updatePost = await Post.updateOne(
        { _id: req?.params?.id },
        { $set: req?.body },
        { upsert: true }
      );

      return sendResponse(res, STATUS_CODE?.OK, true, MESSAGE?.UPDATE("Post"), {
        update: !!updatePost,
      });
    } catch (error) {
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST, false, error?.message);
    }
  },
};
