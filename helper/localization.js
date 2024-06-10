const MESSAGE = {
  CREATE: (type) => `Create ${type} Successfully.`,
  UPDATE: (type) => `Update ${type} Successfully.`,
  DELETE: (type) => `Delete ${type} Successfully.`,
  GET_ALL: (type) => `Get All ${type} Fetch Successfully.`,
  ALREADY_EXIT: (type) => `${type} is already exit.`,
  GET_SINGLE: (type) => `Get ${type} Details Fetch Successfully.`,
  NO_EXIT: (type) => `${type} is not exit.`,
  NOT_FOUND: (type) => `${type} Not Found.`,
  SERVICE_NOT_ACCESS: (role) =>
    `This service is not accessible for ${role} role.`,
  SIGN_UP: "User SignUp Successfully.",
  SIGN_IN: (user) => `${user} SignIn Successfully.`,
  INVALID_USER: "Invalid User.",
  ACCESS_DENIED: "Access denied. No token provided.",
  TOKEN_EXPIRE: "Access token has expired.",
  INVALID_TOKEN: "Invalid token.",
  EMAIL_SEND: "Password reset email sent successfully.",
  TOKEN_VERIFY: "Token Verify successfully.",
  PASSWORD_UPDATE: "Password change successfully.",
  PASS_RESET_SUBJECT: "Password Reset Request.",
  PASS_RESET_REQ_TEXT:
    "You requested a password reset. Click the link to reset your password.",
    SIGNUP_SUBJECT: "Welcome to Our Platform!",
  SIGNUP_REQ_TEXT:
    "Welcome to Our Platform!",
};

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

module.exports = {
  MESSAGE,
  ROLES,
};
