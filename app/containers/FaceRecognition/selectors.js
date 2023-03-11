import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the FaceRecognition state domain
 */

const selectFaceRecognition = state => state.get('faceRecognition', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by FaceRecognition
 */

const makeSelectFaceRecognition = () => createSelector(selectFaceRecognition, substate => substate.toJS());

export default makeSelectFaceRecognition;
export { selectFaceRecognition };
