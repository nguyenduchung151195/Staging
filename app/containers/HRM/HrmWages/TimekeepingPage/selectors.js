import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesMamagemen state domain
 */

const selectTimekeepingPage = state => state.get('timekeepingPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WagesManagement
 */

const makeSelectTimekeepingPage = () => createSelector(selectTimekeepingPage, substate => substate.toJS());
export default makeSelectTimekeepingPage;
export { selectTimekeepingPage };
