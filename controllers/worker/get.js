const { Worker } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")


module.exports = async (user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
    throw new AuthenticationError("unauthorized to do this action")

    const workers = await Worker.findAll()

    return workers
  } 
  catch (err) {
    throw new UserInputError("Error:", {errors: err})
  }
}
