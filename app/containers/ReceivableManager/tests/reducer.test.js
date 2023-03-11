import { fromJS } from 'immutable';
import receivableManagerReducer from '../reducer';

describe('receivableManagerReducer', () => {
  it('returns the initial state', () => {
    expect(receivableManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
