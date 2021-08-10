module.exports = (req, res, next) => {
    if (req.session.userid) {
      next();
    } else {
      res.redirect("/admin");
    }
  };