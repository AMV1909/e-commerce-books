// Check if the user is admin with the decoded jsonwebtokenI
export const checkAdmin = (req, res, next) => {
    if (req.decoded.admin) next();
    else res.status(403).json({ message: "Unauthorized" });
};
