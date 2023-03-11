import { fromJS } from 'immutable';
import addDispatchManagerPageReducer from '../reducer';

describe('addDispatchManagerPageReducer', () => {
  it('returns the initial state', () => {
    expect(addDispatchManagerPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
