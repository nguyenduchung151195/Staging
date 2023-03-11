import { fromJS } from 'immutable';
import addEmailHistoryReducer from '../reducer';

describe('addEmailHistoryReducer', () => {
  it('returns the initial state', () => {
    expect(addEmailHistoryReducer(undefined, {})).toEqual(fromJS({}));
  });
});
