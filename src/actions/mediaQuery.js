import { throttle } from 'lodash';
import { actions as baseActions } from '../store/mediaQuery';

export default class {
  static init() {
    return (dispatch) => {
      if (typeof window === 'undefined') {
        return;
      }

      const calc = throttle(() => {
        dispatch(baseActions.merge({
          hover: !window.matchMedia('(hover: none)').matches,
          medium: window.matchMedia('(max-width: 1023px)').matches,
          small: window.matchMedia('(max-width: 767px)').matches,
          xsmall: window.matchMedia('(max-width: 374px)').matches,
        }));
      }, 200);

      window.addEventListener('resize', calc);

      calc();
    };
  }
}
