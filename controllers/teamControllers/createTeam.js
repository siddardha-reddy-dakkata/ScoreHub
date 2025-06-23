const playerSchema = require('../../models/playerSchema');
const Team = require('../../models/teamSchema');
const userSchema = require('../../models/userSchema');


const createTeam = async (req, res) => {
    const data = req.body;
    try {
        const newTeam = Team(data);
        await newTeam.save();

        res.status(200).send({ message: "Successfully created team" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Internal server error" });
    }
}

const addGuestPlayers = async (req, res) => {
    const { teamId, players } = req.body;
    try {
        const newPlayers = players.map(player => ({
            playerType: 'Guest',
            name: player
        }));

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { $push: { players: { $each: newPlayers } } },
        );

        if (!updatedTeam) return res.status(404).send({ message: "Team not found" });
        res.status(200).send({ message: "Player updated" });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Internal server error" });
    }
}

const addPlayer = async (req, res) => {
    const { teamId, userId } = req.body;
    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).send({ message: "Team not found" });

        const alreadyExists = team.players.some(
            player => player.playerType === "User" && player.userId?.toString() == userId
        );

        if (alreadyExists) {
            return res.status(409).send({ message: "Player already in team" });
        }

        const user = await userSchema.findById(userId);
        if (!user) return res.status(404).send({message: "User not found"});

        const newPlayer = {
            playerType: "User",
            userId: userId,
            name : user.fullname,
            username: user.username,
        };

        team.players.push(newPlayer);
        await team.save();
        res.status(200).send({ message: "Player updated" });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Internal server error" });
    }
}

const getTeamPlayers = async (req, res) => {
    const { teamId } = req.params;

    try {
        if (!teamId) return res.status(400).send({ message: "TeamId needed" });

        let teamDetails = await Team.findById(teamId);
        if (!teamDetails) return res.status(404).send({ message: "Team not found" });

        const updatedPlayers = await Promise.all(
            teamDetails.players.map(async (player) => {
                if (player.playerType === "User") {
                    const user = await userSchema.findById(player.userId).select("username fullName profilePicture");
                    if (user) {
                        return {
                            playerType: "User",
                            userId: player.userId,
                            username: user.username,
                            name: user.fullName ? user.fullName : user.username,
                            profilePicture: user.profilePicture ? user.profilePicture : "",
                        };
                    } else {
                        return { playerType: "User", userId: player.userId };
                    }
                } else {
                    return player;
                }
            })
        );

        res.status(200).send({
            teamDetails: {
                ...teamDetails.toObject(),
                players: updatedPlayers
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Internal server error", error: e.message });
    }
};

module.exports = {
    createTeam,
    addGuestPlayers,
    addPlayer,
    getTeamPlayers
}