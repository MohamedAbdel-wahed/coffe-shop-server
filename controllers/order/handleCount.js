const { AuthenticationError, UserInputError } = require("apollo-server")
const { Order,Table,Product } = require("../../models")
const { Op } = require("sequelize")


module.exports = async ({ table, product, count }, user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    //check if fields are valid
    if (!table)
      throw new UserInputError("you must select a table")
    if (!product || product === "")
      throw new UserInputError("you must select a product")
    if (count!==0 && isNaN(count))
      throw new UserInputError("count must be a number")

    // check if this table exists in orders table
    const tableExists = await Table.findOne({ where: { code: table } })
    if (!tableExists) throw new UserInputError("Table Not Found")

    // check if this product exists in orders table
    const productExists = await Product.findOne({ where: { uuid: product } })
    if (!productExists) throw new UserInputError("Product Not Found")

    const orderExists = await Order.findOne({ where: {[Op.and]: [{ table }, { product }]} })
    if (!orderExists) throw new UserInputError("Order Not Found")

    if (count === 0 || count < 0) {
       await Order.destroy({ where: { [Op.and]: [{ table }, { product }] } })
    } 
    else {
      // update the order product count
      await Order.update(
        { count },
        { where: { [Op.and]: [{ table }, { product }] } }
      )
    }

    // refetch cartItems to update on real time
    const newCartItems = await Order.findAll({
      where: { [Op.and]: [{ table }, { inCart: true }] },
    })

    return newCartItems
  }
   catch (err) {
    throw new UserInputError("Error", { errors: err })
  }
}
