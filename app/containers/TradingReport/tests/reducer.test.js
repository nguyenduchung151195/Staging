import { fromJS } from 'immutable';
import tradingReportReducer from '../reducer';

describe('tradingReportReducer', () => {
  it('returns the initial state', () => {
    expect(tradingReportReducer(undefined, {})).toEqual(fromJS({}));
  });
});
