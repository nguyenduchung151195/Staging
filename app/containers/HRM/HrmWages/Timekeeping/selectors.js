import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the timekeeping state domain
 */

const selectTimekeepingPageDomain = state => state.get('timekeeping', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WagesManagement
 */

const makeSelectTimekeepingPage = () => createSelector(selectTimekeepingPageDomain, substate => substate.toJS());

export default makeSelectTimekeepingPage;
export { selectTimekeepingPageDomain };
