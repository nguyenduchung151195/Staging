import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editProductPage state domain
 */

const selectEditProductPageDomain = state => state.get('editProductPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditProductPage
 */

const makeSelectEditProductPage = () => createSelector(selectEditProductPageDomain, substate => substate.toJS());

export default makeSelectEditProductPage;
export { selectEditProductPageDomain };
