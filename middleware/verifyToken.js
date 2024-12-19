import jwt from 'jsonwebtoken'

export const JWT_KEY = "alumniItech"

export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    // console.log(req.headers['authorization'])
    try {
        if(!token) {
            return res.status(403).json({message: "No Token Provided"})
        }
        const decoded = jwt.verify(token, JWT_KEY)
        req.userId = decoded.id;
        next();
    }  catch(err) {
        return res.status(500).json({message: "server error"})
    }
}