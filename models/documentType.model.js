module.exports = (sequelize, DataTypes) => {
  const DocumentType = sequelize.define(
    "DocumentType",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ownerFullname: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  // DocumentType.associate = function (models) {
  //   DocumentType.hasMany(models.DocumentRoute, { onDelete: 'CASCADE', foreignKey: 'documentTypeId', as: 'DocumentType' })
  // };
  return DocumentType;
};
