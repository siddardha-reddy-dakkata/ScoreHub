// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Team = require('../../models/teamSchema');
const Match = require('../../models/matchSchema');
const matchSchema = require('../../models/matchSchema');


const createInstantMatch = async (req, res) => {
    const { sport } = req.body;
    try {
        const teamA = new Team({
            name: "Team A",
            shortName: "A",
            logo: "",
            sportType: "Cricket",
            players: [],
        });

        const teamB = new Team({
            name: "Team B",
            shortName: "B",
            logo: "",
            sportType: "Cricket",
            players: [],
        });

        await teamA.save();
        await teamB.save();

        const newMatch = new matchSchema({
            teamA: teamA,
            teamB: teamB,
            type: "Instant",
            sport: sport
        })

        await newMatch.save();
        res.status(200).json({
            message: "Teams created",
            teamAId: teamA._id,
            teamBId: teamB._id,
            matchId: newMatch._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating teams", error: err });
    }
};




const deteleInstantMatch = async (req, res) => {
    const { matchId } = req.params;

    if (!matchId) return res.status(400).send({ message: "MatchId is required" });

    try {
        const matchRecord = await matchSchema.findById(matchId);
        if (!matchRecord) return res.status(200).send({ message: "Match not found" });

        await Team.findByIdAndDelete(matchRecord.teamA);
        await Team.findByIdAndDelete(matchRecord.teamB);


        await matchSchema.findByIdAndDelete(matchId);



        res.status(200).send({
            message: "Match deleted successfully",
            match: matchRecord
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Internal server error" });
    }
}


const likeMatch = async (req, res) => {
    const { matchId } = req.params;
    try {
        const match = await matchSchema.findById(matchId);
        if (!match) return res.status(404).send({ message: "Match not found" });

        match.likes = (match.likes || 0) + 1;
        await match.save();

        res.status(200).send({ message: "Liked successfully", match });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal server error" });
    }
};




// GPT code (not including these at all)

// const initializeMatchScoring = async (req, res) => {
//     const { matchId } = req.params;
//     const { tossWinner, tossDecision, overs, battingFirst } = req.body;

//     try {
//         const match = await Match.findById(matchId).populate('teamA teamB');
//         if (!match) return res.status(404).json({ message: 'Match not found' });

//         // Check if scoring already initialized
//         const existingScore = await CricketScore.findOne({ matchId });
//         if (existingScore) {
//             return res.status(400).json({ message: 'Match scoring already initialized' });
//         }

//         const cricketScore = new CricketScore({
//             matchId,
//             currentInnings: 1,
//             totalInnings: 2,
//             tossWinner,
//             tossDecision,
//             innings: [{
//                 inningsNumber: 1,
//                 battingTeam: battingFirst,
//                 runs: 0,
//                 wickets: 0,
//                 overs: 0,
//                 extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
//             }],
//             currentState: {
//                 battingTeam: battingFirst,
//                 batsmen: [],
//                 bowler: null,
//                 requiredRunRate: 0,
//                 requiredRuns: 0,
//                 currentRunRate: 0
//             },
//             currentOver: {
//                 overNumber: 0,
//                 ballsInOver: 0,
//                 bowler: null,
//                 balls: []
//             },
//             ballByBall: []
//         });

//         await cricketScore.save();
//         await Match.findByIdAndUpdate(matchId, {
//             status: 'Live',
//             overs: overs
//         });

//         res.status(200).json({
//             message: 'Match scoring initialized',
//             scoreId: cricketScore._id
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };

// // Set opening batsmen and bowler
// const setOpeningPlayers = async (req, res) => {
//     const { scoreId } = req.params;
//     const { batsman1, batsman2, bowler } = req.body;

//     try {
//         const score = await CricketScore.findById(scoreId);
//         if (!score) return res.status(404).json({ message: 'Score not found' });

//         // Set opening batsmen
//         score.currentState.batsmen = [
//             {
//                 playerId: batsman1.playerId,
//                 name: batsman1.name,
//                 runs: 0,
//                 balls: 0,
//                 fours: 0,
//                 sixes: 0,
//                 strikeRate: 0
//             },
//             {
//                 playerId: batsman2.playerId,
//                 name: batsman2.name,
//                 runs: 0,
//                 balls: 0,
//                 fours: 0,
//                 sixes: 0,
//                 strikeRate: 0
//             }
//         ];

//         // Set opening bowler
//         score.currentState.bowler = {
//             playerId: bowler.playerId,
//             name: bowler.name,
//             overs: 0,
//             maidens: 0,
//             runs: 0,
//             wickets: 0,
//             economy: 0
//         };

//         score.currentOver.bowler = bowler.playerId;
//         score.lastUpdated = new Date();

//         await score.save();
//         res.status(200).json({ message: 'Opening players set successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const updateBallScore = async (req, res) => {
//     const { scoreId } = req.params;
//     const {
//         runs,
//         isWide,
//         isNoBall,
//         isBye,
//         isLegBye,
//         isWicket,
//         wicketType,
//         dismissedPlayer,
//         newBatsman,
//         strikerIndex
//     } = req.body;

//     try {
//         const score = await CricketScore.findById(scoreId);
//         if (!score) return res.status(404).json({ message: 'Score not found' });

//         const currentInnings = score.innings[score.currentInnings - 1];
//         const ballRuns = parseInt(runs) || 0;
//         let extraRuns = 0;
//         let validBall = true;

//         // Handle extras
//         if (isWide) {
//             extraRuns = ballRuns + 1;
//             currentInnings.extras.wides += extraRuns;
//             validBall = false;
//         } else if (isNoBall) {
//             extraRuns = ballRuns + 1;
//             currentInnings.extras.noBalls += extraRuns;
//             validBall = false;
//         } else if (isBye) {
//             extraRuns = ballRuns;
//             currentInnings.extras.byes += extraRuns;
//         } else if (isLegBye) {
//             extraRuns = ballRuns;
//             currentInnings.extras.legByes += extraRuns;
//         }

//         // Update runs
//         const totalRuns = ballRuns + extraRuns;
//         currentInnings.runs += totalRuns;

//         // Update batsman stats (only for valid balls and non-bye runs)
//         if (validBall && !isBye && !isLegBye) {
//             const striker = score.currentState.batsmen[strikerIndex];
//             striker.runs += ballRuns;
//             striker.balls += 1;

//             if (ballRuns === 4) striker.fours += 1;
//             if (ballRuns === 6) striker.sixes += 1;
//             striker.strikeRate = striker.balls > 0 ? (striker.runs / striker.balls * 100).toFixed(2) : 0;
//         }

//         // Update bowler stats
//         if (validBall) {
//             score.currentState.bowler.runs += ballRuns + (isNoBall || isWide ? 1 : 0);

//             // Update over count for bowler
//             score.currentOver.ballsInOver += 1;
//             if (score.currentOver.ballsInOver === 6) {
//                 const oversFloored = Math.floor(score.currentState.bowler.overs);
//                 score.currentState.bowler.overs = oversFloored + 1;
//                 score.currentOver.overNumber += 1;
//                 score.currentOver.ballsInOver = 0;
//                 score.currentOver.balls = [];
//                 currentInnings.overs = score.currentOver.overNumber;
//             } else {
//                 score.currentState.bowler.overs = Math.floor(score.currentState.bowler.overs) + (score.currentOver.ballsInOver / 10);
//             }

//             // Calculate economy
//             const totalOvers = score.currentState.bowler.overs;
//             if (totalOvers > 0) {
//                 score.currentState.bowler.economy = (score.currentState.bowler.runs / totalOvers).toFixed(2);
//             }
//         }

//         // Handle wicket
//         if (isWicket) {
//             currentInnings.wickets += 1;
//             score.currentState.bowler.wickets += 1;

//             // Replace dismissed batsman
//             if (newBatsman) {
//                 const dismissedIndex = score.currentState.batsmen.findIndex(
//                     b => b.playerId.toString() === dismissedPlayer
//                 );

//                 if (dismissedIndex !== -1) {
//                     score.currentState.batsmen[dismissedIndex] = {
//                         playerId: newBatsman.playerId,
//                         name: newBatsman.name,
//                         runs: 0,
//                         balls: 0,
//                         fours: 0,
//                         sixes: 0,
//                         strikeRate: 0
//                     };
//                 }
//             }
//         }

//         // Add to ball-by-ball record
//         const ballRecord = {
//             over: score.currentOver.overNumber + 1,
//             ball: score.currentOver.ballsInOver,
//             batsman: score.currentState.batsmen[strikerIndex].playerId,
//             bowler: score.currentState.bowler.playerId,
//             runs: ballRuns,
//             timestamp: new Date()
//         };

//         if (isWide || isNoBall || isBye || isLegBye) {
//             ballRecord.extras = {
//                 type: isWide ? 'wide' : isNoBall ? 'noBall' : isBye ? 'bye' : 'legBye',
//                 runs: extraRuns
//             };
//         }

//         if (isWicket) {
//             ballRecord.wicket = {
//                 type: wicketType,
//                 dismissedPlayer: dismissedPlayer
//             };
//         }

//         score.ballByBall.push(ballRecord);

//         // Update current over balls display
//         let ballDisplay = ballRuns.toString();
//         if (isWide) ballDisplay = 'W' + ballRuns;
//         if (isNoBall) ballDisplay = 'N' + ballRuns;
//         if (isWicket) ballDisplay = 'W';
//         if (isBye) ballDisplay = 'B' + ballRuns;
//         if (isLegBye) ballDisplay = 'L' + ballRuns;

//         score.currentOver.balls.push(ballDisplay);

//         // Calculate required run rate for 2nd innings
//         if (score.currentInnings === 2) {
//             const target = score.innings[0].runs + 1;
//             const remainingRuns = target - currentInnings.runs;
//             const remainingOvers = (score.totalOvers * 6 - (currentInnings.overs * 6 + score.currentOver.ballsInOver)) / 6;

//             score.currentState.requiredRuns = remainingRuns;
//             score.currentState.requiredRunRate = remainingOvers > 0 ? (remainingRuns / remainingOvers).toFixed(2) : 0;
//         }

//         // Calculate current run rate
//         const totalBalls = (currentInnings.overs * 6) + score.currentOver.ballsInOver;
//         score.currentState.currentRunRate = totalBalls > 0 ? ((currentInnings.runs / totalBalls) * 6).toFixed(2) : 0;

//         score.lastUpdated = new Date();
//         await score.save();

//         res.status(200).json({
//             message: 'Score updated successfully',
//             currentScore: {
//                 runs: currentInnings.runs,
//                 wickets: currentInnings.wickets,
//                 overs: `${currentInnings.overs}.${score.currentOver.ballsInOver}`
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Get current match score
// const getCurrentScore = async (req, res) => {
//     const { matchId } = req.params;

//     try {
//         const score = await CricketScore.findOne({ matchId })
//             .populate('currentState.battingTeam')
//             .populate('tossWinner');

//         if (!score) return res.status(404).json({ message: 'Score not found' });

//         const match = await Match.findById(matchId).populate('teamA teamB');

//         res.status(200).json({
//             match: {
//                 _id: match._id,
//                 teamA: match.teamA,
//                 teamB: match.teamB,
//                 status: match.status
//             },
//             score: {
//                 currentInnings: score.currentInnings,
//                 innings: score.innings,
//                 currentState: score.currentState,
//                 currentOver: score.currentOver,
//                 tossWinner: score.tossWinner,
//                 tossDecision: score.tossDecision,
//                 lastUpdated: score.lastUpdated
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // End innings
// const endInnings = async (req, res) => {
//     const { scoreId } = req.params;

//     try {
//         const score = await CricketScore.findById(scoreId);
//         if (!score) return res.status(404).json({ message: 'Score not found' });

//         if (score.currentInnings < score.totalInnings) {
//             // Start next innings
//             score.currentInnings += 1;
//             const battingTeam = score.currentState.battingTeam.toString() === score.innings[0].battingTeam.toString()
//                 ? (await Match.findById(score.matchId).populate('teamA teamB')).teamB._id
//                 : (await Match.findById(score.matchId).populate('teamA teamB')).teamA._id;

//             score.innings.push({
//                 inningsNumber: score.currentInnings,
//                 battingTeam: battingTeam,
//                 runs: 0,
//                 wickets: 0,
//                 overs: 0,
//                 extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 }
//             });

//             // Reset current state for new innings
//             score.currentState.battingTeam = battingTeam;
//             score.currentState.batsmen = [];
//             score.currentState.bowler = null;
//             score.currentOver = {
//                 overNumber: 0,
//                 ballsInOver: 0,
//                 bowler: null,
//                 balls: []
//             };

//         } else {
//             // Match completed
//             await Match.findByIdAndUpdate(score.matchId, {
//                 status: 'Completed',
//                 endTime: new Date()
//             });
//         }

//         score.lastUpdated = new Date();
//         await score.save();

//         res.status(200).json({ message: 'Innings ended successfully' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Get ball-by-ball commentary
// const getBallByBallCommentary = async (req, res) => {
//     const { matchId } = req.params;
//     const { page = 1, limit = 20 } = req.query;

//     try {
//         const score = await CricketScore.findOne({ matchId });
//         if (!score) return res.status(404).json({ message: 'Score not found' });

//         const startIndex = (page - 1) * limit;
//         const endIndex = startIndex + parseInt(limit);

//         const ballByBall = score.ballByBall
//             .slice(-endIndex)
//             .slice(-limit)
//             .reverse();

//         res.status(200).json({
//             ballByBall,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total: score.ballByBall.length
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = {
//     initializeMatchScoring,
//     setOpeningPlayers,
//     updateBallScore,
//     getCurrentScore,
//     endInnings,
//     getBallByBallCommentary
// };













module.exports = {
    createInstantMatch,
    deteleInstantMatch,
    likeMatch,
}