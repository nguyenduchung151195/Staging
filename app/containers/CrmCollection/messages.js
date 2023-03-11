/*
 * CrmCollection Messages
 *
 * This contains all the text for the CrmCollection container.
 */
import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/CrmCollection.json');
export const scope = 'app.container.CrmCollection';

export default defineMessages(getDataI18N(scope, data));
