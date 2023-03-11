import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the billsPage state domain
 */

const selectBillsPageDomain = state => state.get('billsPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by BillsPage
 */

const makeSelectBillsPage = () => createSelector(selectBillsPageDomain, substate => substate.toJS());

export default makeSelectBillsPage;
export { selectBillsPageDomain };
