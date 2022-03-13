module.exports = (sequelize, DataTypes) => {
  const DocumentRoute = sequelize.define(
    "DocumentRoute",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permition: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      // id автора статьи
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // ФИО автора статьи
      ownerFullname: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  DocumentRoute.associate = function (models) {
    // Джоины
    DocumentRoute.belongsTo(models.DocumentType, { as: "documentType" });
  };

  return DocumentRoute;
};
