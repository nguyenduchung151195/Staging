import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addWages state domain
 */

const selectAddWagesDomain = state => state.get('addWages', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddWages
 */

const makeSelectAddWages = () => createSelector(selectAddWagesDomain, substate => substate.toJS());

export default makeSelectAddWages;
export { selectAddWagesDomain };
