const { AuthenticationError, UserInputError } = require("apollo-server")
const { CREDENTIALS, CLOUDINARY } = require("../../config/env")
const { Image,Product } = require("../../models")
const cloudinary = require("cloudinary")


module.exports = async ({product,image},user) => {
  //initialize cloudinary
  cloudinary.config({
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
  })

  let errors = {}

  try {
    //check if authenticated && admin
    if (!user) throw new AuthenticationError("unauthenticated")
    if (user.verified !== CREDENTIALS.username) throw new AuthenticationError("unauthorized to do this action")

    if(!product) throw new UserInputError("Select product!")
    if(!image) errors.image="select file to upload"

    const productExists = await Product.findOne({ where: { uuid: product } })
    if (!productExists) throw new UserInputError("Product Not Found!")

    // check if there is an error
    if (Object.keys(errors).length > 0) throw errors

    //save to cloudinary
    const uploadedImage= await cloudinary.v2.uploader.upload(image)
    
    if(uploadedImage){
      const {public_id,format}= uploadedImage

      //save to DB images table
      await Image.create({
        product,
        image: `${public_id}.${format}`,
      })
    }


    return;
  } 
  catch (err) {
    throw new UserInputError("Bad Input", { errors })
  }
}
