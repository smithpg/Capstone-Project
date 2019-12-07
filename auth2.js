const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./data/user");

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    //console.log("serializeUser gets ", user);

    done(null, user._id);
  });
  passport.deserializeUser((userId, done) => {
    // retrieve user document from db
    //console.log("deserializing");
    //console.log(userId);

    User.findById(userId, (err, user) => {
      if (err) {
        console.error(err)
      }
      done(null, user);
    });
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
        // passReqToCallback: true
      },
      async function(token, refreshToken, profile, done) {
        const {
          id,
          name: { familyName, givenName }
        } = profile;

        //console.log(profile.emails[0].value);

        User.findOne({ googleId: profile.id }, async function(err, user) {
          if (err) {
            return done(err);
          }
          //If no user found create user
          if (!user) {
            user = new User({
              firstname: givenName,
              lastname: familyName,
              googleId: id,
              email: profile.emails[0].value
            });

            user.save(function(err) {
              return done(err, user);
            });
          } else {
            //user found
            //console.log("USER EXISTED");
            return done(err, user);
          }
        });
      }
    )
  );
};
