import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the taskScheduler state domain
 */

const selectTaskSchedulerDomain = state => state.get('taskScheduler', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TaskScheduler
 */

const makeSelectTaskScheduler = () => createSelector(selectTaskSchedulerDomain, substate => substate.toJS());

export default makeSelectTaskScheduler;
export { selectTaskSchedulerDomain };
