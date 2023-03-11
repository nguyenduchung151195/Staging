import { fromJS } from 'immutable';
import reportSourceReducer from '../reducer';

describe('reportSourceReducer', () => {
  it('returns the initial state', () => {
    expect(reportSourceReducer(undefined, {})).toEqual(fromJS({}));
  });
});
