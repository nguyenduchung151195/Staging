import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPersonnelPage state domain
 */

const selectAddPersonnelPageDomain = state => state.get('addPersonnelPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPersonnelPage
 */

const makeSelectAddPersonnelPage = () => createSelector(selectAddPersonnelPageDomain, substate => substate.toJS());

export default makeSelectAddPersonnelPage;
export { selectAddPersonnelPageDomain };
