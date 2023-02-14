export default (sequelize, DataTypes) => {
  const Org = sequelize.define(
    'org',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    },
  );

  Org.associate = models => Org.belongsToMany(models.user, { through: models.user_org });

  return Org;
};
