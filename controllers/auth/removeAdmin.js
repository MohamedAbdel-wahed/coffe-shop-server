const { Admin } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")

module.exports = async ({ username }, user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("UNAUTHORIZED")

    //check if admin exists
    const admin = await Admin.findOne({ where: { username } })
    if (!admin)
      throw new UserInputError("Input Error", { error: "Admin Not Found!" })

    // delete admin
    await Admin.destroy({
      where: { username },
    })

    return
  } catch (err) {
    throw new UserInputError("UNAUTHORIZED", {
      error: "Only main admin is authorized to delete admins",
    })
  }
}
