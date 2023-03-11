import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addMaternity state domain
 */

const selectAddMaternityDomain = state => state.get('addMaternity', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddMaternity
 */

const makeSelectAddMaternity = () => createSelector(selectAddMaternityDomain, substate => substate.toJS());

export default makeSelectAddMaternity;
export { selectAddMaternityDomain };
