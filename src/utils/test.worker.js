import registerPromiseWorker from 'promise-worker/register';
import { getSocialPrivateKeyByActiveKey } from './keys';

registerPromiseWorker((message) => {
  return getSocialPrivateKeyByActiveKey('pong', 'asd');
});
