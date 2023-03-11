import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the wagesPage state domain
 */

const selectWagesPageDomain = state => state.get('wagesPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WagesPage
 */

const makeSelectWagesPage = () => createSelector(selectWagesPageDomain, substate => substate.toJS());

export default makeSelectWagesPage;
export { selectWagesPageDomain };
