const db = require("../confi/connection");
const collection = require("../confi/collection");
const bcrypt = require("bcrypt");

module.exports = {
  // sign up

  doSinup: (userData) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      let response = {
        user: null,
        userExist: false,
      };

      if (!user) {
        userData.Password = await bcrypt.hash(userData.Password, 10);
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            response.userExist = false;
            response.user = userData;
           
            resolve(response);
          });
      } else {
        response.userExist = true;
        resolve(response);
      }
    });
  },

  // sign up

  // login up

  dologin: (userData) => {
   
    return new Promise(async (resolve, reject) => {
      let response = {
        user: null,
        Status: false
        
      };

      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.email });
         
      if (user) {
        bcrypt.compare(userData.password, user.Password).then((status) => {
          if (status) {
            response.user = user;
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


  
  getHome: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db.get().collection("product").find().toArray();
      resolve(product);
    });
  },

};
