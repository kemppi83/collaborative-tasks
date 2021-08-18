import mongoose from 'mongoose';

if (process.env.DATABASE_URL) {
  mongoose.connect(process.env.DATABASE_URL, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  });
} else {
  throw new Error('MongoDB connection URI has not been defined');
}

const dbConnected = mongoose.connection;

dbConnected.on('connected', () => console.log('Successfully connected to database'));
dbConnected.on('disconnected', () => console.log('Database connection has been lost'));
dbConnected.on('error', err => console.error(err));

process.on('SIGINT', () => {
  dbConnected.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
