import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the taskRelatePage state domain
 */

const selectTaskRelatePageDomain = state => state.get('taskRelatePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TaskRelatePage
 */

const makeSelectTaskRelatePage = () => createSelector(selectTaskRelatePageDomain, substate => substate.toJS());

export default makeSelectTaskRelatePage;
export { selectTaskRelatePageDomain };
