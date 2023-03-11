import { fromJS } from 'immutable';
import addPersonnelReducer from '../reducer';

describe('addPersonnelReducer', () => {
  it('returns the initial state', () => {
    expect(addPersonnelReducer(undefined, {})).toEqual(fromJS({}));
  });
});
