const express = require("express")
const session = require("express-session")
const passport = require("passport")

const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require("passport-facebook").Strategy

const userModel = require("../models/userModel")

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
            maxAge: 6048000
      }
}))

router.use(passport.initialize())
router.use(passport.session())

// Local Authentication
passport.use(userModel.createStrategy())
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
      userModel.findById(id, (err, user) => {
            done(err, user)
      })
})

router.post("/login", (req, res) => {
      const user = new userModel({
            username: req.body.username,
            password: req.body.password
      })

      req.login(user, err => {
            err ? (console.error(err), res.json({message: "Login Failed"})) :
            passport.authenticate("local")(req, res, () => {
                  res.json({message: "Login Successful"})
            })
      })
})

router.post("/register", (req, res) => {
      userModel.register({username: req.body.username}, req.body.password, (err, user) => {
            err ? (console.error(err), res.json({message: "Registration Failed"})) :
            passport.authenticate("local")(req, res, () => {
                  res.json({message: "Registration Successful"})
            })
      })
})

router.get("/logout", (req, res) => {
      req.logout()
      res.end()
})

// Google Authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/login"
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/login', 
  passport.authenticate('google', { 
        failureRedirect: '/',
        successRedirect: "/home" 
      }),
);

  // Facebook Authentication
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/auth/facebook/login"
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get("/auth/facebook", passport.authenticate("facebook"))
router.get("/auth/facebook/login",
  passport.authenticate("facebook", {
        failureRedirect: "/",
        successRedirect: "/home"
      }),
)

module.exports = router