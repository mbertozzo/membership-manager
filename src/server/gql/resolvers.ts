import User from '../models/user';

const resolvers = {
  Query: {
    name: (parent, { firstname, lastname }, context, info) => {
      return `My name is ${firstname} ${lastname}!`;
    },
  },

  Mutation: {
    login: async (_, { email, password }, { res }, info) => {
      const user = await User.findOne({ email });

      return user;
    },
  },
};

export default resolvers;
