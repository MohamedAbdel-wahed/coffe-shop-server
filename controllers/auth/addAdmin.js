const bcrypt = require("bcryptjs")
const { Admin } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")

module.exports = async ({ username, pwd }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      errors.username = "Only main admin can add"

    //check username length
    if (username.length < 3 || username.length > 20)
      errors.username = "Username must be (3-20) characters"

    //check password length
    if (!pwd || pwd.length < 8)
      errors.pwd = "Password must be 8 characters at least"

    //check if new admin is the same main admin
    if (username === CREDENTIALS.username)
      errors.username = "please try differnt username"
    if (pwd === CREDENTIALS.pwd) errors.pwd = "please try differnt password"

    // check if the new admin exists
    const admin = await Admin.findOne({ where: { username } })
    if (admin && admin.username === username)
      errors.username = "this admin exists already!"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    //hash password
    pwd = await bcrypt.hash(pwd, 6)

    //create new admin in DB
    const newAdmin = Admin.create({ username, pwd })

    return newAdmin
  } catch (err) {
    console.log(err)
    throw new UserInputError("Input Error", { errors })
  }
}
