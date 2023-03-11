/*
 * StockPage Messages
 *
 * This contains all the text for the StockPage container.
 */

import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';

export const scope = 'app.containers.StockPage';
const data = require('../../translations/en/StockPage.json');

export default defineMessages(getDataI18N(scope, data));
