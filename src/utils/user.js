export const getUserName = ({ firstName, accountName } = {}) => firstName || accountName || null;
export const userIsOwner = (user, owner) => user && owner && +user.id === +owner.id;
