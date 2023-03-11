import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the pluginAutomation state domain
 */

const selectPluginAutomationDomain = state => state.get('pluginAutomation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PluginAutomation
 */

const makeSelectPluginAutomation = () => createSelector(selectPluginAutomationDomain, substate => substate.toJS());
const makeSelectBody = listName => createSelector(selectPluginAutomationDomain, substate => substate.get(listName));
export default makeSelectPluginAutomation;
export { selectPluginAutomationDomain, makeSelectBody };
