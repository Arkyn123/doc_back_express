const errors = require("../utils/errors");

class UserController {
  async getUser(req, res) {
    return res.status(errors.success.code).json({
      user: req.user,
      roles: req.roles,
      officeId: req.officeId,
    });
  }
}

module.exports = new UserController();
