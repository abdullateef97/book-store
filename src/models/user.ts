module.exports = (sequelize: any, DataTypes: any): any => {
  const UserSchema = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'users',
      timestamp: true,
    },
  );

  UserSchema.associate = (models: any): any => {
    UserSchema.hasMany(models.posts, {
      foreignKey: 'user_id',
      as: 'posts',
    });

    UserSchema.hasMany(models.comments, {
      foreignKey: 'user_id',
      as: 'comments',
    });
  };

  return UserSchema;
};
