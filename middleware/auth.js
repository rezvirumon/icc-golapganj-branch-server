const requireAdmin = async (req, res, next) => {
    try {
       const email = req.params.email || req.query.email || req.body.email;
       if (!email) {
          return res.status(400).send('Email is required');
       }
 
       const user = await User.findOne({ email });
       if (!user || user.role !== 'Admin') {
          return res.status(403).send('Access denied');
       }
 
       next();
    } catch (error) {
       console.error('Authorization error:', error.message);
       res.status(500).send('Server error');
    }
 };
 
 module.exports = requireAdmin;
 