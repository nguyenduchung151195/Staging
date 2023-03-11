import { fromJS } from 'immutable';
import addPersonnelPageReducer from '../reducer';

describe('addPersonnelPageReducer', () => {
  it('returns the initial state', () => {
    expect(addPersonnelPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
