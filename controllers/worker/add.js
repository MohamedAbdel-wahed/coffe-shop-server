const { AuthenticationError, UserInputError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")
const { Worker } = require("../../models")

module.exports = async ({ name, phone, job }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized to do this action")

    if (name.trim() === "") errors.name = "name can't be empty"
    if (phone.trim() === "") errors.phone = "phone can't be empty"
    if (job.trim() === "") errors.job = "job can't be empty"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    // create new Worker in DB
    const newWorker = await Worker.create({ name, phone, job })

    return newWorker
  } 
  catch (err) {
    throw new UserInputError("Input Error", { errors })
  }
}
