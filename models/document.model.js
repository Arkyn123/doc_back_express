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
          defaultValue: {}
        },
        message: {
          type: DataTypes.STRING(256),
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
          type: DataTypes.INTEGER,
        },
        documentTemplateID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        documentType: {
          type: DataTypes.STRING(256),
          allowNull: false,
        }
      },
      {
        freezeTableName: true,
      }
    );
    Document.associate = function (models) {
      Document.belongsTo(models.DocumentStatus, { as: "status" })
      // Document.belongsTo(models.DocumentRoute, { as: "route" })
      // Document.belongsTo(models.DocumentType, { as: "documentType" , keyType: DataTypes.STRING(256)}); 
    };
    return Document;
  };
  