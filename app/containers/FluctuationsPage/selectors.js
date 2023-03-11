import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the fluctuationsPage state domain
 */

const selectFluctuationsPageDomain = state => state.get('fluctuationsPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by FluctuationsPage
 */

const makeSelectFluctuationsPage = () => createSelector(selectFluctuationsPageDomain, substate => substate.toJS());

export default makeSelectFluctuationsPage;
export { selectFluctuationsPageDomain };
