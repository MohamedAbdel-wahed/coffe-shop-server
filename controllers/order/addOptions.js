const { AuthenticationError, UserInputError } = require("apollo-server")
const { Table, Product, Order } = require("../../models")
const { Op } = require("sequelize")


module.exports = async ({ table, product, description }, user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    //check if fields are valid
    if (!table || isNaN(table))
      throw new UserInputError("you must select a table")
    if (!product || product === "")
      throw new UserInputError("you must select a product")

    // check if this table exists
    const tableExists = await Table.findOne({ where: { code: table } })
    if (!tableExists) throw new UserInputError("Table Not Found")

    // check if this product exists
    const productExists = await Product.findOne({ where: { uuid: product } })
    if (!productExists) throw new UserInputError("Product Not Found")

    const SelectedOrder= await Order.findOne({ 
      where: { [Op.and]: [{ table }, { product }, {inCart: true}] }
    })

    if (SelectedOrder) {
      await Order.update(
          { description },
          { where: { [Op.and]: [{ table }, { product }] } }
        )
    }
  } 
  catch (err) {
    throw new UserInputError("Error", { errors: err })
  }
}
