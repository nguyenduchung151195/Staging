import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addIndenture state domain
 */

const selectAddIndentureDomain = state => state.get('addIndenture', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddIndenture
 */

const makeSelectAddIndenture = () => createSelector(selectAddIndentureDomain, substate => substate.toJS());

export default makeSelectAddIndenture;
export { selectAddIndentureDomain };
