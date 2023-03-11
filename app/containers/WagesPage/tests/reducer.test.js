import { fromJS } from 'immutable';
import wagesPageReducer from '../reducer';

describe('wagesPageReducer', () => {
  it('returns the initial state', () => {
    expect(wagesPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
