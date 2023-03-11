import { fromJS } from 'immutable';
import addPropertiesGroupReducer from '../reducer';

describe('addPropertiesGroupReducer', () => {
  it('returns the initial state', () => {
    expect(addPropertiesGroupReducer(undefined, {})).toEqual(fromJS({}));
  });
});
