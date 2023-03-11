import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the generalManager state domain
 */

const selectGeneralManagerDomain = state => state.get('generalManager', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by GeneralManager
 */

const makeSelectGeneralManager = () => createSelector(selectGeneralManagerDomain, substate => substate.toJS());

export default makeSelectGeneralManager;
export { selectGeneralManagerDomain };
