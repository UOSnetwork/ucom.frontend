export default (name, keys) => props => keys.reduce((result, key) => `${result}.${props[key]}`, name);
