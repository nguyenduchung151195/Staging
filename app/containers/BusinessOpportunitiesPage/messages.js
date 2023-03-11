/*
 * BusinessOpportunities Messages
 *
 * This contains all the text for the BusinessOpportunities container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/BusinessOpportunities.json');
export const scope = 'app.container.BusinessOpportunities';

export default defineMessages(getDataI18N(scope, data));
