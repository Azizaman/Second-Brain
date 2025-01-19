var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Replace with your Google Client ID and Secret
const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback", // Callback route
}, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
    // Save or retrieve user from the database
    const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
    };
    return done(null, user);
})));
// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});
// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});
module.exports = passport;
