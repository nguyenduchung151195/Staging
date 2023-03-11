/*
 * CriteriaPage Messages
 *
 * This contains all the text for the CriteriaPage container.
 */

/*
 * TaskPage Messages
 *
 * This contains all the text for the TaskPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/BSCKPI.json');
export const scope = 'app.container.BSCKPI';

export default defineMessages(getDataI18N(scope, data));
