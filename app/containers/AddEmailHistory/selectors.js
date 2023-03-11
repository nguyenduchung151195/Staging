import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addEmailHistory state domain
 */

const selectAddEmailHistoryDomain = state => state.get('addEmailHistory', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddEmailHistory
 */

const makeSelectAddEmailHistory = () => createSelector(selectAddEmailHistoryDomain, substate => substate.toJS());

export default makeSelectAddEmailHistory;
export { selectAddEmailHistoryDomain };
