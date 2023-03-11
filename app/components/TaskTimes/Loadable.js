/**
 *
 * Asynchronously loads the component for TaskTimes
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
