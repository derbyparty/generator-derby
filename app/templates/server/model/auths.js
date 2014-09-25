// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     AUTHS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// the file is required from: '../schema.coffee'

module.exports = {
  title: 'Auths Schema',
  description: 'Private and public user data',
  type: 'object',
  additionalProperties: true,
  properties: {
    name: {
      description: 'Username',
      type: 'string'
    },
    email: {
      description: 'User email',
      type: 'string'
    },
    timestamps: {type: 'object'},
    local: {type: 'object'},
    google: {type: 'object'},
    facebook: {type: 'object'},
    vkontakte: {type: 'object'}
  }
};
