import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectOverTimeManagerDomain = state => state.get('overTimeManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WagesManagement
 */

const makeSelectOverTimeManager = () => createSelector(selectOverTimeManagerDomain, substate => substate.toJS());
export default makeSelectOverTimeManager;
export { selectOverTimeManagerDomain };
