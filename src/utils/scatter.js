import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

export default class {
  static Connect() {
    const network = {
      blockchain: 'eos',
      protocol: 'https',
      host: 'staging-mini-mongo.u.community',
      port: 6888,
      chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    };

    ScatterJS.plugins(new ScatterEOS());

    ScatterJS.scatter.connect('U.Community')
      .then((connected) => {
        if (!connected) {
          return;
        }

        const { scatter } = ScatterJS;
        const requiredFields = { accounts: [network] };

        scatter.getIdentity(requiredFields)
          .then(() => {
            console.log(scatter.identity);
          });
      })
      .catch(() => {
        console.log('error');
      });
  }
}
