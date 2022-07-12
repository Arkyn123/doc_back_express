module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    "Document",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      body: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      message: {
        type: DataTypes.STRING(256),
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permitionCurrent: {
        type: DataTypes.STRING(256),
      },
      permitionCurrentDesc: {
        type: DataTypes.STRING(256),
      },
      authorPersonalNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      authorFullname: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      registrationNumber: {
        type: DataTypes.STRING(128),
      },
      documentTemplateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      documentTypeDescription: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      users: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        defaultValue: () => [],
      },
      usernames: {
        type: DataTypes.STRING(512),
        defaultValue: () => "",
      },
      officeName: {
        type: DataTypes.STRING(256),
      },
      dateApplication: {
        type: DataTypes.DATE,
      },
      deletedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      flagDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      deletedAuthorFullname: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      deletedAuthorPersonalNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      officeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  Document.associate = function (models) {
    Document.belongsTo(models.DocumentStatus, { as: "status" });
    // Document.belongsTo(models.DocumentType, { as: "documentType" , keyType: DataTypes.STRING(256)});
  };
  return Document;
};
