const { Worker } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")


module.exports = async ({ uuid, name, phone, job }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("UNAUTHORIZED")

    //check if product exists
    const worker = await Worker.findOne({ where: { uuid } })
    if (!worker) errors.name = "Worker Not Found!"

    if (name.trim() === "") errors.name = "name can't be empty"
    if (phone.trim() === "") errors.phone = "phone can't be empty"
    if (job.trim() === "") errors.job = "job can't be empty"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    // update product
    await Worker.update(
      { name, phone, job },
      { where: { uuid } }
    )
    const updatedWorker = await Worker.findOne({ where: { uuid } })

    return updatedWorker
  } 
  catch (err) {
    throw new UserInputError("Bad Input", { errors })
  }
}
