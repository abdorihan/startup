import { getSession } from './data';

// middleware for doing role-based permissions
export default function permit(...allowed) {
    // return a middleware
    return (req, res, next) => {
        const session = getSession(req.headers.auth);
        for (let i = 0; i < allowed.length; i++) {
            if (!session || session.prevs.indexOf(allowed[i]) === -1) {
                res.status(403).json({ message: 'Forbidden' }); // user is forbidden
                return;
            }
        }
        next();
    };
}
