exports.ADMIN = 'admin';
exports.SUPERADMIN = 'superadmin';
exports.USER = 'user';
exports.roles = [exports.ADMIN, exports.USER, exports.SUPERADMIN];

exports.OK = 'ok';
exports.PENDING = 'pending';
exports.status = [exports.OK, exports.PENDING];

exports.statusUser = Object.freeze({
  BAJA: 100,
  ACTIVO: 101,
  NUEVO: 102,
  BLOQUEADO: 103,
});
exports.statusNotification = Object.freeze({
  SENT: 400,
});
