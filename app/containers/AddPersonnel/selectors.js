import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPersonnel state domain
 */

const selectAddPersonnelDomain = state => state.get('addPersonnel', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPersonnel
 */

const makeSelectAddPersonnel = () => createSelector(selectAddPersonnelDomain, substate => substate.toJS());

export default makeSelectAddPersonnel;
export { selectAddPersonnelDomain };
