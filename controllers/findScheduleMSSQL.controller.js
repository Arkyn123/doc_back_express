const dbMSSQL = require("../modelsMSSQL");
const { SequelizeMSSQL, sequelizeMSSQL } = dbMSSQL;
const { ValidationError } = SequelizeMSSQL;
const errors = require("../utils/errors");
const {} = require("../filteringAndMiddleware/associations");

class FindScheduleMSSQLController {
  async getAllSchedule(req, res) {
    try {
      const [results, metadata] = await sequelizeMSSQL.query(`SELECT distinct  
      b.[ORG_ID]
     ,[ORG_NAME]
     ,[PARENT_ORG_ID]
     ,[PARENT_ORG_NAME]
        ,b.[POSITION_ID]
     ,b.[POSITION_NAME] 
        
 FROM [ELR_Orders].[dbo].[T_XXHR_OSK_ASSIGNMENTS_V] a join [T_XXHR_OSK_POSITIONS] b on a.ORG_ID=b.ORG_ID
 where b.POSITION_ID like '%${req.query.position}%' or b.POSITION_NAME like '%${req.query.position}%'
`);
      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
//   async getAllBrigada(req, res) {
//     try {
//       console.log(req.query.position);
//       const [results, metadata] = await sequelizeMSSQL.query(`SELECT distinct 
//       [SCHEDULE],
//       [BRIGADA],
//       b.NAME
//       from [T_XXHR_WORKER_INFORMATION] a join [T_XXHR_WORK_SCHEDULES] b on a.SCHEDULE=b.CODE      
// `);
//       console.log(results, metadata);
//       return res.status(errors.success.code).json(results);
//     } catch (e) {
//       console.log(e);
//       return res.sendStatus(errors.internalServerError.code);
//     }
//   }
}
module.exports = new FindScheduleMSSQLController();
