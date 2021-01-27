const { AuthenticationError, UserInputError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")
const { Order,Table } = require("../../models")

module.exports = async ({ code }, user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized to do this action")

    if (isNaN(code)) throw new UserInputError("table code must be a number")
    if (code === "" || !code)
      throw new UserInputError(
        "you must set the code of the table you want to remove"
      )

    const table = await Table.findOne({ where: { code } })
    if (!table) throw new UserInputError("Table Not Found")

    await Order.destroy({ where: { table: code } })
    await Table.destroy({ where: { code } })

    return;
  } 
  catch (err) {
    throw new UserInputError("Input Error: ", { errors: err })
  }
}
