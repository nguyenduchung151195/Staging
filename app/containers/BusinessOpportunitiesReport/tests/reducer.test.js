import { fromJS } from 'immutable';
import businessOpportunitiesReportReducer from '../reducer';

describe('businessOpportunitiesReportReducer', () => {
  it('returns the initial state', () => {
    expect(businessOpportunitiesReportReducer(undefined, {})).toEqual(fromJS({}));
  });
});
