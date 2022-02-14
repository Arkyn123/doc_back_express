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
        }
        // surname: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // name: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // middlename: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // personalNumber: {
        //   type: DataTypes.INTEGER,
        //   defaultValue: null,
        // },
        // job: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // position: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: null,
        // },
        // dateStart: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // dateEnd: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // dateApplication: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // positionLeader: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: null,
        // },
        // fullnameLeader: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // surnameLeader: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // nameLeader: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
        // middlenameLeader: {
        //   type: DataTypes.STRING(128),
        //   defaultValue: "",
        // },
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
      //   Specialist.belongsTo(models.Section, { as: "section" });
    };
    return Document;
  };
  