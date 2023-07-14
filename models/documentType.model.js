module.exports = (sequelize, DataTypes) => {
  const DocumentType = sequelize.define(
    "DocumentType",
    {
      id: {
        type: DataTypes.STRING(256),
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return DocumentType;
};
