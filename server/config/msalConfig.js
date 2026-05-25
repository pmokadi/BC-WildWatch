const msalConfig = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: "Info",
    },
  },
};

const loginRequest = {
  scopes: ["User.Read", "profile", "email", "openid"],
};

const redirectUri = process.env.MICROSOFT_REDIRECT_URI || "http://localhost:8080/api/auth/microsoft/callback";

module.exports = { msalConfig, loginRequest, redirectUri };