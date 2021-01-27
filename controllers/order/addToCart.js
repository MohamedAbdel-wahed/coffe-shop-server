const { AuthenticationError, UserInputError } = require("apollo-server")
const { Table, Product, Order } = require("../../models")
const { Op } = require("sequelize")


module.exports = async ({ table, product }, user) => {
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

    // check if the table exists with the same product (incraese count)
    const OEWSP= await Order.findOne({ // OEWSP=> orderExistsWithSameProduct
      where: { [Op.and]: [{ table }, { product }, {inCart: true}] }
    })


    if (OEWSP) {
      await Order.update(
          { count: OEWSP.count + 1 },
          { where: { [Op.and]: [{ table }, { product }] } }
        )
    }
     else {
      // create the order
      await Order.create({ table, product, price: parseFloat(productExists.price) || '' })
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
