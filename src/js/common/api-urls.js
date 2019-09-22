let { api } = require('env.cfg')

api = (window.appInfo && window.appInfo.api) || api

export default {
  getAnnouncement: `${api}/announcement/get`,
  userLogin: `${api}/user/login`,
  getUserInfo: `${api}/user/info`
}
