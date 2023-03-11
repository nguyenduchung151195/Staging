import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addPropertie state domain
 */

const selectAddPropertieDomain = state => state.get('addPropertie', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddPropertie
 */

const makeSelectAddPropertie = () => createSelector(selectAddPropertieDomain, substate => substate.toJS());

export default makeSelectAddPropertie;
export { selectAddPropertieDomain };
