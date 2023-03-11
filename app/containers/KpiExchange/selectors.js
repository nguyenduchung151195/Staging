import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kpiExchange state domain
 */

const selectKpiExchangeDomain = state => state.get('kpiExchange', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by KpiExchange
 */

const makeSelectKpiExchange = () => createSelector(selectKpiExchangeDomain, substate => substate.toJS());

export default makeSelectKpiExchange;
export { selectKpiExchangeDomain };
