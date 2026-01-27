const mongoose = require('mongoose');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Feedback = require('../models/Feedback');
const MockDb = require('./mockDb');

const createProxy = (modelName, MongooseModel) => { return new Proxy({}, {
    get(target, prop) {
      // Check if mongoose is connected (readyState === 1)
      const impl = mongoose.connection.readyState === 1 ? MongooseModel : MockDb[modelName];
      const value = impl[prop];
      
      if (typeof value === 'function') {
        return value.bind(impl);
      }
      return value;
    }
  });
};

module.exports = {
  User: createProxy('User', User),
  Roadmap: createProxy('Roadmap', Roadmap),
  Feedback: createProxy('Feedback', Feedback)
};
