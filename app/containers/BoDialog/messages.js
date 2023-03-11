/*
 * BoDialog Messages
 *
 * This contains all the text for the BoDialog container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/BusinessOpportunities.json');
export const scope = 'crm.BusinessOpportunities';

export default defineMessages(getDataI18N(scope, data));
