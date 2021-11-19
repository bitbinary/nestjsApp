const config = () => {
  const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
  };
  const MONGO_USERNAME = process.env.MONGO_USERNAME;
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  const MONGO_DB = process.env.MONGO_DB;
  const MONGO_HOST = process.env.MONGO_URL;

  const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}`,
  };

  const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
  const SERVER_PORT = process.env.SERVER_PORT;

  const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
  };

  return {
    mongo: MONGO,
    server: SERVER,
  };
};

export default config;
