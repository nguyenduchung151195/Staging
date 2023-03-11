import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the importProduct state domain
 */

const selectImportProductDomain = state => state.get('importProduct', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ImportProduct
 */

const makeSelectImportProduct = () => createSelector(selectImportProductDomain, substate => substate.toJS());

export default makeSelectImportProduct;
export { selectImportProductDomain };
