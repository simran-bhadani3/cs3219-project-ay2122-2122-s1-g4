// const moment = require('moment');

//replace with appropriate auction message function
function formatMessage(username, text) {
  return {
    username,
    text,
    // time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;