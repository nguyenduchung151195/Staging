import { fromJS } from 'immutable';
import kanbanPluginReducer from '../reducer';

describe('kanbanPluginReducer', () => {
  it('returns the initial state', () => {
    expect(kanbanPluginReducer(undefined, {})).toEqual(fromJS({}));
  });
});
