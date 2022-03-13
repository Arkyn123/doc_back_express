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
          allowNull: false,
        }
        //статус,
        //цех, 
        //регистрационный номер,
        //дата регистрации

      },
      {
        // hooks: {
        //   beforeValidate: (specialist, options) => {
        //     specialist.fullname = specialist.middlename
        //       ? `${specialist.surname} ${specialist.name} ${specialist.middlename}`
        //       : `${specialist.surname} ${specialist.name}`;
        //   },
        // },
        // uniqueKeys: {
        //   uniqueLike: {
        //     fields: ["personalNumber", "sectionId"],
        //   },
        // },
        // updatedAt: false,
        freezeTableName: true,
      }
    );
    Document.associate = function (models) {
      // Document.hasMany(models.RouteCoordination, { onDelete: 'CASCADE', foreignKey: 'documentId', as: 'routeCoordinations' })
      Document.belongsTo(models.DocumentStatus, { as: "status" })
      Document.belongsTo(models.DocumentRoute, { as: "order" })
      Document.belongsTo(models.DocumentType, { as: "documentType" });
    };
    return Document;
  };
  