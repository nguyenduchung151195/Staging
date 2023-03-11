/*
 * PersonnelPage Messages
 *
 * This contains all the text for the PersonnelPage container.
 */
import { defineMessages } from 'react-intl';
import { getDataI18N } from '../../utils/common';
const data = require('../../translations/en/PersonelPage.json');
export const scope = 'app.container.PersonalPage';

export default defineMessages(getDataI18N(scope, data));
