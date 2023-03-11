import { fromJS } from 'immutable';
import addEmailReducer from '../reducer';

describe('addEmailReducer', () => {
  it('returns the initial state', () => {
    expect(addEmailReducer(undefined, {})).toEqual(fromJS({}));
  });
});
