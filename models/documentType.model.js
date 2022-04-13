module.exports = (sequelize, DataTypes) => {
  const DocumentType = sequelize.define(
    "DocumentType",
    {
      id: {
        type: DataTypes.STRING(256),
        primaryKey: true,
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
