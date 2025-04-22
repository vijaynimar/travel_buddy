// Middleware for checking the role of the user
export const AdminOnly = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).send('Access denied');
    }
    next();
    // res.sendFile(path.join(__dirname, 'employer.html'));
}
