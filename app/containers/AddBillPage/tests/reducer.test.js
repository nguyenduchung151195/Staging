import { fromJS } from 'immutable';
import addBillPageReducer from '../reducer';

describe('addBillPageReducer', () => {
  it('returns the initial state', () => {
    expect(addBillPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
