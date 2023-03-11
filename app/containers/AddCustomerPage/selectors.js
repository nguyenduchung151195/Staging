import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addCustomerPage state domain
 */

const selectAddCustomerPageDomain = state => state.get('addCustomerPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddCustomerPage
 */

// const selectExpand =
const makeSelectAddCustomerPage = () => createSelector(selectAddCustomerPageDomain, substate => substate.toJS());
const makeSelectlistAtt = () => createSelector(selectAddCustomerPageDomain, substate => substate.get('listAtt'));

export default makeSelectAddCustomerPage;
export { selectAddCustomerPageDomain, makeSelectlistAtt };
