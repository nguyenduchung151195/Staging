import { fromJS } from 'immutable';
import hocFindPeopleDialogReducer from '../reducer';

describe('hocFindPeopleDialogReducer', () => {
  it('returns the initial state', () => {
    expect(hocFindPeopleDialogReducer(undefined, {})).toEqual(fromJS({}));
  });
});
