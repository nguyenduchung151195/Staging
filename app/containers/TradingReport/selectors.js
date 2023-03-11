import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the tradingReport state domain
 */

const selectTradingReportDomain = state => state.get('tradingReport', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by TradingReport
 */

const makeSelectTradingReport = () => createSelector(selectTradingReportDomain, substate => substate.toJS());

export default makeSelectTradingReport;
export { selectTradingReportDomain };
