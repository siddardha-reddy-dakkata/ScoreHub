// utils/scoringUtils.js

// Calculate strike rate
const calculateStrikeRate = (runs, balls) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(2) : 0;
};

// Calculate economy rate
const calculateEconomy = (runs, overs) => {
    return overs > 0 ? (runs / overs).toFixed(2) : 0;
};

// Calculate required run rate
const calculateRequiredRunRate = (target, currentRuns, remainingOvers) => {
    const requiredRuns = target - currentRuns;
    return remainingOvers > 0 ? (requiredRuns / remainingOvers).toFixed(2) : 0;
};

// Calculate current run rate
const calculateCurrentRunRate = (runs, totalBalls) => {
    return totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : 0;
};

// Format overs display (e.g., 12.3)
const formatOvers = (completeOvers, ballsInCurrentOver) => {
    return `${completeOvers}.${ballsInCurrentOver}`;
};

// Validate ball input
const validateBallInput = (runs, isWide, isNoBall, isBye, isLegBye) => {
    const errors = [];
    
    if (runs < 0 || runs > 6) {
        errors.push('Runs must be between 0 and 6');
    }
    
    if ((isWide || isNoBall) && (isBye || isLegBye)) {
        errors.push('Cannot have wide/no-ball with bye/leg-bye');
    }
    
    return errors;
};

// Generate ball commentary
const generateBallCommentary = (ballData) => {
    const { runs, isWide, isNoBall, isBye, isLegBye, isWicket, wicketType } = ballData;
    
    let commentary = '';
    
    if (isWicket) {
        commentary = `WICKET! ${wicketType}`;
    } else if (isWide) {
        commentary = `Wide ball, ${runs} runs`;
    } else if (isNoBall) {
        commentary = `No ball, ${runs} runs`;
    } else if (isBye) {
        commentary = `Bye, ${runs} runs`;
    } else if (isLegBye) {
        commentary = `Leg bye, ${runs} runs`;
    } else if (runs === 6) {
        commentary = 'SIX! What a shot!';
    } else if (runs === 4) {
        commentary = 'FOUR! Beautiful boundary';
    } else if (runs === 0) {
        commentary = 'Dot ball';
    } else {
        commentary = `${runs} run${runs > 1 ? 's' : ''}`;
    }
    
    return commentary;
};

// Check if match should end
const shouldEndMatch = (score, totalOvers) => {
    const currentInnings = score.innings[score.currentInnings - 1];
    
    // All out
    if (currentInnings.wickets >= 10) {
        return { shouldEnd: true, reason: 'All out' };
    }
    
    // Overs completed
    if (currentInnings.overs >= totalOvers) {
        return { shouldEnd: true, reason: 'Overs completed' };
    }
    
    // Target achieved (2nd innings)
    if (score.currentInnings === 2) {
        const target = score.innings[0].runs + 1;
        if (currentInnings.runs >= target) {
            return { shouldEnd: true, reason: 'Target achieved' };
        }
    }
    
    return { shouldEnd: false };
};

const rotateStrike = (batsmen) => {
    return [batsmen[1], batsmen[0]];
};

module.exports = {
    calculateStrikeRate,
    calculateEconomy,
    calculateRequiredRunRate,
    calculateCurrentRunRate,
    formatOvers,
    validateBallInput,
    generateBallCommentary,
    shouldEndMatch,
    rotateStrike
};