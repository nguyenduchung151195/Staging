/*
 * AddContractPage Messages
 *
 * This contains all the text for the AddContractPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'app.containers.AddContract';
const data = require('../../translations/en/AddContract.json');

export default defineMessages(getDataI18N(scope, data));
