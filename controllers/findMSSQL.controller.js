const dbMSSQL = require("../modelsMSSQL");
const { SequelizeMSSQL, sequelizeMSSQL } = dbMSSQL;
const { ValidationError } = SequelizeMSSQL;
const errors = require("../utils/errors");
const {} = require("../filteringAndMiddleware/associations");

class FindScheduleMSSQLController {
  async getAllSchedule(req, res) {
    try {
      const [results, metadata] = await sequelizeMSSQL.query(`
      select distinct
      a.ORG_ID,
      b.ORG_NAME, 
      c.PARENT_ORG_ID, 
      c.PARENT_ORG_NAME, 
      a.POSITION_ID, 
      a.POSITION_NAME, 
      (select distinct ORG_NAME from T_XXHR_OSK_ORG_HIERARHY_V where ORGANIZATION_ID = b.ORGANIZATION_ID_PARENT and DATE_TO > GETDATE()) as SECTOR
      from [T_XXHR_OSK_POSITIONS] a
      join [T_XXHR_OSK_ORG_HIERARHY_V] b on a.ORG_ID=b.ORGANIZATION_ID
      join [T_XXHR_OSK_ASSIGNMENTS_V] c on a.ORG_ID=c.ORG_ID
      where (b.DATE_TO > GETDATE()) and (a.POSITION_ID like '%${req.query.position}%' or a.POSITION_NAME like '%${req.query.position}%') 
`);
      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
  async getAllBrigada(req, res) {
    try {
      const [results, metadata] = await sequelizeMSSQL.query(`SELECT distinct 
      [SCHEDULE],
      [BRIGADA],
      b.NAME
      from [T_XXHR_WORKER_INFORMATION] a join [T_XXHR_WORK_SCHEDULES] b on a.SCHEDULE=b.CODE
      where BRIGADA like '%${req.query.brigada}%'    
`);
      return res.status(errors.success.code).json(results);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}
module.exports = new FindScheduleMSSQLController();