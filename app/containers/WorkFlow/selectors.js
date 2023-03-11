import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the workFlow state domain
 */

const selectWorkFlowDomain = state => state.get('workFlow', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WorkFlow
 */

const makeSelectWorkFlow = () => createSelector(selectWorkFlowDomain, substate => substate.toJS());

export default makeSelectWorkFlow;
export { selectWorkFlowDomain };
