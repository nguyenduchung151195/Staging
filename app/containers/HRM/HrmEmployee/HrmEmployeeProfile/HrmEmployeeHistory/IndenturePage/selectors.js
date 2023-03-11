import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the IndenturePage state domain
 */

const selectIndenturePageDomain = state => state.get('indenturePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by IndenturePage
 */

const makeSelectIndenturePage = () => createSelector(selectIndenturePageDomain, substate => substate.toJS());

export default makeSelectIndenturePage;
export { selectIndenturePageDomain };
