const http = require("http");
const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");

const session = require("express-session");
const cookieParser = require("cookie-parser");

const Datastore = require("nedb");
const dbMessage = new Datastore();
const dbUser = new Datastore();

dbUser.insert([
  {
    username: "testuser",
    password: "test@123",
    name: "Test User",
    shortName: "TU",
    availableList: ["testuser2"],
  },
  {
    username: "testuser2",
    password: "test@123",
    name: "Test User2",
    shortName: "TU2",
    availableList: ["testuser"],
  },
]);

// const Database = require('./db');
// const db = new Database();

const app = express();
const port = 3000;

// const cert = path.join(__dirname, 'certificate/cert.crt');
// const key = path.join(__dirname, 'certificate/cert.key');

// const privateKey = fs.readFileSync(key, 'utf8');
// const certificate = fs.readFileSync(cert, 'utf8');
// const credentials = { key: privateKey, cert: certificate };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Login Route
app.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    // const USERS = [
    //   {
    //     username: "testuser",
    //     password: "test@123",
    //     name: "Test User",
    //     shortName: "TU",
    //   },
    // ];

    console.log(username, password);
    // const user = dbUser.findOne({username, password})
    // const user = db.findOne("dbUser", { username, password });

    dbUser.findOne({ username, password }, {_id: -1, password: -1}, (err, document) => {
      if (err) {
        throw err;
      }
      console.log(document);
      if (!document) {
        return res.status(401).json({
          status: 401,
          message: "Invalid credentials",
          data: null,
          success: false,
          error: null,
        });
      }

      req.session.user = {
        username: document.username,
        name: document.name,
      };
      return res.status(200).json({
        status: 200,
        message: "Validation success",
        data: document,
        success: true,
        error: null,
      });
    });

    // Perform authentication logic here

    // If authentication is successful, store user information in the session
    //
    // if (user && user.length) {
    //   req.session.user = {
    //     username: user[0].username,
    //     name: user[0].name,
    //   };
    //   return res.status(200).json({
    //     status: 200,
    //     message: "Validation success",
    //     data: user[0],
    //     success: true,
    //     error: null,
    //   });
    // }

    // return res.status(401).json({
    //   status: 401,
    //   message: "Invalid credentials",
    //   data: null,
    //   success: false,
    //   error: null,
    // });
  } catch (e) {
    console.log(e);
    next({
      status: 500,
      message: "Server error",
      data: null,
      success: false,
      error: null,
    });
  }
});

var messageQueue = {};
// Protected Route
app.post("/message", async (req, res, next) => {
  try {
    // if (req.session.user) {
    const { message, sender, receiver } = req.body || {};

    if (!message || !sender || !receiver)
      throw new Error(
        `Mandaotory field missing ${{ message, sender, receiver }}`
      );
    // if(sender != req.session.user.username) throw new Error('Session id and sender mismatch');
    const insertedMessage = await asynInsert(dbMessage, {
      _id: Date.now(),
      message,
      sender,
      receiver,
      readStatus: [],
    });

    //   messageQueue = {
    //     ...messageQueue,
    //     sender: true,
    //     receiver: true,
    //   };

    //   console.log("===inside message post=== 166", messageQueue);
    // const newReadMessages = await getMessage(sender, receiver);
    const reqStored = requestQueue.filter(
      (req) => req.sender == sender || req.sender == receiver
    );
    if (reqStored.length) {
      reqStored.forEach(async (req) => {
        const newReadMessages = await getMessage(req.sender, req.receiver);
        return req.req.res.status(200).json({
          status: 200,
          message: "Message fetched",
          data: newReadMessages,
          success: true,
          error: null,
        });
      });
      //   reqStored.req.res.status(200).json({
      //     status: 200,
      //     message: "Message fetched",
      //     data: newReadMessages,
      //     success: true,
      //     error: null,
      //   });

      const validRequests = requestQueue.filter(
        (req) => req.sender != sender || req.sender != receiver
      );
      requestQueue.length = 0; // Clear the original array
      requestQueue.push(...validRequests);
    }

    return res.status(200).json({
      status: 200,
      message: "Message sent",
      data: insertedMessage,
      success: true,
      error: null,
    });

    // dbMessage.insert(
    //   { _id: Date.now(), message, sender, receiver, readStatus: [] },
    //   (err, document) => {
    //     if (err) throw err;
    //     //   return res.status(500).json({
    //     //     status: 500,
    //     //     message: "Unable to save message",
    //     //     data: null,
    //     //     success: false,
    //     //     error: err,
    //     //   });

    //     messageQueue = {
    //       ...messageQueue,
    //       sender: true,
    //       receiver: true,
    //     };

    //     return res.status(200).json({
    //       status: 200,
    //       message: "Message sent",
    //       data: document,
    //       success: true,
    //       error: null,
    //     });
    //   }
    // );
    // notifiyRequestQueue([sender, receiver]);
    // } else {
    //   res.status(401).json({
    //     status: 401,
    //     message: "Unauthorized",
    //     data: null,
    //     success: false,
    //     error: null,
    //   });
    // }
  } catch (e) {
    console.log(e);
    next({
      status: 500,
      message: "Server error",
      data: null,
      success: false,
      error: null,
    });
  }
});

// const dbMessageFind = util.promisify(dbMessage.find);
// const dbMessageUpdate = util.promisify(dbMessage.update);
const asynInsert = (db, document) => {
  return new Promise((resolve, reject) => {
    db.insert(document, (err, document) => {
      if (err) return reject(err);
      return resolve(document);
    });
  });
};

const asyncFind = (db, query, projection) => {
  return new Promise((resolve, reject) => {
    db.find(query, projection, (err, document) => {
      if (err) return reject(err);
      return resolve(document);
    });
  });
};
const asyncUpdate = (db, query, update, updateOption) => {
  return new Promise((resolve, reject) => {
    db.update(
      query,
      update,
      updateOption,
      function (err, numberOfUpated, updatedDocument) {
        // console.log(err, numberOfUpated, updatedDocument);
        if (err) return reject(err);
        return resolve(updatedDocument);
      }
    );
  });
};

async function getMessage(sender, receiver) {
  const documents = await asyncFind(
    dbMessage,
    {
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    },
    { _id: 1, readStatus: 1 }
  );

  const unreadMessages = documents.filter((doc) => {
    return !doc.readStatus.includes(sender);
  });

  const newReadMessages = [];

  for (const element of unreadMessages) {
    const updatedDocument = await asyncUpdate(
      dbMessage,
      { _id: element._id },
      { $push: { readStatus: sender } },
      { returnUpdatedDocs: true }
    );
    newReadMessages.push(updatedDocument);
  }
  return newReadMessages;
}

const requestQueue = [];
const expirationTime = 10000;

function removeExpiredRequests() {
  const currentTime = Date.now();
  const validRequests = requestQueue.filter(
    (req) => currentTime - req.timestamp <= expirationTime
  );
  const expiredRequests = requestQueue.filter(
    (req) => currentTime - req.timestamp > expirationTime
  );
  expiredRequests.forEach((req) => {
    req.req.res.status(502).json({
      status: 502,
      message: "Request timedout",
      data: [],
      success: false,
      error: null,
    });
  });
  requestQueue.length = 0; // Clear the original array
  requestQueue.push(...validRequests); // Add the valid requests back to the array
}
setInterval(removeExpiredRequests, 1000);

app.post("/getMessage", async (req, res, next) => {
  try {
    const { sender, receiver } = req.body || {};
    console.log(Date.now());

    const newReadMessages = await getMessage(sender, receiver);
    if (newReadMessages.length) {
      return res.status(200).json({
        status: 200,
        message: "Messages fetched and updated",
        data: newReadMessages,
        success: true,
        error: null,
      });
    }

    //get existing req
    let newRequestQueue = requestQueue.filter((req) => req.username == sender);
    requestQueue.length = 0; // Clear the original array
    requestQueue.push(...newRequestQueue);
    requestQueue.push({ sender, receiver, req, timestamp: Date.now() });
  } catch (e) {
    console.log(e);
    next({
      status: 500,
      message: "Server error",
      data: null,
      success: false,
      error: null,
    });
  }
});

app.post("/logout", (req, res) => {
  try {
    // Clear the session to log out the user
    req.session.destroy();
    res.status(200).json({
      status: 200,
      message: "User logged out",
      data: null,
      success: true,
      error: null,
    });
  } catch (e) {
    console.log(e);
    next({
      status: 500,
      message: "Server error",
      data: null,
      success: false,
      error: null,
    });
  }
});

app.use((err, req, res, next) => {
  if (err)
    return res.status(err.status).json({
      status: err.status || 500,
      message: err.message || "Something went wrong", //handle error and pass the proper message, not actual code error
      data: null,
      success: false,
      error: err.error || null,
    });
});

const httpsServer = http.createServer(/*credentials,*/ app);

httpsServer.listen(port, () => {
  console.log(`Server is running on port ${port} with HTTPS`);
});
