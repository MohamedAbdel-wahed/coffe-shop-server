const { AuthenticationError, UserInputError } = require("apollo-server")
const { CREDENTIALS } = require("../../config/env")
const { Product } = require("../../models")

module.exports = async ({ category, name, description, price }, user) => {
  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized to do this action")

    if (name.trim() === "") {
      errors.name = "name can't be empty"
    } else {
      const product = await Product.findOne({ where: { name } })
      if (product && product.name === name)
        errors.name = "this product exists already!"
    }

    if (category.trim() === "") errors.category = "category can't be empty"
    if (isNaN(price)) errors.price = "price must be valid"
    if (description && description.length > 80)
      errors.description = "description can't be more than 80 chars"

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    const productColors= ['green','blue','purple','gray','yellow']
    const randomIndex= Math.floor(Math.random()*4)

    // create new Product in DB
    const newProduct = await Product.create({
      category,
      name,
      description,
      price,
      color: productColors[randomIndex]
    })

    return newProduct
  } 
  catch (err) {
    throw new UserInputError("Input Error", { errors })
  }
}
