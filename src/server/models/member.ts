export default (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'member',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    },
  );

  Member.associate = models => Member.belongsTo(models.org);

  return Member;
};
