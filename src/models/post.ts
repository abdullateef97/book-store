module.exports = (sequelize: any, DataTypes: any): any => {
  const PostSchema = sequelize.define(
    'posts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'posts',
      timestamp: true,
    },
  );

  PostSchema.associate = (models: any): any => {
    PostSchema.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });

    PostSchema.hasMany(models.comments, {
      foreignKey: 'post_id',
      as: 'comments',
    });
  };

  return PostSchema;
};
