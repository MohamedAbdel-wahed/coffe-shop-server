const { Table } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")

module.exports = async (user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    const tables = await Table.findAll()

    return tables
  } 
  catch (err) {
    throw new UserInputError("Error:", { error: err })
  }
}
