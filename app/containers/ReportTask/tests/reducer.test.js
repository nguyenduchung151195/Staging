import { fromJS } from 'immutable';
import reportTaskReducer from '../reducer';

describe('reportTaskReducer', () => {
  it('returns the initial state', () => {
    expect(reportTaskReducer(undefined, {})).toEqual(fromJS({}));
  });
});
