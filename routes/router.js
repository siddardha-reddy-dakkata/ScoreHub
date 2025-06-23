const express = require('express');
const router = express.Router();

const app = express();



const otpController = require("../controllers/otpController");
const userController = require("../controllers/userController");

router.post('/send-otp', otpController.createAccountOtp);
router.post("/create-user", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/update-password", userController.updatePassword);


const teamController = require('../controllers/teamControllers/createTeam');
router.post("/create-team", teamController.createTeam);
router.post("/add-guest-players", teamController.addGuestPlayers);
router.post("/add-player", teamController.addPlayer);
router.get("/get-team-details/:teamId", teamController.getTeamPlayers);


const matchController = require("../controllers/matchController/creatematch");
router.post("/create-instant-match", matchController.createInstantMatch);
router.delete("/delete-instant-match/:matchId", matchController.deteleInstantMatch);
router.post("/like-match/:matchId", matchController.likeMatch);



const cricketController = require('../controllers/cricketControllers');
router.post("/start-cricket-match/:matchId", cricketController.startMatch);
router.post("/set-cricket-opening/:matchId", cricketController.setOpeningPlayers);
router.post("/update-ball/:matchId", cricketController.updateBall);
router.post("/replace-batsman/:matchId", cricketController.replaceBatsman);

// router.post("/ball-by-ball", cricketController.ballByBall);


module.exports = router;