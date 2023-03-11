import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the tableCloneModule state domain
 */

const selectTableCloneModuleDomain = state => state.get('tableCloneModule', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TableCloneModule
 */

const makeSelectTableCloneModule = () => createSelector(selectTableCloneModuleDomain, substate => substate.toJS());

export default makeSelectTableCloneModule;
export { selectTableCloneModuleDomain };
