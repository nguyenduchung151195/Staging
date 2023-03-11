import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the BonusPage state domain
 */

const selectBonusPageDomain = state => state.get('bonusPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by BonusPage
 */

const makeSelectBonusPage = () => createSelector(selectBonusPageDomain, substate => substate.toJS());

export default makeSelectBonusPage;
export { selectBonusPageDomain };
