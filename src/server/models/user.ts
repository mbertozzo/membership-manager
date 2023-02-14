import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
      },
      verifiedOn: {
        type: DataTypes.DATE,
      },
      resetToken: {
        type: DataTypes.STRING,
      },
      resetExpiration: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const encryptPasswordIfChanged = async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(parseFloat(process.env.SALT_ROUNDS || '12'));
      user.password = await bcrypt.hash(user.password, salt);
    }
  };

  User.beforeCreate(encryptPasswordIfChanged);
  User.beforeUpdate(encryptPasswordIfChanged);

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = models => User.belongsToMany(models.org, { through: 'userorgs' });

  return User;
};
