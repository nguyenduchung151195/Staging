import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addWorkFlowPage state domain
 */

const selectAddWorkFlowPageDomain = state => state.get('addWorkFlowPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddWorkFlowPage
 */

const makeSelectAddWorkFlowPage = () => createSelector(selectAddWorkFlowPageDomain, substate => substate.toJS());

export default makeSelectAddWorkFlowPage;
export { selectAddWorkFlowPageDomain };
