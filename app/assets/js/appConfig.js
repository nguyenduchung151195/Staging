const filterConsoleErrors = () => {
  const consoleError = console.error;

  if (window && window.console) {
    window.console.error = (...args) => {
      if (typeof args[0] === 'string') {
        if (args[0].indexOf('React Intl') > -1) {
          return;
        }
        if (args[0].indexOf('Warning') > -1) {
          return;
        }

        consoleError(args[0]);
        return;
      }

      consoleError(...args);
    };
  }
};

filterConsoleErrors();
/* eslint-disable no-unused-vars */
const BASE = 'https://g.lifetek.vn:201';
const UPLOAD_APP = 'https://g.lifetek.vn:203/api';
// Pall start
// const CLIENT = '60_CRM';
// const APP = 'https://g.lifetek.vn:260';
// Pall end
const UPLOAD_AI = 'https://g.lifetek.vn:225/face_services';
// Staging start
const CLIENT = '20_CRM';
const APP = 'https://g.lifetek.vn:220';
const APP_REPORT = 'https://g.lifetek.vn:216';
const URL_MEETING = 'https://meeting.lifetek.vn:448'
// const APP = 'http://172.16.10.13:10020';
// Staging end

// Internal start
// const CLIENT = '80_LIFETEK';
// const APP = 'https://g.lifetek.vn:280';
// Internal end

// Local start
// const CLIENT = 'APP_CRM';
// const APP = 'http://localhost:10020';
// Local end

const DATA_USED = 'https://g.lifetek.vn:222';
const TIMEKEEPER_CONFIG = 'https://g.lifetek.vn:221';
const DYNAMIC_FORM = 'https://g.lifetek.vn:219';
const AUTOMATION = 'https://g.lifetek.vn:208';
const PROPERTIES_APP = 'https://g.lifetek.vn:207/api';
const APPROVE = 'https://g.lifetek.vn:210';
const ALLOW_FILE_EXT = ['.pdf', '.txt', '.docx', '.doc', '.xls', '.xlsx', '.csv', '.jpeg', '.jpg', '.png', '.mp4'];
const versionNo = 13;
const dev = false;
const URL_FACE_API = 'http://123.25.30.4:7979';
const API_SMART_FORM = 'http://123.25.30.4:3000';
const SPEECH2TEXT = 'http://123.25.30.4:8081';

// const APP = 'http://localhost:10020';
// const BASE = 'http://localhost:10201';
// const AUTOMATION = 'http://localhost:10208';
// const BASE = 'http://admin.lifetek.vn:1000';
// const UPLOAD_APP = 'http://admin.lifetek.vn:1003/api';
// const CLIENT = '2077App';
// const APP = 'http://admin.lifetek.vn:2077';
// const DYNAMIC_FORM = 'http://admin.lifetek.vn:1019';
// const AUTOMATION = 'http://admin.lifetek.vn:1008';
// const PROPERTIES_APP = 'http://admin.lifetek.vn:1007/api';
// const APPROVE = 'http://admin.lifetek.vn:1010';

// const BASE = 'http://admin.lifetek.vn:1000';
// const UPLOAD_APP = 'http://admin.lifetek.vn:1003/api';
// const CLIENT = '2090App';
// const APP = 'http://admin.lifetek.vn:2090';
// const DYNAMIC_FORM = 'http://admin.lifetek.vn:1019';
// const AUTOMATION = 'http://admin.lifetek.vn:1008';
// const PROPERTIES_APP = 'http://admin.lifetek.vn:1007/api';
// const APPROVE = 'http://admin.lifetek.vn:1010';
