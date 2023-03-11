/*
 * SalesQuotations Messages
 *
 * This contains all the text for the SalesQuotations container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/SalesQuotations.json');
export const scope = 'crm.SalesQuotations';

export default defineMessages(getDataI18N(scope, data));
