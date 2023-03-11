import { fromJS } from 'immutable';
import liabilitiesReportReducer from '../reducer';

describe('liabilitiesReportReducer', () => {
  it('returns the initial state', () => {
    expect(liabilitiesReportReducer(undefined, {})).toEqual(fromJS({}));
  });
});
