const { Order,Table } = require("../../models")
const { UserInputError, AuthenticationError } = require("apollo-server")
const { Op } = require("sequelize")


module.exports = async ({table},user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    if (!table || isNaN(table)) throw new UserInputError("you must select a table")

    const tableExists = await Table.findOne({ where: { code: table } })
    if (!tableExists) throw new UserInputError("Table Not Found")

    const orders = await Order.findAll({ where: { [Op.and]: [{ table }, { inCart: false }] } })

    return orders
  } 
  catch (err) {
      throw new UserInputError("Error", { errors: err })
  }
}
