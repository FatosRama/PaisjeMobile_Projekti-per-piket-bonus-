import 'dotenv/config';

export default {
  expo: {
    name: "projekti-bonus",
    slug: "projekti-bonus",
    version: "1.0.0",
    scheme: "projekti-bonus",
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      facebookAppId: process.env.FACEBOOK_APP_ID,
      githubClientId: process.env.GITHUB_CLIENT_ID,
      githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
      microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
      microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    },
  },
};
