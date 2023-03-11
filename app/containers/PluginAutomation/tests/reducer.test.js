import { fromJS } from 'immutable';
import pluginAutomationReducer from '../reducer';

describe('pluginAutomationReducer', () => {
  it('returns the initial state', () => {
    expect(pluginAutomationReducer(undefined, {})).toEqual(fromJS({}));
  });
});
