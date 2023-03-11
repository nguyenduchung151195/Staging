import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the configHrmPage state domain
 */

const selectConfigHrmTimekeepDomain = state => state.get('configHrmTimekeep', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ConfigHrmPage
 */

const makeSelectConfigHrmTimekeep = () => createSelector(selectConfigHrmTimekeepDomain, substate => substate.toJS());
export default makeSelectConfigHrmTimekeep;
export { selectConfigHrmTimekeepDomain };
