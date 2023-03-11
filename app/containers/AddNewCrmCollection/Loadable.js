/**
 *
 * Asynchronously loads the component for AddNewCrmCollection
 *
 */

import loadable from 'loadable-components';
import Loading from '../../components/LoadingIndicator';

export default loadable(() => import('./index'), { fallback: Loading });
