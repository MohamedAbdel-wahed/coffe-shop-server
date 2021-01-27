const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Admin } = require("../../models")
const { UserInputError } = require("apollo-server")
const { JWT_SECRET, CREDENTIALS } = require("../../config/env")

module.exports = async ({ username, pwd }) => {
  let errors = {}
  let verified = null

  try {
    if (pwd === "") errors.pwd = "Password can't be empty"

    if (username === CREDENTIALS.username && pwd === CREDENTIALS.pwd) {
      verified = username
    } else {
      //check if user exists by username
      const admin = await Admin.findOne({ where: { username } })
      if (!admin) {
        errors.username = "Username doesn't exist"
      } else {
        //check if the password is correct
        const isCorrectPwd = await bcrypt.compare(pwd, admin.pwd)
        if (!isCorrectPwd) errors.pwd = "Password does't match credentials"

        verified = admin.username
      }
    }

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    //signin the token
    const token = jwt.sign({ verified }, JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    })

    return { username: verified, token }
  } catch (err) {
    throw new UserInputError("Bad Input", { errors })
  }
}
