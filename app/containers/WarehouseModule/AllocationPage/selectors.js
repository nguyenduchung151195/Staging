import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the allocationPage state domain
 */

const selectAllocationPageDomain = state => state.get('allocationPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AllocationPage
 */

const makeSelectAllocationPage = () => createSelector(selectAllocationPageDomain, substate => substate.toJS());

export default makeSelectAllocationPage;
export { selectAllocationPageDomain };
