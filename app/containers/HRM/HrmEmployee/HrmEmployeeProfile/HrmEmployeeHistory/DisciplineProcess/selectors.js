import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the DisciplinePage state domain
 */

const selectDisciplinePageDomain = state => state.get('disciplinePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DisciplinePage
 */

const makeSelectDisciplinePage = () => createSelector(selectDisciplinePageDomain, substate => substate.toJS());

export default makeSelectDisciplinePage;
export { selectDisciplinePageDomain };
