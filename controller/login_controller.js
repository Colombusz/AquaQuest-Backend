


export const login = async (req, res) => {
    try {
        // const { email, password } = req.body;
        // const user = await
        // User.findOne({ email });
        // if (user && (await user.matchPassword(password))) {
        //     res.json({
        //         _id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         isAdmin: user.isAdmin,
        //         token: generateToken(user._id),
        //     });
        // } else {
        //     res.status(401);
        //     throw new Error("Invalid email or password");
        // }
        res.json({
                    message: "Connected Pare",
                });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};