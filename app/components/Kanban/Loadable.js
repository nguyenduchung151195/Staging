/**
 *
 * Asynchronously loads the component for Kanban
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
