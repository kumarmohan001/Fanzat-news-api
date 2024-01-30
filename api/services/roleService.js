module.exports.superAdmin = async (req, res, next) => {
  try {
      if (req.info.role === 'superAdmin') {
          return next();
      }
      res.status(401).json({ success: false, message: "Invalid Request" });
  } catch (error) {
      console.error("Error in superAdmin middleware:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.admin = async (req, res, next) => {
  try {
      if (req.info.role === 'superAdmin' || req.info.role === 'admin') {
          return next();
      }
      res.status(401).json({ success: false, message: "Invalid Request" });
  } catch (error) {
      console.error("Error in admin middleware:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports.editor = async (req, res, next) => {
  try {
    if (req.info.role === 'editor' || req.info.role === 'user') {
      return next();
    } else {
      res.status(401).send({ success: false, message: 'Invalid Request' });
    }
  } catch (error) {
    console.error('Error in editor middleware:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



