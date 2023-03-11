import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the cashManager state domain
 */

const selectCashManagerDomain = state => state.get('cashManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CashManager
 */

const makeSelectCashManager = () => createSelector(selectCashManagerDomain, substate => substate.toJS());

export default makeSelectCashManager;
export { selectCashManagerDomain };
