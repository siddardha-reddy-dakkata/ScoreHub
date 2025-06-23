const mongoose = require("mongoose");

const cricketScoreSchema = new mongoose.Schema({
  sport: { type: String, default: "Cricket" },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  lastUpdated: { type: Date, default: Date.now },
  currentInnings: { type: Number, required: true },
  totalInnings: { type: Number, default: 2 },

  tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  tossDecision: { type: String, enum: ["bat", "field"] },

  innings: [
    {
      inningsNumber: { type: Number, required: true },
      battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      overs: { type: Number, default: 0 }, // integer only
      extras: {
        wides: { type: Number, default: 0 },
        noBalls: { type: Number, default: 0 },
        byes: { type: Number, default: 0 },
        legByes: { type: Number, default: 0 }
      }
    }
  ],

  currentState: {
    battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    batsmen: [
      {
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
        name: String,
        runs: { type: Number, default: 0 },
        balls: { type: Number, default: 0 },
        fours: { type: Number, default: 0 },
        sixes: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0.0 },
        isOnStrike: { type: Boolean, default: false }
      }
    ],
    bowler: {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      name: String,
      overs: { type: Number, default: 0 },
      maidens: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      economy: { type: Number, default: 0.0 }
    },
    requiredRunRate: Number,
    requiredRuns: Number,
    currentRunRate: Number
  },

  playerPerformances: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      batting: {
        runs: Number,
        balls: Number,
        fours: Number,
        sixes: Number,
        dismissal: String
      },
      bowling: {
        overs: Number,
        maidens: Number,
        runs: Number,
        wickets: Number
      },
      fielding: {
        catches: Number,
        runouts: Number,
        stumpings: Number
      }
    }
  ],

  // ✅ Add this for ball-by-ball tracking
  ballByBall: [
    {
      over: Number,
      ballInOver: Number,
      batsman: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      bowler: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      runs: Number,
      isExtra: Boolean,
      extraType: { type: String, enum: ['wide', 'noBall', 'bye', 'legBye'], default: null },
      isWicket: Boolean,
      wicketType: { type: String, enum: ['bowled', 'caught', 'lbw', 'runout', 'stumped', 'hitWicket'], default: null },
      dismissedPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      fielder: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      commentary: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("CricketScore", cricketScoreSchema);

// const cricketScoreSchema = new mongoose.Schema({
//     sport: { type: String, default: "Cricket" },
//     matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
//     lastUpdated: { type: Date, required: true, default: Date.now },
//     currentInnings: { type: Number, required: true },
//     totalInnings: { type: Number, default: 2 },

//     tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
//     tossDecision: { type: String, enum: ["bat", "field"] },

//     innings: [
//         {
//             inningsNumber: { type: Number, required: true },
//             battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
//             runs: { type: Number, default: 0 },
//             wickets: { type: Number, default: 0 },
//             overs: { type: Number, default: 0 },
//             ballsFaced: { type: Number, default: 0 },
//             extras: {
//                 wides: { type: Number, default: 0 },
//                 noBalls: { type: Number, default: 0 },
//                 byes: { type: Number, default: 0 },
//                 legByes: { type: Number, default: 0 }
//             }
//         }
//     ],

//     currentState: {
//         battingTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
//         bowlingTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
//         batsmen: [
//             {
//                 playerId: { type: mongoose.Schema.Types.ObjectId },
//                 name: String,
//                 runs: { type: Number, default: 0 },
//                 balls: { type: Number, default: 0 },
//                 fours: { type: Number, default: 0 },
//                 sixes: { type: Number, default: 0 },
//                 strikeRate: { type: Number, default: 0.0 },
//                 isOnStrike: { type: Boolean, default: false }
//             }
//         ],
//         bowler: {
//             playerId: { type: mongoose.Schema.Types.ObjectId },
//             name: String,
//             overs: { type: Number, default: 0 },
//             maidens: { type: Number, default: 0 },
//             runs: { type: Number, default: 0 },
//             wickets: { type: Number, default: 0 },
//             economy: { type: Number, default: 0.0 },
//         },
//         requiredRunRate: { type: Number, default: 0 },
//         requiredRuns: { type: Number, default: 0 },
//         currentRunRate: { type: Number, default: 0 }
//     },

//     // Current over details
//     currentOver: {
//         overNumber: { type: Number, default: 0 },
//         ballsInOver: { type: Number, default: 0 },
//         bowler: { type: mongoose.Schema.Types.ObjectId },
//         balls: [String] // ["1", "4", "W", "0", "6", "2"]
//     },

//     // Ball by ball tracking
//     ballByBall: [{
//         over: Number,
//         ball: Number,
//         batsman: { type: mongoose.Schema.Types.ObjectId },
//         bowler: { type: mongoose.Schema.Types.ObjectId },
//         runs: { type: Number, default: 0 },
//         extras: {
//             type: { type: String, enum: ['wide', 'noBall', 'bye', 'legBye'] },
//             runs: Number
//         },
//         wicket: {
//             type: { type: String, enum: ['bowled', 'caught', 'lbw', 'runout', 'stumped', 'hitWicket'] },
//             dismissedPlayer: { type: mongoose.Schema.Types.ObjectId },
//             fielder: { type: mongoose.Schema.Types.ObjectId }
//         },
//         commentary: String,
//         timestamp: { type: Date, default: Date.now }
//     }],

//     playerPerformances: [
//         {
//             playerId: { type: mongoose.Schema.Types.ObjectId },
//             name: String,
//             batting: {
//                 runs: { type: Number, default: 0 },
//                 balls: { type: Number, default: 0 },
//                 fours: { type: Number, default: 0 },
//                 sixes: { type: Number, default: 0 },
//                 strikeRate: { type: Number, default: 0 },
//                 dismissal: String,
//                 dismissalOver: Number
//             },
//             bowling: {
//                 overs: { type: Number, default: 0 },
//                 maidens: { type: Number, default: 0 },
//                 runs: { type: Number, default: 0 },
//                 wickets: { type: Number, default: 0 },
//                 economy: { type: Number, default: 0 }
//             },
//             fielding: {
//                 catches: { type: Number, default: 0 },
//                 runouts: { type: Number, default: 0 },
//                 stumpings: { type: Number, default: 0 }
//             }
//         }
//     ],
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model("CricketScore", cricketScoreSchema);