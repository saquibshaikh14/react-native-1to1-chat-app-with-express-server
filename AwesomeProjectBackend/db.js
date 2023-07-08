// class InMemoryDatabase {
//   constructor() {
//     this.collections = {};
//   }

//   createCollection(collectionName) {
//     if (!this.collections[collectionName]) {
//       this.collections[collectionName] = [];
//       console.log(`Collection '${collectionName}' created.`);
//     } else {
//       console.log(`Collection '${collectionName}' already exists.`);
//     }
//   }

//   insertOne(collectionName, document) {
//     if (!this.collections[collectionName]) {
//       console.log(`Collection '${collectionName}' does not exist.`);
//       return;
//     }

//     this.collections[collectionName].push(document);
//     console.log("Document inserted:");
//     console.log(document);
//   }

//   find(collectionName, query) {
//     if (!this.collections[collectionName]) {
//       console.log(`Collection '${collectionName}' does not exist.`);
//       return [];
//     }

//     const collection = this.collections[collectionName];
//     const results = collection.filter((document) => {
//       for (const key in query) {
//         if (document[key] !== query[key]) {
//           return false;
//         }
//       }
//       return true;
//     });

//     console.log(`Results for query:`);
//     console.log(query);
//     console.log(results);

//     return results;
//   }

//   findAll(collectionName) {
//     if (!this.collections[collectionName]) {
//       console.log(`Collection '${collectionName}' does not exist.`);
//       return [];
//     }

//     const collection = this.collections[collectionName];

//     console.log(`All documents in collection '${collectionName}':`);
//     console.log(collection);

//     return collection;
//   }

//   updateOne(collectionName, query, update) {
//     if (!this.collections[collectionName]) {
//       console.log(`Collection '${collectionName}' does not exist.`);
//       return;
//     }

//     const collection = this.collections[collectionName];
//     const documentIndex = collection.findIndex((document) => {
//       for (const key in query) {
//         if (document[key] !== query[key]) {
//           return false;
//         }
//       }
//       return true;
//     });

//     if (documentIndex !== -1) {
//       const updatedDocument = { ...collection[documentIndex], ...update };
//       collection[documentIndex] = updatedDocument;
//       console.log("Document updated:");
//       console.log(updatedDocument);
//     } else {
//       console.log("Document not found for update.");
//     }
//   }

//   deleteOne(collectionName, query) {
//     if (!this.collections[collectionName]) {
//       console.log(`Collection '${collectionName}' does not exist.`);
//       return;
//     }

//     const collection = this.collections[collectionName];
//     const documentIndex = collection.findIndex((document) => {
//       for (const key in query) {
//         if (document[key] !== query[key]) {
//           return false;
//         }
//       }
//       return true;
//     });

//     if (documentIndex !== -1) {
//       const deletedDocument = collection.splice(documentIndex, 1);
//       console.log("Document deleted:");
//       console.log(deletedDocument[0]);
//     } else {
//       console.log("Document not found for delete.");
//     }
//   }
// }

// // Example usage:

// //   const db = new InMemoryDatabase();

// //   db.createCollection('users');
// //   db.insertOne('users', { name: 'John', age: 30 });
// //   db.insertOne('users', { name: 'Jane', age: 25 });

// //   db.createCollection('products');
// //   db.insertOne('products', { name: 'Phone', price: 500 });
// //   db.insertOne('products', { name: 'Laptop', price: 1000 });

// //   db.updateOne('users', { name: 'John' }, { age: 35 });

// //   db.deleteOne('products', { name: 'Phone' });

// //   db.findAll('users');
// //   db.findAll('products');

// const message = {
//   messageBody: "some text",
//   sender: "user1",
//   receiver: "user2",
//   readStatus: [],
// };

// class DB {
//   constructor() {
//     this.collection = {};
//   }

//   createCollection(collectionName) {
//     if (!this.collections[collectionName]) {
//       this.collections[collectionName] = [];
//       console.log(`Collection '${collectionName}' created.`);
//       return {
//         success: true,
//         message: "Collection " + collectionName + " created!",
//       };
//     } else {
//       return {
//         success: false,
//         message: "Collection " + collectionName + " already exists!",
//       };
//     }
//   }

//   async addOne(collectionName, document) {
//     try {
//       if (!this.collection[collectionName]) {
//         this.createCollection(collectionName);
//       }
//       this.collection[collectionName].push({ _id: Date.now(), ...document });
//       return Promise.resolve({
//         success: true,
//         message: "Added to " + collectionName,
//         data: document,
//       });
//     } catch (e) {
//       return Promise.reject({
//         success: false,
//         message: "Unable to add to "+ collectionName,
//         error: e,
//       });
//     }
//   }

//   async findOne(collectionName, query){
//     try {
//         if (!this.collection[collectionName]) {
//           throw Error("No collection "+ collectionName + " found!");
//         }
//         this.collection[collectionName].find({ _id: Date.now(), ...document });
//         return Promise.resolve({
//           success: true,
//           message: "Added to " + collectionName,
//           data: document,
//         });
//       } catch (e) {
//         return Promise.reject({
//           success: false,
//           message: "Unable to add to "+ collectionName,
//           error: e,
//         });
//       }
//   }

// }

const Datastore = require("nedb");
// const dbMessage = new Datastore();
// const dbUser = new Datastore();

class Database {
  constructor() {
    this.collection = {
      dbMessage: new Datastore(),
      dbUser: new Datastore(),
    };

    this.collection.dbUser.insert([
      {
        username: "testuser",
        password: "test@123",
        name: "Test User",
        shortName: "TU",
      },
      {
        username: "testuser2",
        password: "test@123",
        name: "Test User2",
        shortName: "TU2",
      },
    ]);
  }

  findOne(dbName, query) {
    return new Promise((resolve, reject) => {
      // this.collection[dbName].
      this.collection[dbName].findOne(query, (err, document) => {
        if (err)
          return reject({
            success: false,
            message: "FindOneError",
            error: err,
          });
        return resolve({ success: true, data: document });
      });
    });
  }
  find(dbName, query) {
    return new Promise((resolve, reject) => {
      // this.collection[dbName].
      this.collection[dbName].find(query, (err, document) => {
        if (err)
          return reject({
            success: false,
            message: "FindError",
            error: err,
          });
        return resolve({ success: true, data: document });
      });
    });
  }
  insert(dbName, document) {
    return new Promise((resolve, reject) => {
      this.collection[dbName].insert(document, function (err, newDoc) {
        if (err)
          return reject({
            success: false,
            message: "insertError",
            error: err,
          });
        return resolve({ success: true, data: newDoc });
      });
    });
  }
  update(dbName, query, update, options) {
    return new Promise((resolve, reject) => {
        this.collection[dbName].update(query, update, options, function (err, numReplaced) {
        if (err)
          return reject({
            success: false,
            message: "updateError",
            error: err,
          });
        return resolve({ success: true, data: numReplaced });
      });
    });
  }
}


module.exports = Database;


// "_id": 1688810337198,
// "message": "test message from testuser",
// "sender": "testuser",
// "receiver": "testuser2",
// "readStatus": []