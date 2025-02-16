// // Instead of using module.exports, use the ES module export syntax:
// export const sendToken = (user, res) => {
//     const token = user.getJwtToken();
//     const options = {
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//     };

//     res.cookie('token', token, options).json({
//         user,
//         success: true,
//     });
// };

// export default sendToken; 


export const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};