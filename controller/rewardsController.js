import Save from '../models/Save.js';

export const getRewards = async (req, res) => {
    const { id } = req.params;

    try {
        const saves = await Save.find({ user: id, claimed: false });
        res.status(200).json({ saves });

        if (saves.length === 0) {
            return res.status(200).json({ message: "Nothing To Claim" });
        }
    }
    catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const claimReward = async (req, res) => {
    const {saveId } = req.params;

    try {
        const save = await Save.findOne({ _id: saveId, claimed: false });

        if (!save) {
            return res.status(404).json({ message: "Save not found or already claimed" });
        }

        save.claimed = true;
        await save.save();

        res.status(200).json({ message: "Reward Claimed" });
    }
    catch (error) {
        console.error("Error claiming reward:", error);
        res.status(500).json({ message: "Server error" });
    }
}

