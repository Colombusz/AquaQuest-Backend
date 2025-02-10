import {AIrequest} from '../config/ai.js';

export const getAIresponse = async (req, res) => {
    try {
        const { userprompt } = req.body;
        const response = await AIrequest(userprompt);
        res.json({
            message: response,
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
