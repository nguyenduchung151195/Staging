import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the personnelPage state domain
 */

const selectPersonnelPageDomain = state => state.get('personnelPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PersonnelPage
 */

const makeSelectPersonnelPage = () => createSelector(selectPersonnelPageDomain, substate => substate.toJS());

export default makeSelectPersonnelPage;
export { selectPersonnelPageDomain };
