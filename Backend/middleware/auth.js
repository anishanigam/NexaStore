import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    let token = req.headers.token || req.headers.authorization;

    // No token found
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    // Handle "Bearer <token>" format
    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove "Bearer " prefix
    }

    try {
        // Verify token using JWT_SECRET from environment
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log("Decoded Token:", token_decoded);
        // Attach decoded user ID to request object
        req.userId = token_decoded._id; // Assumes you're signing with { id: user._id }

        next(); // Proceed to the next middleware or route
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
























// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//     const token = req.headers.token || req.headers.authorization;

//     if(!token) {
//         return res.status(401).json({ success:false  ,message: 'Not Authorized Login Again'})
//     }

//     try {
        
//         const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = token_decoded.id;
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(401)({success:false , message : error.message})
//     }

// }

// export default authUser;