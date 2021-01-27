const { Product } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")

module.exports = async (user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")

    const products = await Product.findAll()

    return products
  } catch (err) {
    throw new UserInputError("unauthenticated", {
      error: "You must be authenticated to do this action",
    })
  }
}
