const { AuthenticationError, UserInputError } = require("apollo-server")
const { Order, Table } = require("../../models")
const { Op } = require("sequelize")

module.exports = async ({ table }, user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    if (!table) throw new UserInputError("you must select a table")

    // check if this table exists
    const tableExists = await Table.findOne({ where: { code: table } })
    if (!tableExists) throw new UserInputError("Table Not Found")

    const cartItems = await Order.findAll({
      where: { [Op.and]: [{ table }, { inCart: true }] },
    })

    return cartItems
  } 
  catch (err) {
    console.log(err)
    throw new UserInputError("Error", { errors: err })
  }
}
