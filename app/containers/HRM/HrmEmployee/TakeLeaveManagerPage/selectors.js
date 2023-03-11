import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the TakeLeaveManagePage state domain
 */

const selectTakeLeaveManagePageDomain = state => state.get('takeLeaveManagePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TakeLeaveManagePage
 */

const makeSelectTakeLeaveManagePage = () => createSelector(selectTakeLeaveManagePageDomain, substate => substate.toJS());

export default makeSelectTakeLeaveManagePage;
export { selectTakeLeaveManagePageDomain };
