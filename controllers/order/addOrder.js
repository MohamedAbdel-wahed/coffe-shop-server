const { AuthenticationError, UserInputError } = require("apollo-server")
const { Table, Order } = require("../../models")
const { Op } = require("sequelize")


module.exports = async ({ table }, user) => {
  try {
    //check if authenticated
    if (!user) throw new AuthenticationError("unauthenticated")

    //check if fields are valid
    if (!table || isNaN(table))
      throw new UserInputError("you must select a table")

    // check if this table exists
    const selectedTable = await Table.findOne({ where: { code: table } })
    if (!selectedTable) throw new UserInputError("Table Not Found")

    const orders= await Order.findAll({ where: { [Op.and]: [ {inCart: false},{table} ] } })
    const newOrders= await Order.findAll({ where: { [Op.and]: [ {inCart: true},{table} ] } })

    newOrders.forEach(async(newOrder)=>{
       const existing= orders.find(order=> order.product===newOrder.product)
       if(existing){
          // update count in existing order (has same product)
          await Order.update(
            {count: existing.count+newOrder.count},
            { where: { [Op.and]:
               [ {table: existing.table},{product: existing.product},{inCart: false} ] 
            } })

        // delete new order (has same existing product)  
        await Order.destroy( 
          { where: { [Op.and]:
              [ {table: newOrder.table},{product: newOrder.product},{inCart: true} ] 
          } }) 
       }
       else{
         // remove the order from cart and add it to orders (as usual)
         await Order.update({inCart: false},{ where: {table: newOrder.table}})
       }
    })

    // updated table to full=true
    await Table.update({ full: true },{ where: { code: table } })

    return;
  } 
  catch (err) {
    throw new UserInputError("Error", { errors: err })
  }
}
