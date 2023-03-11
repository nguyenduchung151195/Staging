import { defineMessages } from 'react-intl';
import { getDataI18N } from 'utils/common';
const data = require('translations/en.json');
export const scope = '';

export default defineMessages(getDataI18N(scope, data));
