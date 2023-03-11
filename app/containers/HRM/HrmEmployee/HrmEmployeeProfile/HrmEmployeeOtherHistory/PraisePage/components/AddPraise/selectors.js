import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPraise state domain
 */

const selectAddPraiseDomain = state => state.get('addPraise', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPraise
 */

const makeSelectAddPraise = () => createSelector(selectAddPraiseDomain, substate => substate.toJS());

export default makeSelectAddPraise;
export { selectAddPraiseDomain };
