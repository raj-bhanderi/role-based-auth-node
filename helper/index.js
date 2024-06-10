const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const { MESSAGE } = require("./localization");
const { sendMail } = require("./email");

module.exports = {
  sendResponse: (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({
      success,
      message,
      ...(data && { data }),
    });
  },

  generateToken: async (payload, expiresIn = "1d") => {
    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  verifyToken: async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Token has expired
        return {
          error: "TokenExpiredError",
          message: MESSAGE?.TOKEN_EXPIRE,
        };
      } else if (error.name === "JsonWebTokenError") {
        // Invalid token
        return { error: "JsonWebTokenError", message: MESSAGE?.INVALID_TOKEN };
      } else {
        // Other errors
        return { error: "UnknownError", message: error?.message };
      }
    }
  },

  configureMulter: (folder) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, process.cwd() + `/public/upload/${folder}`);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    const fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed."), false);
      }
    };

    const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    });

    return upload;
  },

  deleteImage: async (absolutePath) => {
    if (fs.existsSync(absolutePath)) {
      await fs.unlinkSync(absolutePath);
      console.log(`Deleted image: ${absolutePath}`);
      return true;
    } else {
      console.log(`Image not found: ${absolutePath}`);
      return false;
    }
  },

  hashPassword: async (password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password");
    }
  },

  comparePassword: async (password, hashedPassword) => {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw new Error("Error comparing passwords");
    }
  },

  validateSchema: (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req?.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      req.validatedData = value;
      next();
    };
  },

  commonSendMail: async ({ fileName, data, to, subject, text, res }) => {
    const html = await ejs.renderFile(
      path.join(process.cwd(), "views", fileName),
      data
    );
    await sendMail({
      html,
      to,
      subject,
      text,
      res,
    });
  },
};
