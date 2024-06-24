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
      url: 'http://localhost:4000/graphql',
    },
  },
};
