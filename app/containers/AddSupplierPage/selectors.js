import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSupplierPage state domain
 */

const selectAddSupplierPageDomain = state => state.get('addSupplierPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSupplierPage
 */

const makeSelectAddSupplierPage = () => createSelector(selectAddSupplierPageDomain, substate => substate.toJS());

export default makeSelectAddSupplierPage;
export { selectAddSupplierPageDomain };
