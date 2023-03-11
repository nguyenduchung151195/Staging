import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addDiscipline state domain
 */

const selectAddDisciplineDomain = state => state.get('addDiscipline', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by addDiscipline
 */

const selectAddDisciplineDomain = () => createSelector(selectAddDisciplineDomain, substate => substate.toJS());

export default selectAddDisciplineDomain;
export { selectAddDisciplineDomain };
