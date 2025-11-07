const User = require('./User');

const Drop = require('./Drop');
const Waitlist = require('./WaitList');
const Claim = require('./Claim');
  // Associations
  User.hasMany(Waitlist, { foreignKey: 'user_id' });
  Waitlist.belongsTo(User, { foreignKey: 'user_id' });

  Drop.hasMany(Waitlist, { foreignKey: 'drop_id' });
  Waitlist.belongsTo(Drop, { foreignKey: 'drop_id' });

  User.hasMany(Claim, { foreignKey: 'user_id' });
  Claim.belongsTo(User, { foreignKey: 'user_id' });

  Drop.hasMany(Claim, { foreignKey: 'drop_id' });
  Claim.belongsTo(Drop, { foreignKey: 'drop_id' });

  module.exports = {
    User,
    Drop,
    Waitlist,
    Claim,
  };