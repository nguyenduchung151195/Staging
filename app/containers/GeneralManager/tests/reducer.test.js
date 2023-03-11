import { fromJS } from 'immutable';
import generalManagerReducer from '../reducer';

describe('generalManagerReducer', () => {
  it('returns the initial state', () => {
    expect(generalManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
