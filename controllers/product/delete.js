const { Product } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")

module.exports = async ({ uuid }, user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized")

    //check if product exists
    const product = await Product.findOne({ where: { uuid } })
    if (!product)
      throw new UserInputError("Input Error", { error: "Product Not Found!" })

    // delete product
    await Product.destroy({
      where: { uuid },
    })

    return
  } catch (err) {
    throw new UserInputError("Bad Action performed")
  }
}
