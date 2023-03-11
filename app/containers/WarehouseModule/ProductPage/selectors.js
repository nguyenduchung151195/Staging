import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the productPage state domain
 */

const selectProductPageDomain = state => state.get('productPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProductPage
 */

const makeSelectProductPage = () => createSelector(selectProductPageDomain, substate => substate.toJS());

export default makeSelectProductPage;
export { selectProductPageDomain };
