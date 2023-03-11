import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the gantt state domain
 */

const selectGanttDomain = state => state.get('gantt', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by Gantt
 */

const makeSelectGantt = () => createSelector(selectGanttDomain, substate => substate.toJS());

export default makeSelectGantt;
export { selectGanttDomain };
