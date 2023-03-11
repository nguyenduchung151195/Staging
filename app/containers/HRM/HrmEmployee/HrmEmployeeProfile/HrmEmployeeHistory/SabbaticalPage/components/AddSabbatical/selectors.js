import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addSabbatical state domain
 */

const selectAddSabbaticalDomain = state => state.get('addSabbatical', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddSabbatical
 */

const makeSelectAddSabbatical = () => createSelector(selectAddSabbaticalDomain, substate => substate.toJS());

export default makeSelectAddSabbatical;
export { selectAddSabbaticalDomain };
