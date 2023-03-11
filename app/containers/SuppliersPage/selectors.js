import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the suppliersPage state domain
 */

const selectSuppliersPageDomain = state => state.get('suppliersPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SuppliersPage
 */

const makeSelectSuppliersPage = () => createSelector(selectSuppliersPageDomain, substate => substate.toJS());

export default makeSelectSuppliersPage;
export { selectSuppliersPageDomain };
