const usersController = require("../controller/users.controller");
const resetController = require("../controller/reset.controller.js")
const checkUser = require("../tools/checkUserToken.js")

var express = require("express");

var router = express.Router();

/**
 * @swagger
 * /users/getBlabbers:
 *   get:
 *     description: get Blabbers
 *     tags:
 *       - users
 *     responses:
 *       '200':
 *         description: Resource accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: The blabber username.
 *                         example: april
 *                       blab_name:
 *                         type: string
 *                         description: The blabber blab name.
 *                         example: April
 *                       created_at:
 *                         type: string
 *                         description: the datetime blabber was created.
 *                         example: 2024-08-05T19:58:03.000Z
 *                       listeners:
 *                         type: integer
 *                         description: Whether user is listening to this blabber
 *                         example: 0
 *                       listening:
 *                         type: integer
 *                         description: The bumber of accounts listening to this blabber
 *                         example: 17
 *       '500':
 *          description: Internal server error
 *       '400':
 *          description: Bad request
*/
router.get("/getBlabbers", checkUser, usersController.getBlabbers);

/**
 * @swagger
 * /users/ignore:
 *   post:
 *     summary: ignore a user
 *     tags:
 *      - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              blabberUsername:
 *                type: string
 *                description: The blabber to ignore
 *                example: johnny
 *     responses:
 *        '200':
 *            description: Database changed successfully
 *        '500':
 *            description: Internal server error
 *        '400':
 *            description: Bad request
 */
router.post("/ignore", checkUser, usersController.ignore);

/**
 * @swagger
 * /users/listen:
 *   post:
 *     summary: listen to a user
 *     tags:
 *      - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              blabberUsername:
 *                type: string
 *                description: The blabber to listen to.
 *                example: johnny
 *     responses:
 *        '200':
 *            description: Database changed successfully
 *        '500':
 *            description: Internal server error
 *        '400':
 *            description: Bad request
 */
router.post("/listen", checkUser, usersController.listen);

/**
 * @swagger
 * /users/getProfileInfo:
 *   get:
 *       description: Get a User's information
 *       tags:
 *        - users
 *       responses:
 *           '200':
 *               description: Information Retrieved
 *               content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      data:
 *                        type: object
 *                        properties:
 *                          hecklers:
 *                            type: array
 *                            items:
 *                              type: object
 *                              properties:
 *                                username:
 *                                  type: string
 *                                  description: The heckler username.
 *                                  example: april
 *                                blab_name:
 *                                  type: string
 *                                  description: The heckler blab name.
 *                                  example: April
 *                                created_at:
 *                                  type: string
 *                                  description: the datetime heckler was created.
 *                                  example: 2024-08-05T19:58:03.000Z
 *                          events:
 *                            type: array
 *                            items:
 *                              type: string
 *                              description: the event that occurred
 *                              example: Brian stopped listening to Johnny
 *                          username:
 *                            type: string
 *                            description: The username
 *                            example: april
 *                          realName:
 *                            type: string
 *                            description: The real name
 *                            example: Brian Pitta
 *                          blabName:
 *                            type: string
 *                            description: The blab name
 *                            example: Brian
 *                          totpSecret:
 *                            type: string
 *                            description: The totpSecret code
 *                            example: FZQWCJRVHZWFKMLGPFIS6ZCRIZBEGWZ6
 *           '500':
 *              description: Internal server error
 *           '400':
 *              description: Bad request
 */

router.get("/getProfileInfo", checkUser, usersController.getProfileInfo);


 
/**
 *  @swagger
 *  /users/getEvents:
 *    get:
 *      description: Get a User's event history
 *      tags:
 *        - users
 *      responses:
 *          '200':
 *              description: Events Retrieved
 *              content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    data:
 *                      type: array
 *                      items:
 *                        type: string
 *                        description: the event that occurred
 *                        example: Brian stopped listening to Johnny
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get("/getEvents", checkUser, usersController.getEvents);

/**
 * @swagger
 * /users/updateProfile:
 *   post:
 *     summary: update the user's profile
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username
 *                 example: brian
 *               blabName:
 *                 type: string
 *                 description: The new blab name
 *                 example: Stydvin
 *               realName:
 *                 type: string
 *                 description: The new real name
 *                 example: StuKevClyde
 *     responses:
 *       '200':
 *           description: Database changed successfully
 *       '500':
 *           description: Internal server error
 *       '400':
 *           description: Bad request
*/
router.post("/updateProfile", checkUser, usersController.updateProfile);
 
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: register a user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username
 *                 example: carst
 *               password:
 *                 type: string
 *                 description: new password
 *                 example: carst
 *               cpassword:
 *                 type: string
 *                 description: confirmed password
 *                 example: carst
 *     responses:
 *       '200':
 *           description: Database changed successfully
 *       '500':
 *           description: Internal server error
 *       '400':
 *           description: Bad request
*/
router.post("/register", usersController.register);

/**
 * @swagger
 * /users/reset:
 *  get:
 *      description: reset database
 *      tags:
 *          - users
 *      responses:
 *          '200':
 *              description: Resource accessed successfully
 *          '500':
 *              description: Internal server error
 *          '400':
 *              description: Bad request
 */
router.get("/reset", resetController.reset);

 
/**
 * @swagger
 * /users/getUsers:
 *   get:
 *     description: Get all users
 *     tags:
 *         - users
 *     responses:
 *       '200':
 *         description: Resource accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: The username.
 *                         example: april
 *                       real_name:
 *                         type: string
 *                         description: user real name
 *                         example: April Sauer
 *                       blab_name:
 *                         type: string
 *                         description: The user blab name.
 *                         example: April
 *                       created_at:
 *                         type: string
 *                         description: the datetime user was created.
 *                         example: 2024-08-05T19:58:03.000Z
 * 
 *       '500':
 *           description: Internal server error
 *       '400':
 *           description: Bad request
*/
router.get("/getUsers", checkUser, usersController.getUsers);


/**
 *  @swagger
 *  /users/getUser:
 *    get:
 *      description: Get get specified user
 *      tags:
 *          - users
 *      responses:
 *        '200':
 *            description: Resource accessed successfully
 *        '500':
 *            description: Internal server error
 *        '400':
 *            description: Bad request
*/ 
router.get("/getUser", checkUser, usersController.getUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: login a user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username
 *                 example: brian
 *               password:
 *                 type: string
 *                 description: new password
 *                 example: brian
 *               
 *     responses:
 *       '200':
 *           description: Database changed successfully
 *       '500':
 *           description: Internal server error
 *       '400':
 *           description: Bad request
*/
router.post("/login", usersController.userLogin);


module.exports = router;