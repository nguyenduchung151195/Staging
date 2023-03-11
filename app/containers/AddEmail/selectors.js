import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addEmail state domain
 */

const selectAddEmailDomain = state => state.get('addEmail', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddEmail
 */

const makeSelectAddEmail = () => createSelector(selectAddEmailDomain, substate => substate.toJS());

export default makeSelectAddEmail;
export { selectAddEmailDomain };
