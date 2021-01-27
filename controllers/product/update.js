const { Product } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")

module.exports = async ({ uuid, category, name, description, price }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("UNAUTHORIZED")

    //check if product exists
    const product = await Product.findOne({ where: { uuid } })
    if (!product) errors.name = "Product Not Found!"

    if (category.trim() === "") errors.category = "category can't be empty"
    if (name.trim() === "") errors.name = "name can't be empty"
    if (isNaN(price)) errors.price = "price must be valid"
    if (description && description.length > 80)
      errors.description = "description can't be more than 80 chars"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    // update product
    await Product.update(
      { category, name, description, price },
      { where: { uuid } }
    )
    const updatedProduct = await Product.findOne({ where: { uuid } })

    return updatedProduct
  } catch (err) {
    throw new UserInputError("Bad Input", { errors })
  }
}
