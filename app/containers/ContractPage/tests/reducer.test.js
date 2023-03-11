import { fromJS } from 'immutable';
import contractReducer from '../reducer';

describe('contractReducer', () => {
  it('returns the initial state', () => {
    expect(contractReducer(undefined, {})).toEqual(fromJS({}));
  });
});
