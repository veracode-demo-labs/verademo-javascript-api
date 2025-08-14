const usersService = require("../services/users.service");


exports.getUsers = (req, res, next) => {
  console.log('GET /users/getUsers')
  console.log('Request Data: '+JSON.stringify(req.body))
  usersService.getUsers((error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.getUser = (req, res, next) => {
  console.log('GET /users/getUser')
  console.log('Request Data: '+JSON.stringify(req.body))
  usersService.getUser(req.user, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.ignore = (req, res, next) => {
  console.log('POST /users/ignore')
  console.log('Request Data: '+JSON.stringify(req.body))
  if ( typeof req.body.blabberUsername == 'undefined'){
    return res.status(400).send({
      success: 1,
      data: "One or more required parameters missing",
    });
  }
  usersService.ignore(req.body.blabberUsername, req.user, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.listen = (req, res, next) => {
  console.log('POST /users/listen')
  console.log('Request Data: '+JSON.stringify(req.body))
  if ( typeof req.body.blabberUsername == 'undefined'){
    return res.status(400).send({
      success: 1,
      data: "One or more required parameters missing",
    });
  }
  usersService.listen(req.body.blabberUsername, req.user, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.getBlabbers = (req, res, next) => {
  console.log('GET /users/getBlabbers')
  console.log('Request Data: '+JSON.stringify(req.body))
  sort = req.query.sort
  usersService.getBlabbers(req.user, sort, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.getProfileInfo = (req, res, next) => {
  console.log('GET /users/getProfileInfo')
  console.log('Request Data: '+JSON.stringify(req.body))

  usersService.getProfileInfo(req.user, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.getEvents = (req, res, next) => {
  console.log('GET /users/getEvents')
  console.log('Request Data: '+JSON.stringify(req.body))

  usersService.getEvents(req.user, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.updateProfile = (req, res, next) => {
  console.log('GET /users/updateProfile')
  console.log('Request Data: '+JSON.stringify(req.body))

  //check required parameters
  if ( !req.body.username || !req.body.blabName || !req.body.realName ) {
    return res.status(400).send({
      success: 1,
      data: "One or more required parameters missing",
    });
  }

  const data = {
    oldUsername: req.user,
    username: req.body.username,
    blabName: req.body.blabName,
    realName: req.body.realName,
  }

  usersService.updateProfile(data, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: error });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.userLogin = (req, res, next) => {
  console.log('POST /users/login')
  console.log('Request Data: '+JSON.stringify(req.body))
  //check user
  // if ( req.user.toLowerCase() != req.body.username.toLowerCase()){
  //   console.log('Requesting password for a different user, request forbidden')
  //   return res.status(403).send({ success: 0, data: "Forbidden" });
  // }
  //check required parameters
  if ( typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined' ){
    return res.status(400).send({
      success: 1,
      data: "One or more required parameters missing",
    });
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  usersService.userLogin(data, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};

exports.register = (req, res, next) => {
  console.log('POST /users/register')
  console.log('Request Data: '+JSON.stringify(req.body))

  //check required parameters
  if ( typeof req.body.username == 'undefined' || typeof req.body.password == 'undefined' ){
    return res.status(400).send({
      success: 1,
      data: "One or more required parameters missing",
    });
  }

  const data = {
    username : req.body.username,
    password : req.body.password,
    cpassword : req.body.cpassword,
    realName : req.body.realName,
    blabName : req.body.blabName,
  };

  usersService.register(data, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(400).send({ success: 0, data: "Bad request" });
    }
    if( results == "password error")
    {
      return res.status(400).send({ success: 1, data: "The Password and Confirm Password values do not match. Please try again." })
    }
    return res.status(200).send({
      success: 1,
      data: results,
    });
  });
};