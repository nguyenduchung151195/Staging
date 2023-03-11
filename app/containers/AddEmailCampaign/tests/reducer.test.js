import { fromJS } from 'immutable';
import addEmailCampaignReducer from '../reducer';

describe('addEmailCampaignReducer', () => {
  it('returns the initial state', () => {
    expect(addEmailCampaignReducer(undefined, {})).toEqual(fromJS({}));
  });
});
