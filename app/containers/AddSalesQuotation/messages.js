/*
 * AddSalesQuotation Messages
 *
 * This contains all the text for the AddSalesQuotation container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/AddSalesQuotation.json');
export const scope = 'crm.AddSalesQuotation';

export default defineMessages(getDataI18N(scope, data));
