import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the TakeLeaveManagemen state domain
 */

const selectTakeLeaveManagementDomain = state => state.get('takeLeaveManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TakeLeaveManagemen
 */

const makeSelectTakeLeaveManagement = () => createSelector(selectTakeLeaveManagementDomain, substate => substate.toJS());
export default makeSelectTakeLeaveManagement;
export { selectTakeLeaveManagementDomain };
