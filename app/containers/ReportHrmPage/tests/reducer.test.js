import { fromJS } from 'immutable';
import reportHrmPageReducer from '../reducer';

describe('reportHrmPageReducer', () => {
  it('returns the initial state', () => {
    expect(reportHrmPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
