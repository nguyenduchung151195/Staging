import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addGeneralManager state domain
 */

const selectAddGeneralManagerDomain = state => state.get('addGeneralManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddGeneralManager
 */

const makeSelectAddGeneralManager = () => createSelector(selectAddGeneralManagerDomain, substate => substate.toJS());

export default makeSelectAddGeneralManager;
export { selectAddGeneralManagerDomain };
