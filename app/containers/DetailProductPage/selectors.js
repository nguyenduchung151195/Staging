import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the detailProductPage state domain
 */

const selectDetailProductPageDomain = state => state.get('detailProductPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DetailProductPage
 */

const makeSelectDetailProductPage = () => createSelector(selectDetailProductPageDomain, substate => substate.toJS());

export default makeSelectDetailProductPage;
export { selectDetailProductPageDomain };
