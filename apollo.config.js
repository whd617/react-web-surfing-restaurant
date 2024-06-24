module.exports = {
  rules: {
    'testing-library/no-debugging-utils': [
      'error',
      {
        utilsToCheckFor: {
          debug: false,
          logRoles: true,
          logDOM: true,
        },
      },
    ],
  },
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'nuber-eats-backend',
      url:
        process.env.NODE_ENV === 'production'
          ? 'https://web-restaurants-backend-78a7ec1afcae.herokuapp.com/graphql'
          : 'http://localhost:4000/graphql',
    },
  },
};
