const { Worker } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")


module.exports = async ({ uuid }, user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized")

    // check if worker exists
    const worker = await Worker.findOne({ where: { uuid } })
    if (!worker)
      throw new UserInputError("Input Error", { error: "Worker Not Found!" })

    // delete worker
    await Worker.destroy({
      where: { uuid },
    })

    return;
  } 
  catch (err) {
    throw new UserInputError("Bad Action performed")
  }
}
