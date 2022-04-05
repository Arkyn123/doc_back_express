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
        registrationNumber: {
          type: DataTypes.INTEGER,
        },
        dateApplication: {
          type: DataTypes.DATE,
        }
      },
      {
        freezeTableName: true,
      }
    );
    Document.associate = function (models) {
      Document.belongsTo(models.DocumentStatus, { as: "status" })
      // Document.belongsTo(models.DocumentRoute, { as: "route" })
      Document.belongsTo(models.DocumentType, { as: "documentType" });
    };
    return Document;
  };
  