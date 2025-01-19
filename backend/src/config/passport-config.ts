const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Replace with your Google Client ID and Secret
const GOOGLE_CLIENT_ID = ''
const GOOGLE_CLIENT_SECRET =''

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback", // Callback route
        },
        async (accessToken, refreshToken, profile, done) => {
            // Save or retrieve user from the database
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
            };
            return done(null, user);
        }
    )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
