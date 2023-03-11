import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the supplierDetail state domain
 */

const selectSupplierDetailDomain = state => state.get('supplierDetail', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SupplierDetail
 */

const makeSelectSupplierDetail = () => createSelector(selectSupplierDetailDomain, substate => substate.toJS());

export default makeSelectSupplierDetail;
export { selectSupplierDetailDomain };
