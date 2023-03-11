/**
 *
 * Asynchronously loads the component for ReportSource
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
