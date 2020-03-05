import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    let MONGO_URL;
    if (process.env.NODE_ENV !== 'test') {
      MONGO_URL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
    } else {
      MONGO_URL = process.env.MONGO_URL;
    }

    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
}

export default new Database();
