const resolvers = {
  Query: {
    name: (parent, { firstname, lastname }, context, info) => {
      return `My name is ${firstname} ${lastname}!`;
    },
  },
};

export default resolvers;
