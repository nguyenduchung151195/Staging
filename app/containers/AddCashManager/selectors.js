import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addCashManager state domain
 */

const selectAddCashManagerDomain = state => state.get('addCashManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddCashManager
 */

const makeSelectAddCashManager = () => createSelector(selectAddCashManagerDomain, substate => substate.toJS());

export default makeSelectAddCashManager;
export { selectAddCashManagerDomain };
