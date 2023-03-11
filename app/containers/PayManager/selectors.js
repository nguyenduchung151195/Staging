import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the payManager state domain
 */

const selectPayManagerDomain = state => state.get('payManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PayManager
 */

const makeSelectPayManager = () => createSelector(selectPayManagerDomain, substate => substate.toJS());

export default makeSelectPayManager;
export { selectPayManagerDomain };
