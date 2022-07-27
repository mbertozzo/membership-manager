import logger from 'pino';
const log = logger();

const apolloLoggerPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart() {
    //   console.log('Request started! Query:\n' + requestContext.request.query);

    return {
      // Fires when Apollo Server encounters errors while parsing,
      // validating, or executing a GraphQL operation.
      async didEncounterErrors({ errors }) {
        log.error('Following query resulted in an error:\n' + errors);
      },
    };
  },
};

export default apolloLoggerPlugin;
