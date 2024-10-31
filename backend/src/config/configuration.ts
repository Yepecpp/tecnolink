export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI,
    options: { ...JSON.parse(process.env.MONGOOSE_OPTIONS), autoIndex: true },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  saltRounds:
    process.env.SALT && Number.isInteger(parseInt(process.env.SALT, 10)) ? parseInt(process.env.SALT, 10) : 10,
});
