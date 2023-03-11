import { fromJS } from 'immutable';
import addPayManagerReducer from '../reducer';

describe('addPayManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addPayManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
