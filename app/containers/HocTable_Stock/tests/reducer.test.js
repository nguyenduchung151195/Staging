import { fromJS } from 'immutable';
import hocTableReducer from '../reducer';

describe('hocTableReducer', () => {
  it('returns the initial state', () => {
    expect(hocTableReducer(undefined, {})).toEqual(fromJS({}));
  });
});
