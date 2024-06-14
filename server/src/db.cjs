const { MongoClient } = require('mongodb');
const session = require('express-session'); 
const MongoDBStore = require('connect-mongodb-session')(session);

const connectDB = () => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const dbPromise = client.connect().then(() => {
    console.log('Connected to MongoDB');
    return client.db('chatApp');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  });

  const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
  });

  return {
    db: dbPromise,
    sessionStore: sessionStore
  };
};

module.exports = { connectDB };
