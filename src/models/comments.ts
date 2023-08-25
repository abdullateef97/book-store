module.exports = (sequelize: any, DataTypes: any): any => {
  const CommentSchema = sequelize.define(
    'comments',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
      },
    },
    {
      tableName: 'comments',
      timestamp: true,
    },
  );

  CommentSchema.associate = (models: any): any => {
    CommentSchema.belongsTo(models.posts, {
      foreignKey: 'post_id',
      as: 'post',
    });

    CommentSchema.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return CommentSchema;
};
