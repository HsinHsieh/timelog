const DB = require('../DatabaseController.js');

module.exports = class {
  constructor() {

  }

  ////log
  async AddALog(data) {
    var cmd = "INSERT INTO `log` (`UserID`, `TaskTypeID`, `Title`, `StartTime`, `EndTime`, `Description`) VALUES (?, ?, ?, ?, ?, ?);";
    let dbResult = await DB.query(cmd, [data.UserID, data.TaskTypeID, data.Title, data.StartTime, data.EndTime, data.Description]);
    if (dbResult)
      return true;
    return false;
  }

  async ModifyALog(data) {
    var cmd = "UPDATE `log` SET `TaskTypeID` = ?, `Title` = ?, `StartTime` = ?, `EndTime` = ?, `Description` = ? WHERE `LogID` = ?";
    let dbResult = await DB.query(cmd, [data.TaskTypeID, data.Title, data.StartTime, data.EndTime, data.Description, data.LogID]);
    if (dbResult)
      return true;
    return false;
  }

  async DeleteALog(data) {
    var cmd = "UPDATE `log` SET `IsDeleted` = ? WHERE `LogID` = ?;";
    let dbResult = await DB.query(cmd, [true, data.LogID]);
    if (dbResult)
      return true;
    return false;
  }

  async GetALog(logID) {
    var cmd = "SELECT * FROM `log` WHERE `LogID` = ?;";
    let dbResult = await DB.query(cmd, [logID]);
    if (dbResult.length != 0)
      return dbResult[0];
    return "no data";;
  }

  async GetUserLogsByIterationID(userID, iterationID) {
    var cmd = "SELECT * FROM `log`, `iteration` WHERE `log`.`UserID` = ? AND `log`.`StartTime` >= `iteration`.`StartDate` AND `log`.`EndTime` <= DATE_ADD(`iteration`.`EndDate`, INTERVAL 1 DAY) AND `IterationID` = ? AND `log`.`IsDeleted` = ?";
    let dbResult = await DB.query(cmd, [userID, iterationID, false]);
    return dbResult;
  }

  async GetUserLogsByRange(userID, startDate, endDate) {
    var cmd = "SELECT * FROM `log` WHERE `UserID` = ? AND `StartTime` >= ? AND `EndTime` <= ? AND `IsDeleted` = ?"
    const result =  await DB.query(cmd, [userID, startDate, endDate, false])
    return result
  }

  async GetUserLogsBySearch(data) {
    var params = [];
    var cmd = "SELECT `log`.* FROM `log` WHERE `log`.`IsDeleted` = ? AND `log`.`UserID` = ? AND (`log`.`Title` LIKE ? OR `log`.`Description` LIKE ?)";
    params.push(false);
    params.push(data.UserID);
    params.push("%" + data.Description + "%", "%" + data.Description + "%");
    if (data.StartTime && data.EndTime) {
      cmd += " AND (`log`.`StartTime` >= ? AND `log`.`EndTime` < ?)";
      params.push(data.StartTime, data.EndTime);
    }
    let dbResult = await DB.query(cmd, params);
    if (dbResult.length != 0)
      return dbResult;
    return "no data";
  }

  ////task types
  async GetUserTaskTypes(userID) {
    var cmd = "SELECT * FROM `task_type` WHERE `UserID` = ? AND `IsDeleted` = ?";
    let dbResult = await DB.query(cmd, [userID, false]);
    return dbResult;
  }

  async ModifyOrAddATaskType(data) {
    var dbResult;
    if (data.TaskTypeID == null) {
      var cmd = "INSERT INTO `task_type` (`UserID`, `TaskTypeName`, `IsPrivate`, `IsEnable`) VALUES (?, ?, ?, ?);";
      dbResult = await DB.query(cmd, [data.UserID, data.TaskTypeName, data.IsPrivate, data.IsEnable]);
    } else {
      var cmd = "UPDATE `task_type` SET `TaskTypeName` = ?, `IsPrivate` = ?, `IsEnable` = ? WHERE `TaskTypeID` = ?;";
      dbResult = await DB.query(cmd, [data.TaskTypeName, data.IsPrivate, data.IsEnable, data.TaskTypeID]);
    }
    if (dbResult)
      return true;
    return false;
  }

  async DeleteATaskType(taskTypeID) {
    var cmd = "UPDATE `task_type` SET `IsDeleted` = ? WHERE `TaskTypeID` = ?;";
    let dbResult = await DB.query(cmd, [true, taskTypeID]);
    if (dbResult)
      return true;
    return false;
  }

  //target
  async QueryGoalByIteration(data) {
    var cmd = "SELECT * FROM `goal` WHERE `IterationID` =? ;";
    let dbResult = await DB.query(cmd, [data.IterationID]);
    if (dbResult.length > 0)
      return dbResult;
    return "no data";
  }

  async ModifyOrAddAGoal(data) {
    var cmd = "INSERT INTO `goal` (`IterationID`, `TaskTypeID`, `GoalHour`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `GoalHour` = ?;";
    let dbResult = await DB.query(cmd, [data.IterationID, data.TaskTypeID, data.GoalHour, data.GoalHour]);
    if (dbResult)
      return true;
    return false;
  }

  //// Iteration
  async QueryIterationByIterationID(iterationID) {
    var cmd = "SELECT * FROM `iteration` WHERE iterationID = ?";
    let dbResult = await DB.query(cmd, [iterationID]);
    if (dbResult.length != 0)
      return dbResult;
    return "no data"
  }
}
