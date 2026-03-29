// backend/middleware/role.middleware.js

// Only admins can pass
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied - Admins only' });
};

// Users or Admins can pass (authenticated users only)
// CHANGED: renamed from memberOrAdmin to userOrAdmin to match export
const userOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied - Members only' });
};

// Export with matching names
module.exports = { adminOnly, userOrAdmin }; // ✅ Now userOrAdmin is defined