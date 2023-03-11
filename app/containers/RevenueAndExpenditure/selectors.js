import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the revenueAndExpenditure state domain
 */

const selectRevenueAndExpenditureDomain = state => state.get('revenueAndExpenditure', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RevenueAndExpenditure
 */

const makeSelectRevenueAndExpenditure = () => createSelector(selectRevenueAndExpenditureDomain, substate => substate.toJS());

export default makeSelectRevenueAndExpenditure;
export { selectRevenueAndExpenditureDomain };
