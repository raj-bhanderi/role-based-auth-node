const { sendResponse, verifyToken } = require(".");
const { STATUS_CODE } = require("./enum");
const { MESSAGE } = require("./localization");

module.exports = {
  authenticate: async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED,
        false,
        MESSAGE?.ACCESS_DENIED
      );
    }

    const decoded = await verifyToken(token);

    if (decoded?.error) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED,
        false,
        decoded?.message
      );
    }

    req.userId = decoded?._id;
    req.role = decoded?.role;

    next();
  },
};
