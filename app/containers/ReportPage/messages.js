/*
 * MeetingPage Messages
 *
 * This contains all the text for the MeetingPage container.
 */
import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/Report.json');
export const scope = 'app.container.Report';

export default defineMessages(getDataI18N(scope, data));
