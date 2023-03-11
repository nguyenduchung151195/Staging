import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the maternityPage state domain
 */

const selectMaternityPageDomain = state => state.get('maternityPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by maternityPage
 */

const makeSelectMaternityPage = () => createSelector(selectMaternityPageDomain, substate => substate.toJS());

export default makeSelectMaternityPage;
export { selectMaternityPageDomain };
