export default {
  jwt: {
    accessToken: process.env.JWT_ACCESS_TOKEN || '',
  },
  adminSecretKey: process.env.ADMIN_SECRET_KEY,
};
