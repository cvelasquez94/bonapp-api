exports.ADMIN = 'admin';
exports.SUPERADMIN = 'superadmin';
exports.USER = 'user';
exports.roles = [exports.ADMIN, exports.USER, exports.SUPERADMIN];

exports.OK = 'ok';
exports.PENDING = 'pending';
exports.status = [exports.OK, exports.PENDING];

exports.invalidationTimeInMinutes = 1000;

exports.statusUser = Object.freeze({
  BAJA: 100,
  ACTIVO: 101,
  NUEVO: 102,
  BLOQUEADO: 103,
});
