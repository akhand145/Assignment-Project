const mongoose = require('mongoose');
const config = require('../config/index');
const { MongoClient } = require('mongodb');
mongoose.Promise = global.Promise;

const uri = 'mongodb://localhost:27017/Ecommerce';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

connect();