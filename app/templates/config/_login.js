module.exports = {
  // db collection
  collection: 'auths',
  // projection of db collection
  publicCollection: 'users',
  user: {
    id: true,
    email: true
  },
  confirmRegistration: false,
  // passportjs options
  passport: {
    successRedirect: '/',
    failureRedirect: '/'
  },
  strategies: {<% if (loginGithub) {%>
    github: {
      strategy: require("passport-github").Strategy,
      conf: {
        clientID: "eeb00e8fa12f5119e5e9",
        clientSecret: "61631bdef37fce808334c83f1336320846647115"
      }
    },<% } %><% if (loginGoogle) {%>
    google: {
      strategy: require('passport-google-oauth').OAuth2Strategy,
      conf: {
        clientID: '1060568558513-164eli9jaaf8nbjgv4asv3gutn72usl6.apps.googleusercontent.com',
        clientSecret: 'lqYJ1NF1AEeAA07MUGrIynXD',
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: 'https://www.googleapis.com/auth/plus.login'
      }
    },<% } %><% if (loginLinkedIn) {%>
    linkedin: {
      strategy: require('passport-linkedin').Strategy,
      conf: {
        consumerKey: '4s7d4s2c1d7s',
        consumerSecret: '4Df1dW8s547qQ95',
        profileFields: ["id", "first-name", "last-name", "headline", "email-address"],
        params: {
          scope: ["r_fullprofile", "r_emailaddress"]
        }
      }
    },<% } %><% if (loginFacebook) {%>
    facebook: {
      strategy: require('passport-facebook').Strategy,
      conf: {
        clientID: '58362219983',
        clientSecret: 'da0fb6cbcb6cac1a0aca9f78200935d2',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
      }
    },<% } %><% if (loginVkontakte) {%>
    vkontakte: {
      strategy: require('passport-vkontakte').Strategy,
      conf: {
        clientID: '4373291',
        clientSecret: 'fOZiLyGhSH1DHWLFFfZo',
        callbackURL: 'http://localhost:3000/auth/vkontakte/callback'
      }
    }<% } %>
  },
  hooks: {
    request: function(req, res, userId, isAuthenticated, done) {
      done();
    }
  }
};