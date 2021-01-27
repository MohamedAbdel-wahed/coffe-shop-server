const { AuthenticationError, UserInputError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")
const { Table } = require("../../models")

module.exports = async ({ code, place }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized to do this action")

    if (isNaN(code)) errors.code = "Table must have a unique code"
    if (code === "" || !code) errors.code = "Table must have a unique code"
    if (place === "" || !place)
      errors.place = "you must set the place of the table"

    const isTableExists = await Table.findOne({ where: { code } })
    if (isTableExists) errors.code = "this code belongs to another table!"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    const table = await Table.create({ code, place })

    return table
  } catch (err) {
    throw new UserInputError("Input Error: ", { errors })
  }
}
