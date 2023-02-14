export default (sequelize, DataTypes) => {
  // eslint-disable-next-line camelcase
  const user_org = sequelize.define(
    'user_org',
    {
      userIsAdmin: DataTypes.BOOLEAN,
    },
    {
      timestamps: false,
    },
  );

  // eslint-disable-next-line camelcase
  return user_org;
};
