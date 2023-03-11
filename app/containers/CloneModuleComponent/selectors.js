import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the cloneModuleComponent state domain
 */

const selectCloneModuleComponentDomain = state => state.get('cloneModuleComponent', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by CloneModuleComponent
 */

const makeSelectCloneModuleComponent = () => createSelector(selectCloneModuleComponentDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectCloneModuleComponentDomain, substate => substate.get(listName));
export default makeSelectCloneModuleComponent;
export { selectCloneModuleComponentDomain, makeSelectBody };
