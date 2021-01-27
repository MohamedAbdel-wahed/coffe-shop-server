const { Product,Image } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")

module.exports = async ({uuid},user) => {
  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")

    const selectedProduct = await Product.findOne({where:{uuid}})
    const result = await Image.findOne({where:{product: uuid}})

    if(result) selectedProduct.image= result.image

    return selectedProduct
  } 
  catch (err) {
    throw new UserInputError("Input Error", {errors: err})
  }
}
