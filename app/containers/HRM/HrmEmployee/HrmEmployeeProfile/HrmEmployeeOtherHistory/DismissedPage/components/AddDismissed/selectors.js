import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addDismissed state domain
 */

const selectAddDismissedDomain = state => state.get('addDismissed', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddDismissed
 */

const makeSelectAddDismissed = () => createSelector(selectAddDismissedDomain, substate => substate.toJS());

export default makeSelectAddDismissed;
export { selectAddDismissedDomain };
