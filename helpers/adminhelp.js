const db = require("../confi/connection");
const collection = require("../confi/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const objectId = require("mongodb").ObjectId;

module.exports = {
  // sign up

  doSinup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: adminData.email });
      let response = {
        admin: null,
        adminExist: false,
      };

      if (!admin) {
        adminData.password = await bcrypt.hash(adminData.password, 10);
        db.get()
          .collection(collection.ADMIN_COLLECTION)
          .insertOne(adminData)
          .then((data) => {
            response.adminExist = false;
            response.admin = adminData;

            resolve(response);
          });
      } else {
        response.adminExist = true;
        resolve(response);
      }
    });
  },

  // sign up

  // login up

  dologin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let response = {
        admin: null,
        Status: false,
      };

      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: adminData.email });

      if (admin) {
        bcrypt.compare(adminData.password, admin.password).then((status) => {
          if (status) {
            response.admin = admin;
            response.Status = true;
            resolve(response);
          } else {
            response.Status = false;
            resolve(response);
          }
        });
      } else {
        response.Status = false;
        resolve(response);
      }
    });
  },

  // login up

  getUser: () => {
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection("user").find().toArray();
      resolve(user);
    });
  },

  deleteUser: (userId) => {
    db.get()
      .collection("user")
      .deleteOne({ _id: objectId(userId) });
  },

  searchUser: async function (name) {
    let findUser = await db
      .get()
      .collection("user")
      .findOne({ fullname: name });
    return findUser;
  },

  getProduct: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db.get().collection("product").find().toArray();
      resolve(product);
    });
  },
  addProduct: (product) => {
    db.get().collection("product").insertOne(product);
  },

  deleteProduct: (productId) => {
    db.get()
      .collection("product")
      .deleteOne({ _id: objectId(productId) });
  },

  editProduct: (proId, proBody) => {
    db.get()
      .collection("product")
      .updateOne(
        { _id: objectId(proId) },
        {
          $set: {
            productname: proBody.productname,
            productdescription: proBody.productdescription,
            productprice: proBody.productprice,
            productimage: proBody.productimage,
          },
        }
      );
  },
  searchProduct: async function (name) {
    let findProduct = await db
      .get()
      .collection("product")
      .findOne({ productname: name });
    return findProduct;

  },
  
};
