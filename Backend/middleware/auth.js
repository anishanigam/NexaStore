import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization;

    if(!token) {
        return res.status(401).json({ success:false  ,message: 'Not Authorized Login Again'})
    }

    try {
        
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401)({success:false , message : error.message})
    }

}

export default authUser;