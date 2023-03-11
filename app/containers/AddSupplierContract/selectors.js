import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the AddSupplierContract state domain
 */

const selectAddSupplierContractDomain = state => state.get('addSupplierContract', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSupplierContract
 */

const makeSelectAddSupplierContract = () => createSelector(selectAddSupplierContractDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectAddSupplierContractDomain, substate => substate.get(listName));

export default makeSelectAddSupplierContract;
export { selectAddSupplierContractDomain, makeSelectBody };
