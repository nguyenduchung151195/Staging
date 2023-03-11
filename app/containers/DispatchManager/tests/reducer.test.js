import { fromJS } from 'immutable';
import dispatchManagerReducer from '../reducer';

describe('dispatchManagerReducer', () => {
  it('returns the initial state', () => {
    expect(dispatchManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
