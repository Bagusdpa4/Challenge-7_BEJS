require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");

const { GOOGLE_SENDER_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

module.exports = {
  sendMail: async (to, subject, html) => {
    try {
      const accessToken = await oauth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: GOOGLE_SENDER_EMAIL,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          refreshToken: GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      transport.sendMail({
        to,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getHTML: (filename, data) => {
    return new Promise((resolve, reject) => {
      const path = `${__dirname}/../views/templates/${filename}`;

      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
};
