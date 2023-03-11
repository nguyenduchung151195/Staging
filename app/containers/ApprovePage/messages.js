/*
 * TaskPage Messages
 *
 * This contains all the text for the TaskPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/ApprovePage.json');
export const scope = 'app.container.ApprovePage';

export default defineMessages(getDataI18N(scope, data));
