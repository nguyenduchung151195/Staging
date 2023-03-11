/**
 *
 * Asynchronously loads the component for Gantt
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
