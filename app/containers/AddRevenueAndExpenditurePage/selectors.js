import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRevenueAndExpenditurePage state domain
 */

const selectAddRevenueAndExpenditurePageDomain = state => state.get('addRevenueAndExpenditurePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRevenueAndExpenditurePage
 */

const makeSelectAddRevenueAndExpenditurePage = () => createSelector(selectAddRevenueAndExpenditurePageDomain, substate => substate.toJS());

export default makeSelectAddRevenueAndExpenditurePage;
export { selectAddRevenueAndExpenditurePageDomain };
