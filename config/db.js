const mongoose = require('mongoose');
require('dotenv').config({ path: 'var.env' });

const DB_CONNECT = async () => {
      try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('DB Connection on...')
      } catch (e) {
          console.log(e);
          process.exit(1);
      }
}

module.exports = DB_CONNECT;
