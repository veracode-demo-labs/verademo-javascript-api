const db = require("../config/db.config");
const pyformat = require('pyformat');

exports.getBlabsForMe = (username, callback) => {
  const sqlBlabsForMe = "SELECT users.username, users.blab_name, blabs.content, blabs.timestamp, COUNT(comments.blabber) AS count, blabs.blabid "
        + "FROM blabs INNER JOIN users ON blabs.blabber = users.username INNER JOIN listeners ON blabs.blabber = listeners.blabber "
        + "LEFT JOIN comments ON blabs.blabid = comments.blabid WHERE listeners.listener = ? "
        + "GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC LIMIT {} OFFSET {};";
  console.log("Executing the BlabsForMe Prepared Statement");
  db.query(pyformat(sqlBlabsForMe, [10, 0]), [username],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getBlabsByMe = (username, callback) => {
  const sqlBlabsByMe = "SELECT blabs.content, blabs.timestamp, COUNT(comments.blabber) AS count, blabs.blabid "
        + "FROM blabs LEFT JOIN comments ON blabs.blabid = comments.blabid "
        + "WHERE blabs.blabber = ? GROUP BY blabs.blabid ORDER BY blabs.timestamp DESC;";
  
  console.log("Executing the BlabsByMe Prepared Statement");
  db.query(sqlBlabsByMe, [username],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
};

exports.addBlab = (data, callback) => {
  const newDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  //newDate.format("%Y-%m-%d %H:%M:%s")
  db.query(
    //bad code SQLi
    `INSERT INTO blabs (blabber, content, timestamp) VALUES ("`+data.user+`", "`+data.blab+`", "`+newDate+`")`,

    //good code
    //`INSERT INTO blabs (blabber, content, timestamp) VALUES (?, ?, ?)`,
    [data.user, data.blab, new Date()],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, "Blab posted successfully");
    }
  );
};

exports.getAllBlabs = (data, callback) => {
    db.query(
      `SELECT * from blabs`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  };


exports.addBlabComment = (data, callback) => {
  const newDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  db.query(
    //bad code SQLi
    `INSERT INTO comments (blabid, content, blabber, timestamp) VALUES ("`+data.blabId+`", "`+data.comment+`", "`+data.user+`", "`+newDate+`")`,

    //good code
    //`INSERT INTO comments (blabid, content, blabber, timestamp) VALUES (?, ?, ?, ?)`,
    [data.blabId, data.comment, data.user, new Date()],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, `Comment Added Successfully`);
    }
  );
};

exports.getBlabComments = (data, callback) => {
  db.query(
    //bad code SQLi
    `SELECT * from comments where blabid = "`+data.blabId+`"`,

    //good code
    //`SELECT * from comments where blabid = ?`,
    //[data.blabId],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};






exports.deleteBlab = (data, callback) => {
  db.query(
  //bad code SQLi
  `DELETE FROM blabs WHERE blabid =?`,
  //good code
  //`DELETE FROM blabs WHERE blabid =?`,
  [data.blabId],
  (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      if (results.affectedRows === 1) {
        return callback(null, `Blab Deleted Successfully`);
      } else {
        return callback(new Error("Invalid post"));
      }
    }
  );
};