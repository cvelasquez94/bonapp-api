'use strict';
require('dotenv').config();
const pack = require('../package.json');

module.exports = {
  secret: process.env.SECRET || 'test',
  config: {
    port: process.env.PORT || pack.config.port,
    prefix: pack.config.prefix,
  },
  database: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
  },
  adminUser: {
    firstName: process.env.ADMIN_FIRST_NAME,
    lastName: process.env.ADMIN_LAST_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  storage: {
    url: process.env.STORAGE_URL,
    auth: process.env.STORAGE_AUTH,
    environment: process.env.ENVIRONMENT,
    bucket: {
      tenancyId: process.env.TENANCYID,
      userId: process.env.USERID,
      keyFingerprint: process.env.KEYFINGERPRINT,
      privateKey: process.env.PRIVATEKEY,
      region: process.env.REGIO
    }
  },
};
