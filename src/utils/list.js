import { sortBy } from 'lodash';

export const LIST_ORDER_BY_ID = '-id';
export const LIST_ORDER_BY_RATE = '-current_rate';
export const LIST_PER_PAGE = 20;
export const LIST_ORDER_BY = LIST_ORDER_BY_RATE;

export const sortByRate = data => sortBy(data, ['currentRate']).reverse();
