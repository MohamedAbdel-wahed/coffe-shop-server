const {AuthenticationError,UserInputError}= require('apollo-server')
const {Order,Table}= require('../../models')


module.exports= async({table},user)=> {
  try {
    //check if authenticated 
    if(!user) throw new AuthenticationError('unauthenticated')
    if(!table || isNaN(table) ) throw new UserInputError("you must selected a table") 

    const tableExists= await Table.findOne({where: {code: table}}) 
    if(!tableExists) {
      throw new UserInputError("Product Not Found")
    }
    else{
      //delete order
      await Order.destroy({where: {table}})
    }

    // updated table to full=true
    await Table.update({ full: false },{ where: { code: table } })

    return;
  }
  catch(err) {
    throw new UserInputError("Error",{errors: err})
  }
}