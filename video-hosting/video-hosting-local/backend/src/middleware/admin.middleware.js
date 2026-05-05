function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Доступ дозволено тільки адміністратору' });
  }

  next();
}

module.exports = adminOnly;
