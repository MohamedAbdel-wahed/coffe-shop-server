const { Admin } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")

module.exports = async (user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("UNAUTHORIZED")

    const admins = await Admin.findAll()

    return admins
  } catch (err) {
    throw new UserInputError("UNAUTHORIZED", {
      error: "Only main admin is authorized to see admins",
    })
  }
}
