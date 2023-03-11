import { fromJS } from 'immutable';
import importProductReducer from '../reducer';

describe('importProductReducer', () => {
  it('returns the initial state', () => {
    expect(importProductReducer(undefined, {})).toEqual(fromJS({}));
  });
});
