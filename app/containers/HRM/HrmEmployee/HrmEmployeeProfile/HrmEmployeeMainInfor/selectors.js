import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the mainInfor state domain
 */

const selectMainInforPageDomain = state => state.get('mainInfor', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by MainInforPage
 */

const makeSelectMainInforPage = () => createSelector(selectMainInforPageDomain, substate => substate.toJS());
const makeSelectRoles = () => createSelector(selectMainInforPageDomain, substate => substate.toJS().roles);

export default makeSelectMainInforPage;
export { selectMainInforPageDomain, makeSelectRoles };
