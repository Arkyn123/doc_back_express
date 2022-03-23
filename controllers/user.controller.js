const errors = require('../utils/errors')

class UserController {
    async getUser(req, res) {
        console.log(req.user)
        return res
        .status(errors.success.code)
        .json({
            user: req.user,
            roles: req.roles
        })
    }
}

module.exports = new UserController()