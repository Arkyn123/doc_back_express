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
        //статус,
        //цех, 
        //регистрационный номер,
        //дата регистрации

       //маршрут согласования отд. таблица (id докум, )
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
      Document.hasMany(models.RouteCoordination, { onDelete: 'CASCADE', foreignKey: 'documentId', as: 'routeCoordinations' })
    };
    return Document;
  };
  