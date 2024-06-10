const { sendResponse } = require(".");
const { STATUS_CODE } = require("./enum");
const { MESSAGE, ROLES } = require("./localization");

module.exports = {
    checkRole:  (roles=[])=>{
        return (req, res, next) => {
            if(roles?.includes(req?.role) && Object.values(ROLES)?.includes(req?.role)){
                next();
            }else{
                return sendResponse(
                    res,
                    STATUS_CODE?.BAD_REQUEST,
                    false,
                    MESSAGE.SERVICE_NOT_ACCESS(req?.role)
                  );
            }
          }
    }
};
