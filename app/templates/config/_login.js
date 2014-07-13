module.exports = {
  // db collection
  collection: 'auths',
  // projection of db collection
  publicCollection: 'users',
  // passportjs options
  passport: {
    successRedirect: '/',
    failureRedirect: '/'
  },
  strategies: {
    github: {
      strategy: require("passport-github").Strategy,
      conf: {
        clientID: "eeb00e8fa12f5119e5e9",
        clientSecret: "61631bdef37fce808334c83f1336320846647115"
      }
    }
  },
  // projection
  user: {
    id: true,
    email: true,
    github: true
  }
}