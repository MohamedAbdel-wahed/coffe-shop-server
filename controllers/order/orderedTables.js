const { Order } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")

module.exports = async (user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    const tables = await Order.findAll({attributes: ['table'], where: {inCart: false}})
    
    return tables
  } 
  catch (err) {
      throw new UserInputError("Error", { errors: err })
  }
}
