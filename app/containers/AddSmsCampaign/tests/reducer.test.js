import { fromJS } from 'immutable';
import addSmsCampaignReducer from '../reducer';

describe('addSmsCampaignReducer', () => {
  it('returns the initial state', () => {
    expect(addSmsCampaignReducer(undefined, {})).toEqual(fromJS({}));
  });
});
