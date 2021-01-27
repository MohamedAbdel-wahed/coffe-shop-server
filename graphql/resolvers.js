const moment= require('moment')

// import Auth Methods 
const login= require('../controllers/auth/login')
const addAdmin= require('../controllers/auth/addAdmin')
const removeAdmin= require('../controllers/auth/removeAdmin')
const admins= require('../controllers/auth/admins')
// import Products Methods 
const addProduct= require('../controllers/product/create')
const getProducts= require('../controllers/product/get')
const getSingleItem= require('../controllers/product/singleProduct')
const updateProduct= require('../controllers/product/update')
const deleteProduct= require('../controllers/product/delete')
const uploadImage= require('../controllers/product/uploadImage')
// import Tables Methods
const addTable= require('../controllers/table/add')
const removeTable= require('../controllers/table/remove')
const getTables= require('../controllers/table/get')
// import Orders Methods 
const addToCart= require('../controllers/order/addToCart')
const handleCount= require('../controllers/order/handleCount')
const getCartItems= require('../controllers/order/cartItems')
const addOrder= require('../controllers/order/addOrder')
const orderedTables= require('../controllers/order/orderedTables')
const getOrders= require('../controllers/order/orders')
const addOptions= require('../controllers/order/addOptions')
const payOrder= require('../controllers/order/payOrder')
// import Orders Methods 
const addWorker= require('../controllers/worker/add')
const getWorkers= require('../controllers/worker/get')
const updateWorker= require('../controllers/worker/update')
const removeWorker= require('../controllers/worker/remove')


 
 module.exports= {
    Worker: {
      createdAt: ({createdAt})=> moment(createdAt).format('LL')
    },
    Table: {
      updatedAt: ({updatedAt})=> moment(updatedAt).format('LTS')
    },
    Query: { 
      // auth queries
      admins: (_,__,{user})=> admins(user),
      login: (_,args)=> login({...args}),

      // products queries
      products: (_,__,{user})=> getProducts(user), 
      product: (_,args,{user})=> getSingleItem({...args},user),

      // tables queries
      tables: (_,__,{user})=> getTables(user),

      // orders queries
      cartItems: (_,args,{user})=> getCartItems({...args},user),
      orderedTables: (_,__,{user})=> orderedTables(user),
      orders: (_,args,{user})=> getOrders({...args},user),

      // workers queries
      workers: (_,__,{user})=> getWorkers(user),

      },
      Mutation: {
        // auth mutations
        addAdmin: (_,args,{user})=> addAdmin({...args},user),
        removeAdmin: (_,args,{user})=> removeAdmin({...args},user),

        // products mutations
        addProduct: (_,args,{user})=> addProduct({...args},user),
        updateProduct: (_,args,{user})=> updateProduct({...args},user),
        deleteProduct: (_,args,{user})=> deleteProduct({...args},user),

        // Table mutations
         uploadImage: (_,args,{user})=> uploadImage({...args},user),
        
        // Table mutations
        addTable: (_,args,{user})=> addTable({...args},user),
        removeTable: (_,args,{user})=> removeTable({...args},user),

        // Order mutations
        addToCart: (_,args,{user})=> addToCart({...args},user),
        handleCount: (_,args,{user})=> handleCount({...args},user),
        addOrder: (_,args,{user})=> addOrder({...args},user),
        addOptions: (_,args,{user})=> addOptions({...args},user),
        payOrder: (_,args,{user})=> payOrder({...args},user),

        // Worker mutations
        addWorker: (_,args,{user})=> addWorker({...args},user),
        removeWorker: (_,args,{user})=> removeWorker({...args},user),
        updateWorker: (_,args,{user})=> updateWorker({...args},user)
      }
}




