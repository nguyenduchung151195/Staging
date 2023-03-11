import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the PraisePage state domain
 */

const selectPraisePageDomain = state => state.get('praisePage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PraisePage
 */

const makeSelectPraisePage = () => createSelector(selectPraisePageDomain, substate => substate.toJS());

export default makeSelectPraisePage;
export { selectPraisePageDomain };
