import { fromJS } from 'immutable';
import fluctuationsPageReducer from '../reducer';

describe('fluctuationsPageReducer', () => {
  it('returns the initial state', () => {
    expect(fluctuationsPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
