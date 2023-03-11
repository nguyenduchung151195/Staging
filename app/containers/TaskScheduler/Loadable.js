/**
 *
 * Asynchronously loads the component for TaskScheduler
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
