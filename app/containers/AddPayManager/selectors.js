import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPayManager state domain
 */

const selectAddPayManagerDomain = state => state.get('addPayManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPayManager
 */

const makeSelectAddPayManager = () => createSelector(selectAddPayManagerDomain, substate => substate.toJS());

export default makeSelectAddPayManager;
export { selectAddPayManagerDomain };
