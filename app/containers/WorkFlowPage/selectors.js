import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the workFlowPage state domain
 */

const selectWorkFlowPageDomain = state => state.get('workFlowPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WorkFlowPage
 */

const makeSelectWorkFlowPage = () => createSelector(selectWorkFlowPageDomain, substate => substate.toJS());

export default makeSelectWorkFlowPage;
export { selectWorkFlowPageDomain };
