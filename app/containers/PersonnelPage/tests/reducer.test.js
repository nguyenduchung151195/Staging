import { fromJS } from 'immutable';
import personnelPageReducer from '../reducer';

describe('personnelPageReducer', () => {
  it('returns the initial state', () => {
    expect(personnelPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
