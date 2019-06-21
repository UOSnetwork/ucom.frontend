import { memoize } from 'lodash';
import moment from 'moment';

export default memoize(date => moment(date).fromNow());
