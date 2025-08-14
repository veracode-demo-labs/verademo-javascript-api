const { db, getConnection, query } = require("../config/db.config");
const crypto = require('crypto');
const moment = require('moment')
const util = require('util');
const speakeasy = require('speakeasy')
const { error } = require("console");
const { isJSDocNonNullableType } = require("typescript");

exports.getUsers = (callback) => {
  db.query(
    `SELECT username,real_name,blab_name,created_at from users`,
    //[],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.getUser = (username, callback) => {
  db.query(
    "select * from users where username='" + username + "';",

    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
}


exports.ignore = (blabberUsername, username, callback) => {
  try{
    let sqlQuery = "DELETE FROM listeners WHERE blabber=? AND listener=?;";
    console.log(sqlQuery);
    db.query(sqlQuery, [blabberUsername, username], (error, results) => {
      if (error) {
        return callback(error);
      }
      sqlQuery = "SELECT blab_name FROM users WHERE username = '" + blabberUsername + "'";
      console.log(sqlQuery);
      db.query(sqlQuery, (error, results) => {
        if(error){
          return callback(error);
        }
        if (results.length > 0 )        
        {
          console.log('result found');
          /* START EXAMPLE VULNERABILITY */
          let event = username + " is now ignoring " + blabberUsername + " (" + results[0].blab_name + ")";
          sqlQuery = "INSERT INTO users_history (blabber, event) VALUES (\"" + username + "\", \"" + event + "\")";
          console.log(sqlQuery);
          db.query(sqlQuery, (error, results) => {
            if (error)
            {
              return callback(error);
            }
            return callback(null, 'query success');
            });
            
          /* END EXAMPLE VULNERABILITY */
        } else {
          console.log('No matching results found');
          return callback(null, 'query success - no results');
        }
      });
    });
  }
  catch (err) {
    console.error(err);
    return callback(err);
  }
};

exports.listen = (blabberUsername, username, callback) => {
  try{
    let sqlQuery = "INSERT INTO listeners (blabber, listener, status) values (?, ?, 'Active');";
    console.log(sqlQuery);
    db.query(sqlQuery, [blabberUsername, username], (error, results) => {
      if (error) {
        return callback(error);
      }
      sqlQuery = "SELECT blab_name FROM users WHERE username = '" + blabberUsername + "'";
      console.log(sqlQuery);
      db.query(sqlQuery, (error, results) => {
        if(error){
          return callback(error);
        }
        if (results.length > 0 ){
          console.log('result found');
          /* START EXAMPLE VULNERABILITY */
          let event = username + " started listening to " + blabberUsername + " (" + results[0].blab_name + ")";
          sqlQuery = "INSERT INTO users_history (blabber, event) VALUES (\"" + username + "\", \"" + event + "\")";
          console.log(sqlQuery);
          db.query(sqlQuery, (error, results) => {
            if (error){
              return callback(error);
            }
            return callback(null, results);
          });
          /* END EXAMPLE VULNERABILITY */
        }
        else{
          console.log('No matching results found');
          return callback(null, 'query success - no results');
        }
      });
    });
  }
  catch (err) {
    console.error(err);
    return callback(err);
  }
};

exports.getProfileInfo = (username, callback) => {
  let locals = {
    hecklers:'',
    events:'',
    username:'',
    realName:'',
    blabName:'',
    totpSecret:''
  };
  
  let sqlMyHecklers = "SELECT users.username, users.blab_name, users.created_at "
				+ "FROM users LEFT JOIN listeners ON users.username = listeners.listener "
				+ "WHERE listeners.blabber=? AND listeners.status='Active';";

    console.log(sqlMyHecklers);
    // First way of making query using forEach loop, which requires promise statement
    // to combat asyncronous errors.
    console.log("creating promise statements");
    hecklerPromise = new Promise((resolve, reject) => {
      db.query(sqlMyHecklers, [username],
        (error, results) => {
          if (error) {
            reject(error);
          }
          console.log('creating forEach promise');
          new Promise((myResolve, myReject) => {
            temp = [];
            try{
              results.forEach((heckler) => {
                let blabber = {
                  'username': heckler['username'],
                  'blab_name': heckler['blab_name'],
                  'created_at': heckler['created_at'],
                }
                temp.push(blabber);
                
              });
              myResolve(temp)
            }
            catch{
              myReject('forEach statement broke')
            }
          }).then((hecklers) => {locals.hecklers = hecklers; resolve();}, (error) => {reject(error)})
        }
      );
    })
    // set .then executables if promise resolves or rejects
  
    eventPromise = new Promise((resolve, reject) => {
      let events = [];
      let sqlMyEvents = "select event from users_history where blabber=\"" + username
          + "\" ORDER BY eventid DESC; ";
		  console.log(sqlMyEvents);
      //Second way of making query using regular for loop
      db.query(sqlMyEvents, (error, results) => {
        if(error){
          reject(error);
        }
        for (const item of results)
        {
          events.push(item['event']);
        }
        locals.events = events
      });
      resolve();
    })

    otherLocals = new Promise((resolve, reject) => {
      let sql = "SELECT username, real_name, blab_name, totp_secret FROM users WHERE username = '" + username + "'";
      console.log(sql);
      db.query(sql, (error, results) => {
        if(error)
        {
          reject(error);
        }
        else{
          
          let myInfoResults = results;
          locals.username = myInfoResults[0]['username'];
          locals.realName = myInfoResults[0]['real_name'];
          locals.blabName = myInfoResults[0]['blab_name'];
          locals.totpSecret = myInfoResults[0]['totp_secret'];
          resolve();
        }
      });
    });

    return Promise.all([
      hecklerPromise,
      eventPromise,
      otherLocals
    ]).then(() => {return callback(null, locals);})
    .catch((error) => {return callback(error);})
};

exports.getEvents = (username, callback) => {
  let events = [];
    let sqlMyEvents = "select event from users_history where blabber=\"" + username
        + "\" ORDER BY eventid DESC; ";
    console.log(sqlMyEvents);
    //Second way of making query using regular for loop
    db.query(sqlMyEvents, (error, results) => {
      if(error){
        return callback(error);
      }
      for (const item of results)
      {
        events.push(item['event']);
      }
      return callback(null, events)
    });
};

exports.updateProfile = async (data, callback) => {
  let oldUsername = data.oldUsername;
  const username = data.username;
  const realName = data.realName;
  const blabName = data.blabName;
  let response;

	try {
		console.log("Executing the update Prepared Statement");
		let updateResult = await query("UPDATE users SET real_name=?, blab_name=? WHERE username=?;", [realName, blabName, oldUsername])
		
		if (updateResult.affectedRows != 1) {
			// await response.set('content-type', 'application/json');
			// return response.status(500).send("{\"message\": \"<script>alert('An error occurred, please try again.');</script>\"}");
      return callback("An error occurred, please try again.");
    }
	} catch (err) {
		console.error(err);
	}

	// Rename profile image if username changes
	if (!(username == oldUsername)) {
		// Check if username exists
		let exists = false;
		let newUsername = username.toLowerCase();
		try {
			console.log("Preparing the duplicate username check Prepared Statement");
			let result = await query("SELECT username FROM users WHERE username=?", [newUsername])
			if (result.length != 0) {
				console.info("Username: " + username + " already exists. Try again.");
				exists = true;
			}
		} catch (err) {
			console.error(err);
		}
		if (exists) {
			// await response.set('content-type', 'application/json');
			// return response.status(409).send("{\"message\": \"<script>alert('That username already exists. Please try another.');</script>\"}");
      return callback("That username already exists. Please try another.")
    }

		// Attempt to update username
		oldUsername = oldUsername.toLowerCase();
		let sqlUpdateQueries = [];
		let renamed = false;
		try {
			let connect = await getConnection();
			const pBeginTransaction = util.promisify(connect.beginTransaction).bind(connect);
			const pQuery = util.promisify(connect.query).bind(connect);
			const pCommit = util.promisify(connect.commit).bind(connect);
			const pRollback = util.promisify(connect.rollback).bind(connect);
			const pRelease = util.promisify(connect.release).bind(connect);

			let sqlStrQueries = ["UPDATE users SET username=? WHERE username=?",
								"UPDATE blabs SET blabber=? WHERE blabber=?",
								"UPDATE comments SET blabber=? WHERE blabber=?",
								"UPDATE listeners SET blabber=? WHERE blabber=?",
								"UPDATE listeners SET listener=? WHERE listener=?",
								"UPDATE users_history SET blabber=? WHERE blabber=?"];
			
			try {
				await pBeginTransaction();
				try {
					for (strQuery of sqlStrQueries) {
						console.log("Preparing the Prepared Statement: " + strQuery)
						await pQuery(strQuery, [newUsername, oldUsername])
					}

					await pCommit();
					pRelease();
				} catch (err) {
					console.error("Error loading data, reverting changes: ", err);
					await pRollback();
					pRelease();
				}
			} catch (err) {
				console.error("Error starting a transaction: ", err);
				await pRollback();
				pRelease();
			}
    
			renamed = true;
		} catch (err) {
			console.error(err);
		} 
		if (!renamed) {
			// await response.set('content-type', 'application/json');
			// return response.status(500).send("{\"message\": \"<script>alert('An error occurred, please try again.');</script>\"}");
      return callback("An error occurred, please try again.");
    }
	}

	// let msg = `Successfully changed values!\\\\nusername: ${username.toLowerCase()}\\\\nReal Name: ${realName}\\\\nBlab Name: ${blabName}`;
	// response = `{\"values\": {\"username\": \"${username.toLowerCase()}\", \"realName\": \"${realName}\", \"blabName\": \"${blabName}\"}, \"message\": \"<script>alert('`
	// 		+ msg + `');</script>\"}`;

	// await response.set('content-type', 'application/json');
	return callback(null, {"message": "Successfully changed values!",
                         "username": username.toLowerCase(), 
                         "realName": realName,
                         "blabName": blabName })
}

exports.getBlabbers = (username, sort, callback) => {

  if (sort == null || sort.isEmpty()) {
    sort = "blab_name ASC";
  }
  const blabbersSql = "SELECT users.username," + " users.blab_name," + " users.created_at,"
            + " SUM(if(listeners.listener=?, 1, 0)) as listeners,"
            + " SUM(if(listeners.status='Active',1,0)) as listening"
            + " FROM users LEFT JOIN listeners ON users.username = listeners.blabber"
            + " WHERE users.username NOT IN (\"admin\",\"admin-totp\",?)" + " GROUP BY users.username" + " ORDER BY " + sort + ";";

  db.query(blabbersSql, [username, username],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

exports.userLogin = (data, callback) => {
  let hashedPassword = crypto.createHash('md5').update(data.password).digest('hex')
  console.log('hashed pass: '+hashedPassword)
  db.query(
    //bad code - SQLi
    `SELECT password from users where username='`+data.username+`' and password='`+hashedPassword+`'`,

    //good code
    //`SELECT * from users where username = ? and password = ?,
    //[data.username, hashedPassword],
    (error, results, fields) => {
      if (error) {
        console.log('Error: '+error)
        return callback(error);
      }
      const resultsLength = results.length
      if ( resultsLength >= 1 ){
        const userToken = results[0].password
        console.log('Auth Token: '+userToken)
        return callback(null, [{"auth token":""+userToken+""}]);
      }
      else {
        return callback(null, "User could not be found");
      }
    }
  );
};

exports.register = async (data, callback) => {
  const username = data.username
	const password = data.password
	const cpassword = data.cpassword
	const realName = data.realName
	const blabName = data.blabName
	
  //
	if (password !== cpassword) {
		console.log("Password and Confirm Password do not match");
		return callback(null, 'password error')
	}

	try {
		// /* START EXAMPLE VULNERABILITY */
		// // Execute the query
		mysqlCurrentDateTime = moment().format("YYYY-MM-DD HH:mm:ss")
    // Create user hashed password
    const userToken = crypto.createHash('md5').update(password).digest("hex")

		let query = "insert into users (username, password, totp_secret, created_at, real_name, blab_name) values(";
		query += "'" + username + "',";
		query += "'" + userToken + "',";
		query += "'" + speakeasy.generateSecret({ length: 20 }).base32 + "',";
		query += "'" + mysqlCurrentDateTime + "',";
		query += "'" + realName + "',";
		query += "'" + blabName + "'";
		query += ");";
		// START BAD CODE
		console.log(query);
		// END BAD CODE 

    //Query the db
		db.query(query, (error, results) => {
      if (error){
        console.log('error occurred');
        return callback(error);
      }
      return callback(null, [{'username': username, "auth token":""+userToken+""}]);
    });
		// /* END EXAMPLE VULNERABILITY */
	} catch (err) {
    console.log('error caught');
		// console.error(err);
    return callback(err);
	}
}