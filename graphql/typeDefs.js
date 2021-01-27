const { gql } = require("apollo-server")

module.exports = gql`
  type Admin {
    username: String!
    token: String
  }

  type Product {
    uuid: String!
    image: String
    category: String!
    name: String!
    description: String
    price: Float!
    color: String
  }

  type ProductImage {
    product: String!
    image: String!
  }

  type Table {
    code: Int!
    place: String!
    full: Boolean
    updatedAt: String
  }

  type Order {
    id: ID!
    table: Int!
    product: String!
    price: Float
    count: Int!
    description: String
    inCart: Boolean!
    createdAt: String!
  }

  # wanna get ordered tabled
  type OrderedTable {
    table: Int!
  }

  type Worker {
    uuid: String!
    name: String!
    phone: String!
    job: String!
    createdAt: String!
  }


  type Query {
    # Auth Queries
    admins: [Admin]!
    login(username: String!, pwd: String!): Admin!

    # Product Queries
    products: [Product]!
    product(uuid: String!): Product!

    # Table Queries
    tables: [Table]

    # Order Queries
    cartItems(table: Int!): [Order]!
    orderedTables: [OrderedTable]!
    orders(table: Int!): [Order]!

    # Worker Queries
    workers: [Worker]!
  }

  type Mutation {
    # Auth mutations
    addAdmin(username: String!, pwd: String!): Admin!
    removeAdmin(username: String!): Boolean

    # Product mutations
    addProduct(category:String! name:String! description:String price:Float!): Product!
    updateProduct(uuid:String! category:String! name:String! description:String price:Float!): Product!
    deleteProduct(uuid: String!): Boolean

    # Image mutations
    uploadImage(product: String!, image: String!): Boolean

    #Table mutations
    addTable(code: Int!, place: String!): Table!
    removeTable(code: Int!): Boolean

    # Order mutations
    addToCart(table: Int!, product: String!): [Order]!
    handleCount(table: Int!, product: String!, count: Int!): [Order]!
    addOrder(table: Int!): Boolean
    addOptions(table: Int! product:String! description:String): Boolean
    payOrder(table: Int!): Boolean

    # Worker mutation
    addWorker(name:String! phone:String! job:String!): Worker!
    updateWorker(uuid:String! name:String! phone:String! job:String!): Worker!
    removeWorker(uuid:String!): Boolean
  }
`
