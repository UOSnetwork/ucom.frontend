export default (createdAt, leftMinutes) => {
  if (!createdAt) {
    return false;
  }

  return (new Date()).getTime() - (new Date(createdAt)).getTime() < leftMinutes;
};
