import loader from './loader';

export default (promise) => {
  loader.start();
  return promise
    .then((e) => {
      loader.done();
      return e;
    })
    .catch((e) => {
      loader.done();
      throw e;
    });
};
