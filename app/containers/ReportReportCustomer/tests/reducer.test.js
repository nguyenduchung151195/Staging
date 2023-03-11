import { fromJS } from 'immutable';
import reportReportCustomerReducer from '../reducer';

describe('reportReportCustomerReducer', () => {
  it('returns the initial state', () => {
    expect(reportReportCustomerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
