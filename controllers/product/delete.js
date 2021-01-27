const { Product,Image } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { CREDENTIALS,CLOUDINARY } = require("../../config/env")
const cloudinary = require("cloudinary")


module.exports = async ({ uuid }, user) => {
  //initialize cloudinary
  cloudinary.config({
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
  })

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username)
      throw new AuthenticationError("unauthorized")

    //check if product exists
    const product = await Product.findOne({ where: { uuid } })
    if (!product)
      throw new UserInputError("Product Not Found!")

    // get image of that product
    const productImg= await Image.findOne({where: {product: uuid}})

    // delete product
    await Product.destroy({where: { uuid }})

    // delete related image from db
    await Image.destroy({where: {product: uuid}})

    // delete related image from cloudinary
    await cloudinary.v2.uploader.destroy(productImg.image.split(".")[0])

    return;
  } 
  catch (err) {
    throw new UserInputError("Bad Action performed")
  }
}
