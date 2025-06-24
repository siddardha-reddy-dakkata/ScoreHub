const CricketScore = require('../models/scorecards/cricketScoreSchema')
const Match = require('../models/matchSchema');
const Team = require('../models/teamSchema');

const startMatch = async (req, res) => {
    const { matchId } = req.params;
    const { tossWinner, tossDecision } = req.body;

    try {
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).send({ message: "Match not found" });

        const teamAId = match.teamA;
        const teamBId = match.teamB;

        console.log(tossWinner, tossDecision, matchId, teamAId, teamBId);

        let battingTeam = tossDecision === 'bat' ? tossWinner : (tossWinner.toString() === teamAId.toString() ? teamBId : teamAId);

        const scoreRecord = new CricketScore({
            matchId,
            tossWinner,
            tossDecision,
            currentInnings: 1,
            totalInnings: 2,
            currentState: {
                battingTeam,
                batsmen: [],
                bowler: {}
            }
        });

        await scoreRecord.save();

        return res.status(200).send({ message: "Match started", cricketScoreId: scoreRecord._id });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// const setOpeningPlayers = async (req, res) => {
//   const { matchId } = req.params;
//   const { striker, nonStriker, bowler } = req.body;

//   if (!striker || !nonStriker || !bowler) {
//     return res.status(400).send({ message: "All players must be provided" });
//   }

//   try {
//     const matchScore = await CricketScore.findOne({ matchId });
//     if (!matchScore) return res.status(404).send({ message: "Scorecard not found" });

//     matchScore.currentState.batsmen = [
//       { ...striker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
//       { ...nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 }
//     ];

//     matchScore.currentState.bowler = {
//       ...bowler,
//       playerId: bowler,
//       overs: 0,
//       maidens: 0,
//       runs: 0,
//       wickets: 0,
//       economy: 0
//     };

//     matchScore.lastUpdated = new Date();
//     await matchScore.save();

//     return res.status(200).send({ message: "Opening players set", currentState: matchScore.currentState });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Internal server error", error: err.message });
//   }
// };

const setOpeningPlayers = async (req, res) => {
    const { matchId } = req.params;
    const { strikerId, nonStrikerId, bowlerId } = req.body;

    if (!strikerId || !nonStrikerId || !bowlerId) {
        return res.status(400).send({ message: "Striker, non-striker, and bowler IDs are required" });
    }

    try {
        const matchScore = await CricketScore.findOne({ matchId });
        if (!matchScore) return res.status(404).send({ message: "Scorecard not found" });

        matchScore.currentState.batsmen = [
            {
                playerId: strikerId,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                strikeRate: 0,
                isOnStrike: true
            },
            {
                playerId: nonStrikerId,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                strikeRate: 0,
                isOnStrike: false
            }
        ];

        matchScore.currentState.bowler = {
            playerId: bowlerId,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0
        };

        matchScore.lastUpdated = new Date();
        await matchScore.save();

        return res.status(200).send({
            message: "Opening players set",
            currentState: matchScore.currentState
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error", error: err.message });
    }
};

function getOrCreatePlayerPerformance(scoreDoc, playerId) {
    let player = scoreDoc.playerPerformances.find(p => p.playerId.toString() === playerId.toString());
    if (!player) {
        player = {
            playerId,
            batting: { runs: 0, balls: 0, fours: 0, sixes: 0 },
            bowling: { overs: 0, maidens: 0, runs: 0, wickets: 0 },
            fielding: { catches: 0, runouts: 0, stumpings: 0 }
        };
        scoreDoc.playerPerformances.push(player);
    }
    return player;
}




const updateBall = async (req, res) => {
    const { matchId } = req.params;
    const {
        runs = 0,
        isExtra = false,
        extraType = null,
        isWicket = false,
        wicketType = null,
        dismissedPlayer = null,
        fielder = null,
        commentary = ""
    } = req.body;

    try {
        const matchScore = await CricketScore.findOne({ matchId });
        if (!matchScore) return res.status(404).send({ message: "Match not found" });

        const state = matchScore.currentState;
        const batsmen = state.batsmen;
        const striker = batsmen.find(b => b.isOnStrike);
        const nonStriker = batsmen.find(b => !b.isOnStrike);
        const bowler = state.bowler;

        const overNumber = Math.floor(bowler.overs);
        let ballInOver = Math.round((bowler.overs % 1) * 10);

        // Should this ball count?
        const countBall = !isExtra || (extraType !== 'wide' && extraType !== 'noBall');
        if (countBall) {
            ballInOver += 1;
            if (ballInOver === 6) {
                state.bowler.overs = overNumber + 1;
                ballInOver = 0;
                // Rotate strike
                striker.isOnStrike = false;
                nonStriker.isOnStrike = true;
            } else {
                state.bowler.overs = overNumber + (ballInOver / 10);
            }
        }

        const isBatsmanScoring = !isExtra || (extraType === 'noBall');
        if (isBatsmanScoring) {
            striker.runs += runs;
            striker.balls += countBall ? 1 : 0;
            if (runs === 4) striker.fours += 1;
            if (runs === 6) striker.sixes += 1;
            striker.strikeRate = parseFloat(((striker.runs / striker.balls) * 100).toFixed(2));
        }

        if (isExtra && (extraType === 'wide' || extraType === 'noBall')) {
            bowler.runs += runs + 1;
        } else {
            bowler.runs += runs;
        }
        if (countBall) bowler.balls = (bowler.balls || 0) + 1;
        bowler.economy = parseFloat((bowler.runs / (bowler.overs || 1)).toFixed(2));

        // 🔁 innings object
        let innings = matchScore.innings.find(i => i.inningsNumber === matchScore.currentInnings);
        if (!innings) {
            innings = {
                inningsNumber: matchScore.currentInnings,
                battingTeam: state.battingTeam,
                runs: 0,
                wickets: 0,
                overs: 0,
                extras: {
                    wides: 0,
                    noBalls: 0,
                    byes: 0,
                    legByes: 0
                }
            };
            matchScore.innings.push(innings);
        }

        innings.runs += isExtra ? (runs + 1) : runs;
        if (isExtra && innings.extras[extraType] !== undefined) {
            innings.extras[extraType] += runs;
        }

        // ⚰️ Handle wicket
        if (isWicket) {
            innings.wickets += 1;
            matchScore.currentState.batsmen = batsmen.filter(b => b.playerId.toString() !== dismissedPlayer);
        }

        // 🎯 Player Performances
        const updateOrInitPerformance = (playerId) => {
            let perf = matchScore.playerPerformances.find(p => p.playerId.toString() === playerId.toString());
            if (!perf) {
                perf = {
                    playerId,
                    batting: { runs: 0, balls: 0, fours: 0, sixes: 0 },
                    bowling: { overs: 0, maidens: 0, runs: 0, wickets: 0 },
                    fielding: { catches: 0, runouts: 0, stumpings: 0 }
                };
                matchScore.playerPerformances.push(perf);
            }
            return perf;
        };

        const strikerPerformance = getOrCreatePlayerPerformance(matchScore, striker.playerId);
        if (isBatsmanScoring) {
            strikerPerformance.batting.runs += runs;
            strikerPerformance.batting.balls += countBall ? 1 : 0;
            if (runs === 4) strikerPerformance.batting.fours += 1;
            if (runs === 6) strikerPerformance.batting.sixes += 1;
        }


        const bowlerPerformance = getOrCreatePlayerPerformance(matchScore, bowler.playerId);
        bowlerPerformance.bowling.runs += isExtra && (extraType === 'wide' || extraType === 'noBall') ? (runs + 1) : runs;
        if (countBall) {
            const prevOvers = bowlerPerformance.bowling.overs;
            const totalBalls = Math.floor(prevOvers) * 6 + Math.round((prevOvers % 1) * 10) + 1;
            bowlerPerformance.bowling.overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
        }
        if (isWicket) {
            bowlerPerformance.bowling.wickets += 1;
        }


        if (fielder) {
            const fielderPerf = getOrCreatePlayerPerformance(matchScore, fielder);
            if (wicketType === 'caught') fielderPerf.fielding.catches += 1;
            else if (wicketType === 'runout') fielderPerf.fielding.runouts += 1;
            else if (wicketType === 'stumped') fielderPerf.fielding.stumpings += 1;
        }


        // Dismissal info
        if (isWicket && dismissedPlayer) {
            const dismissedPerf = updateOrInitPerformance(dismissedPlayer);
            dismissedPerf.batting.dismissal = wicketType;
        }

        // 📋 Add ball to ball-by-ball log
        if (!matchScore.ballByBall) {
            matchScore.ballByBall = [];
        }
        matchScore.ballByBall.push({
            over: overNumber,
            ballInOver,
            batsman: striker.playerId,
            bowler: bowler.playerId,
            runs,
            isExtra,
            extraType,
            isWicket,
            wicketType,
            dismissedPlayer,
            fielder,
            commentary
        });

        matchScore.lastUpdated = new Date();
        await matchScore.save();

        return res.status(200).send({
            message: "Ball updated",
            ballInOver,
            striker,
            nonStriker,
            bowler,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};




const replaceBatsman = async (req, res) => {
    const { matchId } = req.params;
    const { newBatsmanId, isOnStrike } = req.body;

    if (!newBatsmanId || typeof isOnStrike !== "boolean") {
        return res.status(400).send({ message: "Missing newBatsmanId or isOnStrike flag" });
    }

    try {
        const matchScore = await CricketScore.findOne({ matchId });
        if (!matchScore) return res.status(404).send({ message: "Match not found" });

        const batsmen = matchScore.currentState.batsmen;

        if (batsmen.length >= 2) {
            return res.status(400).send({ message: "Both batsmen slots are already filled" });
        }

        batsmen.push({
            playerId: newBatsmanId,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOnStrike
        });

        matchScore.lastUpdated = new Date();
        await matchScore.save();

        return res.status(200).send({
            message: "New batsman added",
            currentBatsmen: matchScore.currentState.batsmen
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};



module.exports = {
    startMatch,
    setOpeningPlayers,
    updateBall,
    replaceBatsman
}
