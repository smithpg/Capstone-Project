const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((user, done) => {
    // retrieve user document from db

    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.REACT_APP_CLIENT_ID,
        clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
        // passReqToCallback: true
      },
      function(token, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function(err, user) {
          if (err) {
            console.log("ERROR");
            return done(err);
          }
          //If no user found create user
          if (!user) {
            user = new User({
              profile: profile,
              token: token,
              name: profile.displayName,
              email: profile.emails[0].value,
              username: profile.username,
              provider: "google",
              google: profile._json
            });
            console.log("TEST");
            console.log(profile.displayName);
            console.log(profile.emails[0].value);
            console.log(profile.username);

            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            console.log("GOT HERE");
            //user found
            return done(err, user);
          }
        });
      }
    )
  );
};
