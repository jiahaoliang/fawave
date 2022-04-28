// @author qleelulu@gmail.com, fengmk2@gmail.com

//-- 版本号 --
var VERSION = 20110220;
function getVersion() {
  var ver = localStorage.getObject('VERSION');
  return ver;
}

function updateVersion() {
  localStorage.setObject('VERSION', VERSION);
}
//<<--

var _u = {
  //向页面写内容
  w: function (s) {
    document.write(s);
  },
  //向页面写本地化后的内容
  wi: function (s, e) {
    _u.w(_u.i18n(s, e));
  },
  wia: function (sel, attr, s, e) {
    $(sel).attr(attr, _u.i18n(s, e));
  },
  //获取本地化语言
  i18n: function (s, e) {
    if (window._i18n_messages_cache === undefined) {
      var bg = getBackgroundView();
      window._i18n_messages_cache = bg._i18n_messages;
    }
    if (window._i18n_messages_cache) {
      var msg = window._i18n_messages_cache[s];
      if (msg) {
        var message = msg.message || s;
        if (msg.placeholders && e && e.length > 0 && msg.message) {
          for (var k in msg.placeholders) {
            var index = parseInt(msg.placeholders[k].content.substring(1), 10) - 1;
            message = message.replace(new RegExp('\\$' + k + '\\$', 'g'), e[index]);
          }
        }
        return message;
      }
    }
    return chrome.i18n.getMessage(s, e) || s;
  }
};

var PAGE_SIZE = 20;
var COMMENT_PAGE_SIZE = 8;
var OAUTH_CALLBACK_URL = chrome.extension.getURL('oauth_cb.html');

var SINA = 'idi_sina';

var SETTINGS_KEY = 'fawave_SETTINGS_KEY';

var UNSEND_TWEET_KEY = 'idi_UNSEND_TWEET_KEY';//未发送的tweet，保存下次显示
var UNSEND_REPLY_KEY = 'idi_UNSEND_REPLY_KEY';//未发送的回复，评论，转发，保存下次显示

var FRIENDS_TIMELINE_KEY = 'idi_friends_timeline';
var REPLIES_KEY = 'idi_replies';
var MESSAGES_KEY = 'idi_messages';

var USER_LIST_KEY = 'idi_userlist';
var CURRENT_USER_KEY = 'idi_current_user';

var LAST_MSG_ID = 'idi_last_msg_id';
var LAST_CURSOR = '_last_cursor';

var LAST_SELECTED_SEND_ACCOUNTS = 'LAST_SELECTED_SEND_ACCOUNTS';

var LOCAL_STORAGE_NEW_TWEET_LIST_KEY = 'idi_LOCAL_STORAGE_NEW_TWEET_LIST_KEY';
var LOCAL_STORAGE_TWEET_LIST_HTML_KEY = 'idi_LOCAL_STORAGE_TWEET_LIST_HTML_KEY';

var UNREAD_TIMELINE_COUNT_KEY = 'idi_UNREAD_TIMELINE_COUNT_KEY';

var IS_SYNC_TO_PAGE_KEY = 'idi_IS_SYNC_TO_PAGE_KEY'; //已读消息是否和新浪微博页面同步

var THEME_LIST = {
  'default': 'default', 
  'simple': 'simple', 
  'pip_io': 'pip_io', 
  'work': 'work'
}; //主题列表

var ALERT_MODE_KEY = 'idi_ALERT_MODE_KEY'; //信息提醒模式key
var AUTO_INSERT_MODE_KEY = 'idi_AUTO_INSERT_MODE_KEY'; //新信息是否自动插入
var INCLUDE_ORIGINAL_COMMENT = 'idi_INCLUDE_ORIGINAL_COMMENT'; // 回复评论的时候，是否带上原评论

//需要不停检查更新的timeline的分类列表
var T_LIST = {
  all: ['friends_timeline', 'mentions', 'comments_mentions', 'comments_timeline', 'direct_messages'],
  tsina: ['friends_timeline', 'mentions', 'comments_timeline'],
  weibo: ['friends_timeline', 'mentions', 'comments_mentions', 'comments_timeline'],
  facebook: ['friends_timeline'],
  renren: ['friends_timeline'],
  plurk: ['friends_timeline'],
  douban_v2: ['friends_timeline'],
  tianya: ['friends_timeline', 'mentions', 'comments_timeline'],
  tumblr: ['friends_timeline', 'mentions', 'direct_messages'],
  googleplus: []
};
T_LIST.tqq  = T_LIST.all;
T_LIST.fanfou = T_LIST.renjian = T_LIST.leihou = T_LIST.twitter =
  T_LIST.identi_ca = T_LIST.tumblr;

var T_NAMES = {
  //tsina: '新浪微博',
  weibo: '新浪微博(V2.0 不支持私信)',
  tqq: '腾讯微博',
  douban_v2: '豆瓣广播',
  fanfou: '饭否',
  tianya: '天涯微博',
  leihou: '雷猴',
  googleplus: 'Google+',
  twitter: 'Twitter',
  facebook: 'Facebook',
  plurk: 'Plurk',
   'tumblr': 'Tumblr'
};

var Languages = {
  '中文': 'zh',
  'Afrikaans': 'af',
  'Albanian': 'sq',
  'Arabic': 'ar',
  'Basque': 'eu',
  'Belarusian': 'be',
  'Bulgarian': 'bg',
  'Catalan': 'ca',
  'Croatian': 'hr',
  'Czech': 'cs',
  'Danish': 'da',
  'Dutch': 'nl',
  'English': 'en',
  'Estonian': 'et',
  'Filipino': 'tl',
  'Finnish': 'fi',
  'French': 'fr',
  'Galician': 'gl',
  'German': 'de',
  'Greek': 'el',
  'Haitian Creole': 'ht',
  'Hebrew': 'iw',
  'Hindi': 'hi',
  'Hungarian': 'hu',
  'Icelandic': 'is',
  'Indonesian': 'id',
  'Irish': 'ga',
  'Italian': 'it',
  'Japanese': 'ja',
  'Latvian': 'lv',
  'Lithuanian': 'lt',
  'Macedonian': 'mk',
  'Malay': 'ms',
  'Maltese': 'mt',
  'Norwegian': 'no',
  'Persian': 'fa',
  'Polish': 'pl',
  'Portuguese': 'pt',
  'Romanian': 'ro',
  'Russian': 'ru',
  'Serbian': 'sr',
  'Slovak': 'sk',
  'Slovenian': 'sl',
  'Spanish': 'es',
  'Swahili': 'sw',
  'Swedish': 'sv',
  'Thai': 'th',
  'Turkish': 'tr',
  'Ukrainian': 'uk',
  'Vietnamese': 'vi',
  'Welsh': 'cy',
  'Yiddish': 'yi'
};

var unreadDes = {
  'friends_timeline': _u.i18n('abb_friends_timeline'), 
  'mentions': '@', 
  'comments_timeline': _u.i18n('abb_comments_timeline'), 
  'direct_messages': _u.i18n('abb_direct_message'),
  'comments_mentions': _u.i18n('abb_comments_mentions'),
};

var tabDes = {
  'friends_timeline': _u.i18n('comm_TabName_friends_timeline'), 
  'mentions': _u.i18n('comm_TabName_mentions'), 
  'comments_mentions': _u.i18n('comm_TabName_comments_mentions'),
  'comments_timeline': _u.i18n('comm_TabName_comments_timeline'), 
  'direct_messages': _u.i18n('comm_TabName_direct_messages')
};

//刷新时间限制
var refreshTimeLimit = {
  tsina: {
    'friends_timeline': 30, 
    'mentions': 30, 
    'comments_timeline': 30, 
    'direct_messages': 30,
    'sent_direct_messages': 60
  },
  tqq: {
    'friends_timeline': 45, 
    'mentions': 45, 
    'comments_timeline': 45, 
    'direct_messages': 45,
    'sent_direct_messages': 60
  }
};
refreshTimeLimit.tianya = refreshTimeLimit.digu = refreshTimeLimit.twitter = refreshTimeLimit.identi_ca = 
  refreshTimeLimit.tsohu = refreshTimeLimit.t163 = refreshTimeLimit.fanfou = refreshTimeLimit.plurk = 
  refreshTimeLimit.tsina;
refreshTimeLimit.leihou = 
  refreshTimeLimit.douban = refreshTimeLimit.buzz = refreshTimeLimit.tqq;

function showMsg(msg, show_now, is_error) {
  var popupView = getPopupView();
  if (popupView) {
    popupView._showMsg(msg, show_now, is_error);
  }
}

// 缓冲错误信息，不要一次过显示一堆
var __msg_next = null;
// show_now: 是否马上显示，用于非错误提示
function _showMsg(msg, show_now, is_error=true) {
  if (is_error) {
    console.error(new Error(msg));
  } else {
    console.info(msg);
  }
  if (show_now) {
    return __displayMessage(msg, show_now);
  }
  // 非马上显示的，需要根据配置判断是否要显示
  if (!is_error || Settings.get().show_network_error) {
    if (__msg_next) {
      __msg_next = msg;
    } else {
      __displayMessage(msg);
      __msg_next = msg;
    }
  }
}

function __displayMessage(msg, show_now) {
  $('<div class="messageInfo">' + msg + '</div>')
  .appendTo('#msgInfoWarp')
  .fadeIn('slow')
  .animate({opacity: 1.0}, 3000)
  .fadeOut('slow', function () {
    $(this).remove();
    if (!show_now) {
      if (__msg_next) {
        if (__msg_next !== msg) {
          __displayMessage(__msg_next);
        } else {
          __msg_next = null;
        }
      }
    }
  });
}

function showLoading() {
  var popupView = getPopupView();
  if (popupView && popupView._showLoading) {
    popupView._showLoading();
  }
}

function hideLoading() {
  var popupView = getPopupView();
  if (popupView && popupView._hideLoading) {
    popupView._hideLoading();
  }
}

//设置选项
var Settings = {
  defaults: {
    twitterEnabled: true,
    t_taobaoEnabled: false,
    globalRefreshTime: { //全局的刷新间隔时间
      friends_timeline: 600,
      mentions: 1200,
      comments_mentions: 3600,
      comments_timeline: 1200,
      direct_messages: 1200
    },
    isSetBadgeText: { //是否提醒未读信息数
      friends_timeline: true,
      mentions: true,
      comments_mentions: true,
      comments_timeline: true,
      direct_messages: true
    },
    isShowInPage: { //是否在页面上提示新信息
      friends_timeline: false,
      mentions: false,
      comments_mentions: true,
      comments_timeline: true,
      direct_messages: true
    },
    isEnabledSound: { //是否开启播放声音提示新信息
      friends_timeline: false,
      mentions: false,
      comments_mentions: false,
      comments_timeline: false,
      direct_messages: false
    },
    soundSrc: '/sound/d.mp3',
    isDesktopNotifications: { //是否在桌面提示新信息
      friends_timeline: false,
      mentions: false,
      comments_mentions: false,
      comments_timeline: false,
      direct_messages: false
    },
    desktopNotificationsTimeout: 5, //桌面提示的延迟关闭时间
//  isSyncReadedToSina: false, //已读消息是否和新浪微博页面同步
    isSyncReadedCount: true, // 同步已读数据
    isSharedUrlAutoShort: true, //分享正在看的网址时是否自动缩短
    sharedUrlAutoShortWordCount: 15, //超过多少个字则自动缩短URL
    quickSendHotKey: '113', //快速发送微博的快捷键。默认 F2。保存的格式为： 33,34,35 用逗号分隔的keycode
    isSmoothScroller: false, //是否启用平滑滚动
    smoothTweenType: 'Quad', //平滑滚动的动画类型
    smoothSeaeType: 'easeOut', //平滑滚动的ease类型
    sendAccountsDefaultSelected: 'current', //多账号发送的时候默认选择的发送账号
    enableContextmenu: true, //启用右键菜单

    font: 'Arial', //字体
    fontSite: 12, //字体大小
    popupWidth: 550, //弹出窗大小
    popupHeight: 550, 
    theme: 'pip_io', //主题样式
    translate_target: 'zh', // 默认翻译语言
    shorten_url_service: 't.cn', // 默认缩址服务
    image_service: 'Imgur', // 默认的图片服务
    enable_image_service: true, // 默认开启图片服务
    isGeoEnabled: false, //默认不开启上报地理位置信息
    isGeoEnabledUseIP: false, //true 使用ip判断， false 使用浏览器来判断
    geoPosition: null, //获取到的地理位置信息，默认为空
    sent_success_auto_close: true, // 弹出窗口全部发送成功自动关闭
    remember_view_status: true, // 记住上次浏览状态
    
    default_language: null, // 默认语言，如果没有设置，则使用i18n自动根据浏览器判断语言
    __allow_select_all: true, // 是否允许同时选择新浪和其他微博
    show_network_error: true, // 是否显示网络错误信息
    lookingTemplate: '{{title}} {{url}} '
  },
  init: function () { //只在background载入的时候调用一次并给 _settings 赋值就可以
    var _sets = localStorage.getObject(SETTINGS_KEY);
    _sets = _sets || {};
    // 兼容不支持的缩址
    if (_sets.shorten_url_service && !ShortenUrl.services[_sets.shorten_url_service]) {
      delete _sets.shorten_url_service;
    }
    _sets = $.extend({}, this.defaults, _sets);
    
    if (!THEME_LIST[_sets.theme]) {
      _sets.theme = this.defaults.theme;
    }

    return _sets;
  },
  get: function () {
    var bg = getBackgroundView();
    return bg._settings;
  },
  save: function () {
    var _sets = this.get();
    localStorage.setObject(SETTINGS_KEY, _sets);
  },
  /*
  * 获取刷新间隔时间
  */
  getRefreshTime: function (user, t) {
    var r = 60;
    if (user && user.refreshTime && user.refreshTime[t]) {
      r = user.refreshTime[t];
    } else {
      r = this.get().globalRefreshTime[t];
    }
    if (refreshTimeLimit[user.blogType] &&
        refreshTimeLimit[user.blogType][t] &&
        refreshTimeLimit[user.blogType][t] > r) {
      r = refreshTimeLimit[user.blogType][t];
    }
    if (isNaN(r)) {
      r = 60;
    } else if (r < 30) {
      r = 30;
    } else if (r > 24 * 60 * 60) {
      r = 24 * 60 * 60;
    }
    return r;
  }
};


function formatScreenName(user) {
  return '[' + T_NAMES[user.blogType] + ']' + user.screen_name || user.name;
}

/// 获取当前登陆用户信息
function getUser() {
  var c_user = localStorage.getObject(CURRENT_USER_KEY);
  if (c_user && c_user.uniqueKey) {
    window.c_user = c_user;
  } else {
    var userList = getUserList();
    if (userList) {
      for (var key in userList) {
        c_user = userList[key];
        if (c_user) {
          setUser(c_user);
          break;
        }
      }
    }
  }
  return c_user;
}

//设置当前登陆用户
function setUser(user) {
  localStorage.setObject(CURRENT_USER_KEY, user);
  window.c_user = user;
}

//获取所有用户列表
//@t: all: 全部， send:用于发送的用户列表， show:正常显示的用户。默认为show
function getUserList(t) {
  t = t || 'show'; // 默认，获取用于显示的列表
  var userList = localStorage.getObject(USER_LIST_KEY) || [];
  if (t === 'all' && userList.length !== undefined) { // 兼容旧格式
    return userList;
  }
  var items = [], user = null;
  for (var i = 0, l = userList.length; i < l; i++) {
    user = userList[i];
    if (!user.disabled) {
      if (t === 'show' && user.only_for_send) { 
        continue; 
      }
      items.push(userList[i]);
    }
  }
  return items;
}

//保存用户列表
function saveUserList(userlist) {
  localStorage.setObject(USER_LIST_KEY, userlist);
}

//根据uniqueKey获取用户
//@t: all: 全部， send:用于发送的用户列表， show:正常显示的用户。默认为show
function getUserByUniqueKey(uniqueKey, t) {
  if (!uniqueKey) {
    return null;
  }
  var userList = getUserList(t);
  for (var i = 0, l = userList.length; i < l; i++) {
    if (userList[i].uniqueKey === uniqueKey) {
      return userList[i];
    }
  }
  return null;
}

// 获取用户的全部timeline的未读信息数
function getUserUnreadTimelineCount(user_uniqueKey) {
  var user = getUserByUniqueKey(user_uniqueKey);
  if (!user) { 
    return 0; 
  }
  var total = 0;
  var timelines = T_LIST[user.blogType];
  for (var i = 0, l = timelines.length; i < l; i++) {
    //key 大概如： tsina#11234598_friends_timeline_UNREAD_TIMELINE_COUNT_KEY
    total += getUnreadTimelineCount(timelines[i], user_uniqueKey);
  }
  return total;
}

// 获取用户的某一timeline的未读信息数
function getUnreadTimelineCount(t, user_uniqueKey) {
  if (!user_uniqueKey) {
    var _user = getUser();
    if (_user) {
      user_uniqueKey = _user.uniqueKey;
    } else {
      return 0;
    }
  }
  //key 大概如： tsina#11234598_friends_timeline_UNREAD_TIMELINE_COUNT_KEY
  var key = user_uniqueKey + t + UNREAD_TIMELINE_COUNT_KEY;
  return localStorage.getObject(key) || 0;
}

// @count: 增加的未读数
// @t: timeline的类型
function setUnreadTimelineCount(count, t, user_uniqueKey) {
  if (!user_uniqueKey) {
    var _user = getUser();
    if (_user) {
      user_uniqueKey = _user.uniqueKey;
    } else {
      return;
    }
  }
  count = count || 0;
  var setBadgeText = Settings.get().isSetBadgeText[t];
  count += getUnreadTimelineCount(t, user_uniqueKey);
  localStorage.setObject(user_uniqueKey + t + UNREAD_TIMELINE_COUNT_KEY, count);
  if (getAlertMode() === 'dnd') { 
    //免打扰模式
    chrome.browserAction.setBadgeText({text: ''});
    chrome.browserAction.setIcon({path: 'icons/icon48-dnd.png'});
  } else {
    chrome.browserAction.setIcon({path: 'icons/icon48.png'});
    if (setBadgeText) {
      var total = 0;
      var userList = getUserList();
      for (var j = 0, jl = userList.length; j < jl; j++) {
        var user = userList[j];
        var timelines = T_LIST[user.blogType];
        for (var i = 0, l = timelines.length; i < l; i++) {
          var name = timelines[i];
          if (Settings.get().isSetBadgeText[name]) {
            total += getUnreadTimelineCount(name, user.uniqueKey);
          }
        }
      }
      if (total > 0) {
        chrome.browserAction.setBadgeText({text: '' + total});
      } else {
        chrome.browserAction.setBadgeText({text: ''});
      }
    }
  }
  chrome.browserAction.setTitle({title: getTooltip()});
}

function removeUnreadTimelineCount(t, user_uniqueKey) {
  if (!user_uniqueKey) {
    user_uniqueKey = getUser().uniqueKey;
  }
  var unread = getUnreadTimelineCount(t, user_uniqueKey);
  if (unread && Settings.get().isSyncReadedCount) { // 如果同步未读数
    syncUnreadCountToSinaPage(t, user_uniqueKey);
  }
  localStorage.setObject(user_uniqueKey + t + UNREAD_TIMELINE_COUNT_KEY, 0);
  if (getAlertMode() === 'dnd') { //免打扰模式
    chrome.browserAction.setBadgeText({text: ''});
    chrome.browserAction.setIcon({path: 'icons/icon48-dnd.png'});
  } else {
    chrome.browserAction.setIcon({path: 'icons/icon48.png'});
    var total = 0;
    var userList = getUserList();
    for (var j = 0, jl = userList.length; j < jl; j++) {
      var user = userList[j], timelines = T_LIST[user.blogType];
      for (var i = 0, l = timelines.length; i < l; i++) {
        if (Settings.get().isSetBadgeText[timelines[i]]) {
          total += getUnreadTimelineCount(timelines[i], user.uniqueKey);
        }
      }
    }
    if (total > 0) {
      chrome.browserAction.setBadgeText({text: '' + total});
    } else {
      chrome.browserAction.setBadgeText({text: ''});
    }
  }
  chrome.browserAction.setTitle({title: getTooltip()});
}

// 将新浪微博页面的未读信息数清零
function syncUnreadCountToSinaPage(t, user_uniqueKey) {
  var c_user = null;
  if (!user_uniqueKey) {
    c_user = getUser();
    user_uniqueKey = c_user.uniqueKey;
  } else {
    c_user = getUserByUniqueKey(user_uniqueKey);
  }
  if (!c_user) {
    return;
  }
  var tl_type = false;
  switch (t) {
    case 'comments_timeline':
      tl_type = 1;
      break;
    case 'mentions':
      tl_type = 2;
      break;
    case 'direct_messages':
      tl_type = 3;
      break;
    case 'followers':
      tl_type = 4;
      break;
  }
  if (tl_type) {
    tapi.reset_count({user: c_user, type: tl_type}, function (users, textStatus, statuCode) {
      // TODO: reset success
    });
  }
}

//获取在插件icon上显示的tooltip内容
function getTooltip() {
  if (getAlertMode() === 'dnd') {
    return _u.i18n("comm_dnd_tooltip");
  }
  var tip = '', _new = 0, _mention = 0, _comment = 0, _direct = 0;
  var userList = getUserList();
  for (var j = 0, jl = userList.length; j < jl; j++) {
    var user = userList[j];
    _new = getUnreadTimelineCount('friends_timeline', user.uniqueKey);
    _mention = getUnreadTimelineCount('mentions', user.uniqueKey);
    _comment = getUnreadTimelineCount('comments_timeline', user.uniqueKey);
    _direct = getUnreadTimelineCount('direct_messages', user.uniqueKey);
    var u_tip = '';
    if (_new) { 
      u_tip += _new + _u.i18n("abb_friends_timeline"); 
    }
    if (_mention) {
      u_tip = u_tip ? u_tip + ',  ' : u_tip;
      u_tip += _mention + '@';
    }
    if (_comment) {
      u_tip = u_tip ? u_tip + ',  ' : u_tip;
      u_tip += _comment + _u.i18n("abb_comments_timeline");
    }
    if (_direct) {
      u_tip = u_tip ? u_tip + ',  ' : u_tip;
      u_tip += _direct + _u.i18n("abb_direct_message");
    }
    if (u_tip) {
      u_tip = '(' + T_NAMES[user.blogType] + ')' + user.screen_name + ': ' + u_tip;
    }
    if (tip && u_tip) {
      tip += '\r\n';
    }
    tip = tip + u_tip;
  }
  
  return tip;
}

// 获取上次选择的发送账号
function getLastSendAccounts() {
  return localStorage.getObject(LAST_SELECTED_SEND_ACCOUNTS) || '';
}

//-- 信息提示模式 (alert or dnd ) --
function getAlertMode() {
  var mode = localStorage.getObject(ALERT_MODE_KEY);
  return mode || 'alert';
}

function setAlertMode(mode) {
  localStorage.setObject(ALERT_MODE_KEY, mode);
}
//<<--

//-- 新信息是否自动插入，默认不自动插入 --
function getAutoInsertMode() {
  var mode = localStorage.getObject(AUTO_INSERT_MODE_KEY);
  return mode || 'notautoinsert';
}

// 判断是否非自动插入模式
function isNotAutoInsertMode() {
  return getAutoInsertMode() === 'notautoinsert';
}

function setAutoInsertMode(mode) {
  localStorage.setObject(AUTO_INSERT_MODE_KEY, mode);
}
//<<--

var _bg_view = null;
function getBackgroundView() {
  if (!_bg_view) {
    _bg_view = chrome.extension.getBackgroundPage();
    if (!_bg_view) {
      var views = chrome.extension.getViews({});
      for (var i = 0, l = views.length; i < l; i++) {
        var view = views[i];
        if (view.theViewName && view.theViewName === 'background') {
          _bg_view = view;
          break;
        }
      }
    }
  }
  return _bg_view;
}

function getPopupView() {
  var views = chrome.extension.getViews({});
  for (var i = 0, l = views.length; i < l; i++) {
    var view = views[i];
    if (view.theViewName && view.theViewName === 'popup') {
      return view;
    }
  }
  return null;
}

//获取弹出窗的popup view
function getNewWinPopupView() {
  var views = chrome.extension.getViews({});
  for (var i = 0, l = views.length; i < l; i++) {
    var view = views[i];
    if (view.is_new_win_popup) {
      return view;
    }
  }
  return null;
}

//格式化时间输出。示例：new Date().format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function (format) {
  var o = {
    "M+" : this.getMonth() + 1, //month
    "d+" : this.getDate(),    //day
    "h+" : this.getHours(),   //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
    "S" : this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

// 存储
Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
  var v = this.getItem(key);
  if (v) {
    try {
      v = JSON.parse(v);
    } catch (err) {
      v = null;
    }
  }
  return v;
};

/**
 * 格式化字符串 from tbra
 * eg:
 *  formatText('{0}天有{1}个小时', [1, 24]) 
 *  or
 *  formatText('{{day}}天有{{hour}}个小时', {day:1, hour:24}}
 * @param {String} msg
 * @param {Object} values
 */
function formatText(msg, values, filter) {
  var pattern = /\{\{([\w\s\.\(\)"',-\[\]]+)?\}\}/g;
  return msg.replace(pattern, function (match, key) {
    var value = values[key] || eval('(values.' + key + ')');
    if (typeof filter === 'function') {
      return filter(value, key);
    }
    return value;
  });
}

// 让所有字符串拥有模板格式化
String.prototype.format = function (data) {
  return formatText(this, data);
};

String.prototype.endswith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// 为字符串增加去除所有html tag和空白的字符的方法
String.prototype.remove_html_tag = function () {
  return this.replace(/(<.*?>|&nbsp;|\s)/ig, '');
};

// HTML 编码
// test: hard code testing 。。。 '"!@#$%^&*()-=+ |][ {} ~` &&&&&amp; &lt; & C++ c++c + +c &amp;
function HTMLEnCode(str) {
  str = str || '';
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

window.htmlencode = HTMLEnCode;

// html转换为text
function htmlToText(html) {
  var tmp = document.getElementById('__htmldecode__tmp__');
  if (!tmp) {
    // 避免多次创建和销毁对象
    tmp = document.createElement("DIV");
    tmp.setAttribute('id', '__htmldecode__tmp__');
    tmp.setAttribute('style', 'display:none;');
    document.body.appendChild(tmp);
  }
  tmp.innerHTML = html;
  return tmp.innerText;
}

window.htmldecode = htmlToText;

/**
 * 链接的html 转换为 url + text, href and src
 *
 * @param {String} html
 * @return {Object}
 *  - {Strint} text
 *  - {String} [images]
 */
function linkToText(html) {
  html = html || '';
  var images = [];
  html = html.replace(/<a[^>]+href=[\'\"]([^\'\"]+)[\'\"][^>]*>([^<]*)<\/a>/ig, function (m, url, text) {
    return url + ' ' + (text || '');
  }).replace(/<img[^>]+src=[\'\"]([^\'\"]+)[\'\"]\/?>/ig, function (m, src) {
    images.push(src);
    return src;
  });
  return {
    text: htmldecode(html),
    images: images
  };
}

// UBB内容转换
function ubbCode(str) {
  if (!str) {
    return '';
  }
  var result = str;
  var reg = new RegExp("(^|[^/=\\]'\">])((www\\.|http[s]?://)[\\w\\.\\?%&\\-/#=;!\\+]+)", "ig");
  var reg2 = new RegExp("\\[url=((www\\.|http[s]?://)[\\w\\.\\?%&\\-/#=;:!\\+]+)](.+)\\[/url]", "ig");
  var tmp = reg.exec(result);
  if (tmp && tmp.length > 0) {
    result = result.replace(reg, "<a href='" + tmp[2] + "' target='_blank'>" + tmp[2] + "</a>");
  }
  tmp = reg2.exec(result);
  if (tmp && tmp.length > 0) {
    result = result.replace(reg2, "<a href='" + tmp[1] + "' target='_blank'>" + tmp[3] + "</a>");
  }
  return result;
}

// 在Chrome上输出log信息，用于调试
function log(msg) {
  console && console.log && console.log(msg);
}

// 微博字数
String.prototype.len = function () {
  return Math.round(this.replace(/[^\x00-\xff]/g, "qq").length / 2);
};

// 将字符串参数变成dict参数
// form: oauth_token_secret=a26e895ca88d3ddbb5ec4d9d1780964b&oauth_token=b7cbcc0dc5056509a6b85967639924df
// 支持完整url
function decodeForm(form) {
  var index = form.indexOf('?');
  if (index > -1) {
    form = form.substring(index + 1);
  }
  var d = {};
  var nvps = form.split('&');
  for (var n = 0; n < nvps.length; ++n) {
    var nvp = nvps[n];
    if (!nvp) {
      continue;
    }
    var equals = nvp.indexOf('=');
    if (equals < 0) {
      d[nvp] = null;
    } else {
      d[nvp.substring(0, equals)] = decodeURIComponent(nvp.substring(equals + 1));
    }
  }
  return d;
}

// 获取一个字典的长度
function getDictLength(d) {
  var length = d.length;
  if (length === undefined) {
    length = 0;
    for (var i in d) {
      length++;
    }
  }
  return length;
}

/**
 * 根据maxid删除重复的数据
 *
 * @param {Array}datas
 * @param {String}max_id
 * @param {Boolean}append
 *  如果append == true, 判断最后一个等于最大id的，将它和它前面的删除，twitter很强大，id大到js无法计算
 *  否则为prepend，判断最后一个等于最大id的，将它和它后面的删除
 * @return {Object}
 * @api public
 */
function filterDatasByMaxId(datas, max_id, append) {
  var news = datas, olds = [];
  if (max_id && datas && datas.length > 0) {
    max_id = String(max_id);
    var found_index = null;
    $.each(datas, function (i, item) {
      if (max_id === String(item.id)) {
        found_index = i;
        return false;
      }
    });
    if (found_index !== null) {
      if (append) {
        // id等于最大id的数据位于found_index，所以获取found_index+1开始往后的数据
        news = datas.slice(found_index + 1);
        olds = datas.slice(0, found_index + 1);
      } else {
        // 如果不是append的，id等于最大id的数据位于found_index，
        // 只需要从开始到found_index(不包含结束边界)
        news = datas.slice(0, found_index);
        olds = datas.slice(found_index);
      }
    }
  }
  return {news: news, olds: olds};
}

//检查是否支持Twitter
//function checkTwitterEnabled(){
//    if(_u.i18n("language")!='zh_CN'){ return; }
//    var _sets = localStorage.getObject(SETTINGS_KEY);
//    _sets = _sets || {};
//    if(!_sets.twitterEnabled){
//        delete T_NAMES.twitter;
//    }
//};
//checkTwitterEnabled();

/*
* 缓动函数
* t: current time（当前时间）；
* b: beginning value（初始值）；
* c: change in value（变化量）；
* d: duration（持续时间）。
*/
var Tween = {
  Quad: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      }
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  },
  Cubic: {
    easeIn: function (t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function (t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function (t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      }
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
  },
  Quart: {
      easeIn: function(t,b,c,d){
          return c*(t/=d)*t*t*t + b;
      },
      easeOut: function(t,b,c,d){
          return -c * ((t=t/d-1)*t*t*t - 1) + b;
      },
      easeInOut: function(t,b,c,d){
          if ((t/=d/2) < 1) {
              return c/2*t*t*t*t + b;
          }
          return -c/2 * ((t-=2)*t*t*t - 2) + b;
      }
  },
  Quint: {
      easeIn: function(t,b,c,d){
          return c*(t/=d)*t*t*t*t + b;
      },
      easeOut: function(t,b,c,d){
          return c*((t=t/d-1)*t*t*t*t + 1) + b;
      },
      easeInOut: function(t,b,c,d){
          if ((t/=d/2) < 1) {
              return c/2*t*t*t*t*t + b;
          }
          return c/2*((t-=2)*t*t*t*t + 2) + b;
      }
  },
  Sine: {
      easeIn: function(t,b,c,d){
          return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
      },
      easeOut: function(t,b,c,d){
          return c * Math.sin(t/d * (Math.PI/2)) + b;
      },
      easeInOut: function(t,b,c,d){
          return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
      }
  },
  Expo: {
      easeIn: function(t,b,c,d){
          return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
      },
      easeOut: function(t,b,c,d){
          return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
      },
      easeInOut: function(t,b,c,d){
          if (t==0) return b;
          if (t==d) return b+c;
          if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
          return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
  },
  Circ: {
      easeIn: function(t,b,c,d){
          return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
      },
      easeOut: function(t,b,c,d){
          return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
      },
      easeInOut: function(t,b,c,d){
          if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
          return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
      }
  },
  Elastic: {
      easeIn: function(t,b,c,d,a,p){
          if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
          if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
          else var s = p/(2*Math.PI) * Math.asin (c/a);
          return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      },
      easeOut: function(t,b,c,d,a,p){
          if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
          if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
          else var s = p/(2*Math.PI) * Math.asin (c/a);
          return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
      },
      easeInOut: function(t,b,c,d,a,p){
          if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
          if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
          else var s = p/(2*Math.PI) * Math.asin (c/a);
          if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
          return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
      }
  },
  Back: {
      easeIn: function(t,b,c,d,s){
          if (s == undefined) s = 1.70158;
          return c*(t/=d)*t*((s+1)*t - s) + b;
      },
      easeOut: function(t,b,c,d,s){
          if (s == undefined) s = 1.70158;
          return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
      },
      easeInOut: function(t,b,c,d,s){
          if (s == undefined) s = 1.70158; 
          if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
          return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
      }
  },
  Bounce: {
      easeIn: function(t,b,c,d){
          return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
      },
      easeOut: function(t,b,c,d){
          if ((t/=d) < (1/2.75)) {
              return c*(7.5625*t*t) + b;
          } else if (t < (2/2.75)) {
              return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
          } else if (t < (2.5/2.75)) {
              return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
          } else {
              return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
          }
      },
      easeInOut: function(t,b,c,d){
          if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
          else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
      }
  }
};

// getPageScroll() by quirksmode.com
function getPageScroll() {
  var xScroll, yScroll;
  if (self.pageYOffset) {
    yScroll = self.pageYOffset;
    xScroll = self.pageXOffset;
  } else if (document.documentElement && document.documentElement.scrollTop) {   // Explorer 6 Strict
    yScroll = document.documentElement.scrollTop;
    xScroll = document.documentElement.scrollLeft;
  } else if (document.body) {// all other Explorers
    yScroll = document.body.scrollTop;
    xScroll = document.body.scrollLeft; 
  }
  return new Array(xScroll,yScroll);
};

  // Adapted from getPageSize() by quirksmode.com
function getPageHeight() {
  var windowHeight;
  if (self.innerHeight) { // all except Explorer
    windowHeight = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
    windowHeight = document.documentElement.clientHeight;
  } else if (document.body) { // other Explorers
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
};

//浮动层
var popupBox = {
  tp: '<div id="popup_box">' +
      '<div class="pb_title clearFix"><span class="t"></span><a href="" class="pb_close">'+ _u.i18n("comm_close") +'</a></div>' +
      '<div class="pb_content"></div>' +
    '</div>' +
    '<div id="popup_box_overlay"></di>',
  box: null,
  checkBox: function () {
    if (this.box) {
      return this;
    }
    $("body div:eq(0)").append(this.tp);
    this.box = $("#popup_box");
    this.box.find('.pb_close').click(popupBox.close.bind(popupBox));
    this.overlay = $("#popup_box_overlay ");
    return this;
  },
  close: function () {
    this.box.hide();
    this.overlay.hide();
    // resize height, fixed scroll 
    $('.list_warp').css('height', (window.innerHeight - 70) + 'px');
    return false;
  },
    show: function (img_width, img_height){
        this.overlay.show();
        var w = img_width;
        if(w){
            var max_w = Number($("#facebox_see_img").css('max-width').replace('px', '')) + 10;
            w = Math.min(w, max_w);
        }else{
            w = this.box.width();
        }
        var h = img_height;
        if(!h){
            h = this.box.height();
        }
        this.box.css({
          top: getPageScroll()[1] + (Math.max(10, $("body").height() / 2 - h / 2)),
          left: $("body").width() / 2 - w / 2 - 2 - 20
        }).show();
        $("body").scrollTop(1); //防止图片拉到底部关闭再打开无法滚动的问题
    },
    showOverlay: function () {},
    showImg: function (imgSrc, original, callbackFn) {
      this.checkBox();
      var image = new Image();
      image.onload = function () {
        popupBox.showOverlay();
        if (original) {
          popupBox.box.find('.pb_title .t, .pb_footer .t').html('<a target="_blank" href="' + original +'">'+ _u.i18n("comm_show_original_pic") +'</a>');
        } else {
          popupBox.box.find('.pb_title .t, .pb_footer .t').html('');
        }
        popupBox.box.find('.pb_content').html('<div class="image"><span class="rotate_btn">'
          + '<a href="javascript:" onclick="$(\'#facebox_see_img\').rotateLeft(90);popupBox.show();"><img src="/images/rotate_l.png"></a>'
          + '<a href="javascript:" onclick="$(\'#facebox_see_img\').rotateRight(90);popupBox.show();" style="margin-left:10px;"><img src="/images/rotate_r.png"></a></span>'
          + '<img id="facebox_see_img" src="' + image.src + '" class="cur_min" /></div>');
        $('#facebox_see_img').click(popupBox.close.bind(popupBox));
        popupBox.show(image.width, image.height);
        image.onload = null;
        image.onerror = null;
        if (callbackFn) { 
          callbackFn('success');
        }
      };
      image.onerror = function () {
        image.onload = null;
        image.onerror = null;
        if (callbackFn) { 
          callbackFn('error'); 
        }
      };
      image.src = imgSrc;
    },
    showMap: function(user_img, myLatitude, myLongitude, geo_info){
        this.checkBox();
        var latlng = new google.maps.LatLng(myLatitude, myLongitude);
        var myOptions = {
          zoom: 13,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map_canvas = $("#pb_map_canvas");
        if(!map_canvas.length){
            this.box.find('.pb_content').html('<div id="pb_map_canvas"></div>');
            map_canvas = $("#pb_map_canvas");
        }
        popupBox.show();
        var map = new google.maps.Map(map_canvas[0], myOptions);
        var marker = new google.maps.Marker({map: map, position:latlng});
        

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': latlng}, function(results, status) {//根据经纬度查找地理位置
            if (status == google.maps.GeocoderStatus.OK) {//判断查找状态
                if (results[0]) {//查找成功
                    /*
                        InfoWindow 信息窗口类。显示标记位置的信息
                    */
                  var address = results[0].formatted_address;
                  if(geo_info) {
                    if(geo_info.ip) {
                      address += '<br/>IP: ' + geo_info.ip;
                    }
                    if(geo_info.more) {
                      address += '<br/>ISP: ' + geo_info.more;
                    }
                  }
                    var infowindow = new google.maps.InfoWindow({
                        content: '<img class="map_user_icon" src="'+user_img+'" />' + address,
                        maxWidth: 60
                    });
                    infowindow.open(map, marker);//打开信息窗口。一般与map和标记关联
                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map,marker);
                    });
                }
            } else {
                showMsg("Geocoder failed due to: " + status, true);
            }
        });
    },
    showVideo: function (url, playcode) {
      this.checkBox();
      popupBox.box.find('.pb_title .t, .pb_footer .t').html('<a target="_blank" href="' + url +'">'+ _u.i18n("comm_show_original_vedio") +'</a>');
      popupBox.box.find('.pb_content').html(playcode);
      popupBox.show();
    },
    showHtmlBox: function (title, content){
      this.checkBox();
      popupBox.box.find('.pb_title .t, .pb_footer .t').html(title);
      popupBox.box.find('.pb_content').html(content);
      popupBox.show();
    }
};

var UrlUtil = {
  domainRe: /^https?:\/\/([^\/]+)/i,
  getDomain: function (url) {
    if (url && url.match) {
      var m = url.match(UrlUtil.domainRe);
      if (m) {
        return m[1];
      }
    }
    if (url && !url.match) {
      console.log('getDomain = > url.match', url);
    }
    return '';
  },
  urlRe: new RegExp('(?:\\[url\\s*=\\s*|)((?:www\\.|http[s]?://)[\\w\\.\\?%&\\-/#=;:!\\+~]+)(?:\\](.+)\\[/url\\]|)', 'ig'),
  findUrls: function (text) {
    return text.match(this.urlRe);
  },
  showFaviconBefore: function (ele, url) {
    var domain = UrlUtil.getDomain(url);
    if (domain) {
      $(ele).addClass('favicons_ico').css('background-image',
        'url(https://www.google.com/s2/favicons?domain=' + domain + ')');
    }
  }
};

// shorturl
var ShortenUrl = {
  SHORT_SERVICE_RE: /(goo\.gl|t\.co|bit\.ly|lnk\.by|fa\.by|v\.gd|is\.gd|s8\.hk|seso\.me|tinyurl\.com|to\.ly|zi\.mu|2\.ly|aa\.cx|2br\.in)/i,
  services: {
    // http://api.t.sina.com.cn/short_url/shorten.json?source=3538199806&url_long=http://www.tudou.com/programs/view/cl_8vhHMCfs/
    't.cn': {
      api: 'http://api.t.sina.com.cn/short_url/shorten.json?source=3434422667',
      format: 'json', 
      method: 'get',
      param_name: 'url_long',
      result_callback: function (data) {
        if (data && data.length === 1) {
          data = data[0];
        }
        return data ? data.url_short : null;
      }
    },
    'goo.gl': {
      api: 'http://goo.gl/api/url', 
      format: 'json', 
      method: 'post', 
      param_name: 'url', 
      result_name: 'short_url'
    },
    'seso.me': 'http://seso.me/api/?longurl={{url}}',
    'tinyurl.com': 'http://tinyurl.com/api-create.php?url={{url}}',
    'to.ly': 'http://to.ly/api.php?longurl={{url}}',
    'fa.by': 'http://fa.by/?module=ShortURL&file=Add&mode=API&url={{url}}',
    'lnk.by': {
      api: 'http://lnk.by/Shorten', 
      format_name: 'format', 
      format: 'json', 
      method: 'get', 
      param_name: 'url', 
      result_name: 'shortUrl'
    },
    'bit.ly': {
      api: 'http://api.bitly.com/v3/shorten?login=fengmk2&apiKey=R_da317e9fbaebee684da33d1237adf853&format=json',
      format: 'json', 
      method: 'get',
      param_name: 'longUrl',
      result_callback: function (data) {
        if (data && data.data) {
          data = data.data;
        }
        return data ? data.url : null;
      }
    },
  },
  // 还原
  // http://urlexpand0-55.appspot.com/api?u=http://is.gd/imWyT
  // MAX_INDEX => http://yongwo.de:1235/api?u=http://is.gd/imWyT&cb=foo
  MAX_INDEX: 56,
  expand: function (shorturl, callback, context) {
    if (shorturl && shorturl.indexOf('http://url.cn/') === 0) {
      // $.ajax({
      //   url: 'http://urlrar.cnodejs.net/?u=' + encodeURIComponent(shorturl),
      //   dataType: 'json',
      //   success: function (data, status, xhr) {
      //     callback.call(context, data);
      //   }, 
      //   error: function (xhr, status) {
      //     callback.call(context, null);
      //   }
      // });
      return callback.call(context, null);
    }
    // https://api.weibo.com/2/short_url/expand.json?source=3538199806&url_short=http%3A%2F%2Ft.cn%2Fz8eoJEr&url_short=http://t.cn/z8eEL2B
    if (shorturl && shorturl.indexOf('http://t.cn/') === 0) {
      $.ajax({
        url: 'https://api.weibo.com/2/short_url/expand.json?source=3538199806&url_short=' + encodeURIComponent(shorturl),
        dataType: 'json',
        success: function (data, status, xhr) {
          var info = {url: null};
          if (data && data.urls && data.urls[0]) {
            info.url = data.urls[0].url_long;
          }
          callback.call(context, info);
        }, 
        error: function (xhr, status) {
          callback.call(context, null);
        }
      });
      return;
    }
    callback(context,{'url':shorturl});//暂时屏蔽短链解析
    //this._expand(shorturl, callback, context);
  },
  
  _expand: function (shorturl, callback, context) {
    // var url = 'http://api.yongwo.de/api/e?f=json&u=' + shorturl;
    var url = 'http://api.longurl.org/v2/expand?format=json&title=1&url=' + encodeURIComponent(shorturl);
    // {"long-url":"http:\/\/www.douban.com\/event\/16186934\/","content-type":"text\/html; charset=utf-8","response-code":"200","title":"\u8c46\u74e3-\u4ed6\u4e61\u65e2\u543e\u57ce\u2014\u9053\u683c.\u6851\u5fb7\u65af\u4e0e\u718a\u57f9\u4e91\u5bf9\u8c08"}
    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data) {
          data.url = data['long-url'];
        }
        callback.call(context, data);
      }, 
      error: function (xhr, status) {
        callback.call(context, null);
      }
    });
  },
  
  SINAURL_RE: /http:\/\/(?:t|sinaurl)\.cn\/(\w+)/i,
  // 新浪短址特殊处理
  // http://t.sina.com.cn/mblog/sinaurl_info.php?url=h6yl4g
  expand_sinaurl: function (shorturl, callback, context) {
    var m = this.SINAURL_RE.exec(shorturl);
    if (!m) {
      return callback.call(context, null);
    }
    var id = m[1];
    $.ajax({
      url: 'http://weibo.com/mblog/sinaurl_info.php?url=' + id,
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.data) {
          data = data.data[id];
        }
        callback.call(context, data);
      }, 
      error: function (xhr, status) {
        if (status === 'parsererror') {
          // 使用了新版本的新浪微博，无法调用还原接口
          var b_view = getBackgroundView();
          b_view.__enable_expand_sinaurl = false;
        }
        callback.call(context, null);
      }
    });
  },
  
  expandAll: function () {
    var conditions = '.short_done';
    var selector = 'a.link:not(' + conditions + ')';
    var config = tapi.get_config(getUser());
    if (!config.need_processMsg) {
      selector += ', .tweet_text a:not(' + conditions + ')';
    }
    var that = this;
    var tweetCache = window.TWEETS || {};
    $(selector).each(function () {
      var $this = $(this);
      var url = $this.attr('href');
      if (url.length < 10 || url.indexOf('javascript:') >= 0) {
        if (url === '#') {
          // 豆瓣电台的推荐链接无法点击
          // http://api.douban.com/recommendation/89139831
          // => search http://music.douban.com/subject_search?search_text=%E3%80%8A%E4%B8%80%E7%94%9F%E6%89%80%E7%88%B1%E3%80%8B+-+%E5%8D%A2%E5%86%A0%E5%BB%B7
          $this.attr('href', 'javascript:;').addClass('short_done');;
        }
        return;
      }
      if (VideoService.attempt(url, this) || ImageService.attempt(url, this) || url.length > 30) {
        // 无需还原
        UrlUtil.showFaviconBefore(this, url);
        $this.addClass('short_done');
        return;
      }
      var $tweetItem = $this.parents('.tweetItem:first');
      var tid = $tweetItem.attr('id').substring(5);
      var status = tweetCache[tid];
      if (!status) {
        // console.log('no status', $tweetItem, url);
        return;
      }
      status.urlCache = status.urlCache || {};
      var data = status.urlCache[url];
      if (data && data.url) {
        that._format_link(this, url, data.url, data);
      } else {
        ShortenUrl.expand(url, function (data) {
          var longurl = data ? data.url : null;
          if (longurl) {
            status.urlCache[url] = data;
            that._format_link(this, url, longurl, data);
          }
        }, this);
      }
    });
  },
  _format_link: function (ele, url, longurl, data) {
    var title = _u.i18n("comm_mbright_to_open") + ' ' + longurl;
    if (data && data.title) {
      title += ' (' + data.title + ')';
    }
    var attrs = {
      title:  title,
      rhref: longurl
    };
    $(ele).attr(attrs).addClass('longurl short_done');
    UrlUtil.showFaviconBefore(ele, longurl);
    if (!VideoService.attempt(data, ele)) {
      ImageService.attempt({url: longurl, sourcelink: url}, ele);
    }
  },
  
  short: function (longurl, callback, name, context) {
    var name = name || Settings.get().shorten_url_service;
    var service = this.services[name];
    var format = 'text';
    var format_name = null;
    var method = 'get';
    var data = {};
    var result_name = null, result_callback = null;
    if (typeof service !== 'string') {
      format_name = service.format_name || format_name;
      format = service.format || format;
      method = service.method || method;
      data[service.param_name] = longurl;
      if (format_name) {
        data[format_name] = format;
      }
      result_name = service.result_name;
      result_callback = service.result_callback;
      if (name === 'goo.gl') {
        data.user = 'toolbar@google.com';
        data.auth_token = this._create_googl_auth_token(longurl);
      }
      service = service.api;
    } else {
      service = service.format({url: encodeURIComponent(longurl)});
    }
    $.ajax({
      url: service,
      type: method,
      data: data,
      dataType: format,
      success: function (data, status, xhr) {
        if (result_callback) {
          data = result_callback(data);
        } else if (result_name) {
          data = data[result_name];
        }
        callback.call(context, data);
      }, 
      error: function (xhr, status) {
        callback.call(context, null);
      }
    });
  },
  
  // goo.gl的认证token计算函数
  _create_googl_auth_token: function(f){function k(){for(var c=0,b=0;b<arguments.length;b++)c=c+arguments[b]&4294967295;return c}function m(c){c=c=String(c>0?c:c+4294967296);var b;b=c;for(var d=0,i=false,j=b.length-1;j>=0;--j){var g=Number(b.charAt(j));if(i){g*=2;d+=Math.floor(g/10)+g%10}else d+=g;i=!i}b=b=d%10;d=0;if(b!=0){d=10-b;if(c.length%2==1){if(d%2==1)d+=9;d/=2;}}b=String(d);b+=c;return b;}function n(c){for(var b=5381,d=0;d<c.length;d++)b=k(b<<5,b,c.charCodeAt(d));return b;}function o(c){for(var b=0,d=0;d<c.length;d++)b=k(c.charCodeAt(d),b<<6,b<<16,-b);return b;}f={byteArray_:f,charCodeAt:function(c){return this.byteArray_[c];}};f.length=f.byteArray_.length;var e=n(f.byteArray_);e=e>>2&1073741823;e=e>>4&67108800|e&63;e=e>>4&4193280|e&1023;e=e>>4&245760|e&16383;var l="7";f=o(f.byteArray_);var h=(e>>2&15)<<4|f&15;h|=(e>>6&15)<<12|(f>>8&15)<<8;h|=(e>>10&15)<<20|(f>>16&15)<<16;h|=(e>>14&15)<<28|(f>>24&15)<<24;l+=m(h);return l;}
};

var FanfouImage = {
  host: 'fanfou.com',
  url_re: /fanfou\.com\/photo\/\w+/i,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var src = $(html).find('#photo img').attr('src');
        if (src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('/n0/', '/s0/'),
          bmiddle_pic: src,
          original_pic: src
        };
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

// http://www.yupoo.com/photos/techparty/81756954/zoom/small/
// http://www.yupoo.com/photos/techparty/81756954/
// http://photo.yupoo.com/techparty/BckmKZdN/medish.jpg
var Yupoo = {
  host: 'yupoo.com',
  url_re: /yupoo\.com\/photos\//i,
  show_link: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var src = $(html).find('#photo_img').attr('src');
        if (src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('medish.', 'small.'),
          bmiddle_pic: src.replace('medish.', 'medium.'),
          original_pic: src
        };
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

// 查看豆瓣预览图
var DoubanImage = {
  /**
   * http://movie.douban.com/subject/4286017/ 
=>
<div id="mainpic"> 
      <a class="nbg" href="http://movie.douban.com/subject/4286017/photos?type=R" title="点击看更多海报"> 
      <img src="http://img3.douban.com/mpic/s4672723.jpg" title="点击看更多海报" alt="Fast Five" rel="v:image" /> 
      </a><br /> 

  </div> 
=>
http://img3.douban.com/mpic/s4672723.jpg
http://img3.douban.com/lpic/s4672723.jpg
=> 
http://img3.douban.com/spic/s4672723.jpg
http://img3.douban.com/opic/s4672723.jpg

http://code.google.com/p/falang/issues/detail?id=235
   * 
   */
  host: 'douban.com',
  url_re: /http:\/\/(?:(?:book|music|movie)\.douban\.com\/subject\/.+|www\.douban.com\/.+?\/photo\/)/i,
  image_url_re: /com\/([mlso]pic)\//i,
  photos_re: /\/photo\/(\d+)\//i,
  show_link: true, 
  need_sourcelink: true, // RT的时候，需要原始链接
  sync: true,
  get: function (url, callback) {
    var photo_matchs = this.photos_re.exec(url);
    if (photo_matchs) {
      var id = photo_matchs[1];
      return callback({
        thumbnail_pic: 'http://img3.douban.com/view/photo/thumb/public/p' + id + '.jpg',
        bmiddle_pic: 'http://img3.douban.com/view/photo/photo/public/p' + id + '.jpg',
        original_pic: 'http://img3.douban.com/view/photo/photo/public/p' + id + '.jpg'
      });
    }
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var src = $(html).find('#mainpic img').attr('src');
        var pics = null;
        if (src) {
          var matchs = DoubanImage.image_url_re.exec(src);
          if (matchs) {
            var size = matchs[1];
            pics = {
              thumbnail_pic: src.replace(size, 'mpic'),
              bmiddle_pic: src.replace(size, 'lpic'),
              original_pic: src.replace(size, 'opic')
            };
            bg.IMAGE_URLS[url] = pics;
          }
        }
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

// http://campl.us/dcEN
// http://code.google.com/p/falang/issues/detail?id=190
var Camplus = {
  host: 'campl.us',
  url_re: /http:\/\/campl\.us\/\w+$/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('.tweetContents').text();
        var src = $doc.find('img.photo').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('/f/', '/t/'),
          bmiddle_pic: src.replace('/f/', '/iphone/'),
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

var Nodebox = {
  host: 'nfs.nodeblog.org',
  url_re: /http:\/\/nfs\.nodeblog.org\/\w\/\w\/\w+\.(jpg|png|bmp|gif|webp|jpeg)/i,
  sync: true,
  get: function (url, callback) {
    var pics = {
      thumbnail_pic: url,
      bmiddle_pic: url,
      original_pic: url
    };
    callback(pics);
  },
  upload: function (data, pic, callback, onprogress, context) {
    var url = 'http://upload.nodeblog.org/store';
    pic.keyname = 'file';
    var blob = build_upload_params(data, pic);
    $.ajax({
      url: url,
      data: blob,
      type: 'post',
      dataType: 'json',
      contentType: blob.contentType,
      processData: false,
      xhr: xhr_provider(onprogress),
      success: function (result) {
        var error = null, info = null;
        if (result.success) {
          info = result.payload;
        } else {
          error = new Error(JSON.stringify(result));
        }
        callback.call(context, error, info);
      },
      error: function (xhr, status, err) {
        callback.call(context, err);
      }
    });
  }
};

// http://imm.io/api/
// http://imm.io/7BhM
var Immio = {
  host: 'imm.io',
  url_re: /http:\/\/imm\.io\/\w+$/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('#name_in').text();
        var src = $doc.find('.view img').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src,
          bmiddle_pic: src,
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  },
  upload: function (data, pic, callback, onprogress, context) {
    var url = 'http://imm.io/store/';
    pic.keyname = 'image';
    var blob = build_upload_params(data, pic);
    $.ajax({
      url: url,
      data: blob,
      type: 'post',
      dataType: 'json',
      contentType: blob.contentType,
      processData: false,
      xhr: xhr_provider(onprogress),
      success: function (result) {
        var error = null, info = null;
        if (result.success) {
          info = result.payload;
        } else {
          error = new Error(JSON.stringify(result));
        }
        callback.call(context, error, info);
      },
      error: function (xhr, status, err) {
        callback.call(context, err);
      }
    });
  }
};

// http://code.google.com/p/falang/issues/detail?id=244
// http://picplz.com/user/martinisantos/pic/hg5wl/
// http://picplz.com/tlzl
var Picplz = {
  host: 'picplz.com',
  url_re: /http:\/\/picplz\.com\/([\w\-\=]+$|user\/\w+\/\w+)/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var $img = $doc.find('#mainImage');
        var src = $img.attr('src'), caption = $img.attr('alt');
        if (!src) {
          return callback();
        }
        // http://s2.i1.picplzthumbs.com/upload/img/13/3d/bc/133dbcf42367a8caa25bd95758967a7c2e3f3968_wmeg_00001.jpg
        // => 
        // http://s2.i1.picplzthumbs.com/upload/img/13/3d/bc/133dbcf42367a8caa25bd95758967a7c2e3f3968_t100s_00001.jpg
        var pics = {
          thumbnail_pic: src.replace('_wmeg', '_t100s'),
          bmiddle_pic: src,
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

// 500px.com
// <meta property="twitter:image" value="http://pcdn.500px.net/9764657/cf5ebc22afbc927a462c3f10cdf660484ebe7735/4.jpg" />
// http://pcdn.500px.net/9764657/cf5ebc22afbc927a462c3f10cdf660484ebe7735/4.jpg
// http://pcdn.500px.net/9764657/cf5ebc22afbc927a462c3f10cdf660484ebe7735/3.jpg
// http://pcdn.500px.net/9764657/cf5ebc22afbc927a462c3f10cdf660484ebe7735/2.jpg
var PX500 = {
  host: '500px.com',
  url_re: /http:\/\/(500px\.com)\/photo\/\w+/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var img = $doc.find('#mainphoto');
        var caption = img.attr('alt');
        var src = img.attr('src');
        if (!src) {
          return callback();
        }
        var imageurl = src.substring(0, src.lastIndexOf('/') + 1);
        var pics = {
          thumbnail_pic: imageurl + '2.jpg',
          bmiddle_pic: src,
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

// <meta property="og:image" content="http://media-cache-ec3.pinterest.com/upload/168392473538059182_30On7yco_c.jpg"/>
// http://media-cache-ec3.pinterest.com/upload/168392473538059182_30On7yco_b.jpg
var Pinterest = {
  host: 'pinterest.com',
  url_re: /http:\/\/(pinterest\.com)\/pin\/\w+/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('#PinCaption').text();
        var src = $doc.find('#pinCloseupImage').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('_c.', '_b.'),
          bmiddle_pic: src,
          original_pic: src.replace('_c.', '.')
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

var Vida = {
  /* 
   * http://vida.fm/activities/1015197?utm_source=weibo
   * =>
   * big: <img alt="5b1ef212-a198-11e1-b020-180373f6dd13_l" class="photo-view" src="http://pics.vida.fm/14/2310/5b1ef212-a198-11e1-b020-180373f6dd13_l" /> 
   * middle: http://pics.vida.fm/14/2310/5b1ef212-a198-11e1-b020-180373f6dd13_m
   * small: http://pics.vida.fm/14/2310/5b1ef212-a198-11e1-b020-180373f6dd13_s
   */
  host: 'vida.fm',
  url_re: /http:\/\/(vida\.fm)\/activities\/\w+/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('#activity-info .box-content').text();
        var src = $doc.find('img.photo-view').attr('src');
        if (!src) {
          return callback();
        }
        var imageurl = src.substring(0, src.length - 1);
        var pics = {
          thumbnail_pic: imageurl + 's',
          bmiddle_pic: imageurl + 'm',
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function () {
        callback();
      }
    });
  }
};

var ViaMe = {
  /* 
   * http://via.me/-2nk92uu
   * =>
   * big: <meta content='http://s3.amazonaws.com/com.clixtr.picbounce/photos/bed66e50-a649-012f-176e-12313813318b/s600x600.jpg' property='og:image'>
   * middle: "thumb_url":"http://img.via.me/photos/3bf36070-631f-012f-d369-12313920881f/s150x150.jpg",
   * small: "thumb_url":"http://img.via.me/photos/3bf36070-631f-012f-d369-12313920881f/s150x150.jpg",
   */
  host: 'via.me',
  url_re: /http:\/\/(via\.me)\/\-\w+/i,
  show_link: true,
  sync: true,
  IMAGE_RE: /<meta\scontent=\'([^\']+)\'\sproperty=\'og:image\'>/,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var m = ViaMe.IMAGE_RE.exec(html);
        var caption = null;
        var src = m && m[1];
        if (src) {
          var imageurl = src.substring(0, src.lastIndexOf('/'));
          var ext = src.substring(src.lastIndexOf('.'));
          var original_pic = imageurl + '/r600x600' + ext;
          var pics = {
            thumbnail_pic: imageurl + '/s150x150' + ext,
            bmiddle_pic: original_pic,
            original_pic: original_pic
          };
          if (caption) {
            pics.caption = caption.trim();
          }
          bg.IMAGE_URLS[url] = pics;
          callback(pics);
        } else {
          callback();
        }
      },
      error: function () {
        callback();
      }
    });
  }
};

/**
 * Facebook photo preview
 *
 * https://www.facebook.com/photo.php?pid=10703372&l=eea56fa638&id=700845856
 * =>
 * large: https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/s720x720/553543_10151176931010857_810090458_n.jpg
 * middle: @large
 * small: https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/s720x720/553543_10151176931010857_810090458_a.jpg
 */
var FacebookPhoto = {
  host: 'www.facebook.com',
  url_re: /www\.facebook\.com\/photo\.php\?/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('.fbPhotoPageCaption').text().trim();
        var src = $doc.find('.fbPhotoImage').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('_n.', '_a.'),
          bmiddle_pic: src,
          original_pic: src
        };
        if (caption) {
          pics.caption = caption;
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function() {
        callback();
      }
    });
  }
};

// http://v.163.com/zongyi/V6LQSJ9UN/V87BC68HL.html
// <source src="http://flv.bn.netease.com/tvmrepo/2012/8/0/G/E87BC4R0G-mobile.mp4" type="video/mp4">
// coverpic=http://vimg1.ws.126.net/image/snapshot/2012/8/H/C/V87BC63HC.jpg&
var Video163 = {
  host: 'v.163.com',
  url_re: /v(?:\.2012)?\.163\.com\/.*?\/\w+\.htm/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.get(url, function (data) {
      var image_re = /coverpic=(http.*?\.(?:jpg|png|gif))/i;
      var m = image_re.exec(data);
      if (!m) {
        return callback();
      }
      var caption = $(data).find('h1').text();
      var image = m[1];
      var pics = {
        thumbnail_pic: image,
        bmiddle_pic: image,
        original_pic: image,
        caption: caption
      };
      bg.IMAGE_URLS[url] = pics;
      callback(pics);
      // var source_re = /src=["']([^"']+?\-mobile\.mp4)["']/i;
      // m = source_re.exec(data);
      // if (!m) {
      //   return callback(null, imageURL);
      // }
      // var html = '<video controls="controls" autoplay="autoplay" preload="auto"><source src="' + m[1] + '" type="video/mp4"></video>';
      // callback(html, imageURL);
    });
  }
};

var TmallPhoto = {
  /* 
   * http://detail.tmall.com/item.htm?id=22651888507
   * 
   */
  host: 'detail.tmall.com',
  url_re: /http:\/\/(detail|item)\.tmall\.com\/item\.htm/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var r = /<title>([^>]+)<\/title>/i;
        var caption = r.exec(html);
        if (caption) {
          caption = caption[1];
        }
        var src = $doc.find('#J_ZoomHook').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src + '_200x200.jpg',
          bmiddle_pic: src + '_460x460.jpg',
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function() {
        callback();
      }
    });
  }
};

var TaobaoPhoto = {
  /* 
   * http://item.taobao.com/item.htm?id=17864246024
   * 
   */
  host: 'item.taobao.com',
  url_re: /http:\/\/(detail|item)\.taobao\.com\/item\.htm/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    console.log(url)
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var r = /<title>([^>]+)<\/title>/i;
        var caption = r.exec(html);
        if (caption) {
          caption = caption[1];
        }
        var src = $doc.find('#J_ImgBooth').attr('src');
        if (!src) {
          return callback();
        }
        src = src.replace(/\_\d+x\d+\.\w+$/i, '')
        var pics = {
          thumbnail_pic: src + '_200x200.jpg',
          bmiddle_pic: src + '_460x460.jpg',
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function() {
        callback();
      }
    });
  }
};

// 图片服务
var Instagram = {
  /* 
   * http://instagr.am/p/BWp/ => 
   * big: <img src="http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_7.jpg" class="photo" /> 
   * middle: http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_6.jpg
   * small: http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_5.jpg
   * 
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_5.jpg
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_6.jpg
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_7.jpg
   * 
   * http://instagram.com/p/JEYHD/ 
   * =>
   * http://instagr.am/p/JEYHD/ 
   * 
   */
  host: 'instagr.am',
  url_re: /http:\/\/(instagr\.am|instagram\.com)\/p\//i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
        var $doc = $(html);
        var caption = $doc.find('.caption').text();
        var src = $doc.find('.photo').attr('src');
        if (!src) {
          return callback();
        }
        var pics = {
          thumbnail_pic: src.replace('_7.', '_5.'),
          bmiddle_pic: src, //src.replace('_7.', '_6.'),
          original_pic: src
        };
        if (caption) {
          pics.caption = caption.trim();
        }
        bg.IMAGE_URLS[url] = pics;
        callback(pics);
      },
      error: function() {
        callback();
      }
    });
  }
};

/**
 * 直接得到图片，无需爬页面，同步版本
 */
var Instagram2 = {
  /* 
   * big: <img src="http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_7.jpg" class="photo" /> 
   * middle: http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_6.jpg
   * small: http://distillery.s3.amazonaws.com/media/2010/10/03/ca65a1ad211140c8ac97e2d2439a1376_5.jpg
   * 
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_5.jpg
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_6.jpg
   * http://images.instagram.com/media/2011/05/20/c67a2c94bed9459ca2d398375b799219_7.jpg
   * 
   */
  host: 'instagram.com',
  url_re: /http:\/\/images\.instagram\.com\/media\/[^\_]+(\_\d\.)\w+/i,
  sync: true,
  get: function (url, callback) {
    var m = this.url_re.exec(url);
    var pics = {
      thumbnail_pic: url.replace(m[1], '_5.'),
      bmiddle_pic: url.replace(m[1], '_6.'),
      original_pic: url.replace(m[1], '_7.')
    };
    callback(pics);
  }
};

/**
 * img.ly
 *
 *   http://img.ly/lko2 => http://img.ly/show/thumb/lko2
 *   => http://img.ly/show/large/lko2
 * @type {Object}
 */
var Imgly = {
  host: 'img.ly',
  url_re: /http:\/\/img\.ly\/([^\/]+)$/i,
  sync: true,
  show_link: true,
  get: function (url, callback) {
    var m = this.url_re.exec(url);
    var id = m[1];
    var pics = {
      thumbnail_pic: 'http://img.ly/show/thumb/' + id,
      bmiddle_pic: 'http://img.ly/show/large/' + id,
      original_pic: 'http://img.ly/show/large/' + id
    };
    callback(pics);
  }
};

var Flickr = {
  host: 'www.flickr.com',
  // http://flic.kr/p/8q4MxW
  url_re: /http:\/\/(www\.flickr\.com\/photos\/\w+\/\d+|flic\.kr\/p\/[\w\-]+)/i,
  src_re: /<link\srel\=\"image\_src\"\shref\=\"([^\"]+)\"/i,
  show_link: true,
  sync: true,
  get: function (url, callback) {
    var bg = getBackgroundView();
    if (bg.IMAGE_URLS[url]) {
      return callback(bg.IMAGE_URLS[url], true);
    }
    $.ajax({
      url: url,
      success: function (html, status, xhr) {
          // <div class="photo-div"><img src="http://farm7.static.flickr.com/6133/6014360607_366de2fabe_z.jpg" alt="photo" width="640" height="424"></div>
        // _z. => _m => _b
          //
          // view-source:http://www.flickr.com/photos/nihaoblog/69881634/in/photostream/
          // => <div class="photo-div"> <img src="http://farm1.static.flickr.com/35/69881634_7f5361cf6d.jpg" alt="photo" width="500" height="375">
          // => empty => _m => _z
        var $doc = $(html);
        var caption = $doc.find('#meta h1').text();
        var src = $doc.find('.photo-div img').attr('src');
        if (src) {
          var has_big = src.indexOf('_z.') > 0;
          var pics = null;
          if (has_big) {
            pics = {
              thumbnail_pic: src.replace('_z.', '_m.'),
              bmiddle_pic: src,
              original_pic: src.replace('_z.', '_b.')
            };
          } else {
            var index = src.lastIndexOf('.');
            var u = src.substring(0, index) + '_m' + src.substring(index);
            pics = {
              thumbnail_pic: u,
              bmiddle_pic: u.replace('_m.', '_z.'),
              original_pic: src
            };
          }
          if (caption) {
            pics.caption = caption.trim();
          }
          bg.IMAGE_URLS[url] = pics;
          callback(pics);
        } else {
          callback();
        }
      },
      error: function () {
        callback();
      }
    });
  }
};


// http://dev.twitpic.com/
// http://dev.twitpic.com/docs/thumbnails/
var Twitpic = {
  /*
   * http://twitpic.com/show/thumb/1e10q
   * http://twitpic.com/show/mini/1e10q
   */
  host: 'twitpic.com',
  url_re: /http:\/\/(twitpic\.com)\/\w+/i,
  show_link: true,
  sync: true,
  get: function(url, callback) {
    var tpl = 'http://twitpic.com/show/{{size}}/{{id}}';
    var re = /twitpic.com\/(\w+)/i;
    var results = re.exec(url);
    var pics = {
      thumbnail_pic: tpl.format({size: 'thumb', id: results[1]}),
      bmiddle_pic: tpl.format({size: 'full', id: results[1]}),
      original_pic: tpl.format({size: 'full', id: results[1]})
    };
    callback(pics);
  }
};

// http://p.twipple.jp/TxSpS => http://p.twipple.jp/data/T/x/S/p/S_s.jpg
// => http://p.twipple.jp/data/T/x/S/p/S_m.jpg
// => http://p.twipple.jp/data/T/x/S/p/S.jpg
// 直接去页面获取 http://p.twipple.jp/g7G6e
var Twipple = {
  host: 'p.twipple.jp',
  url_re: /http:\/\/p\.twipple\.jp\/\w+/i,
  get: function(url, callback) {
    $.ajax({
      url: url,
      success: function(html, status, xhr) {
        var src = $(html).find('#post_image').attr('src');
        var pics = {
          thumbnail_pic: src.replace('_m.', '_s.'),
          bmiddle_pic: src,
          original_pic: src.replace('_m.', '.')
        };
        callback(pics);
      },
      error: function() {
        callback(null);
      }
    });
  }
};

var Topit = {
    host: 'topit.me',
    url_re: /topit\.me\/item\/\w+/i,
    sync: true,
    show_link: true,
    get: function(url, callback) {
        $.ajax({
            url: url,
            success: function(html, status, xhr) {
                var $a = $(html).find('#item-tip');
                var original_pic = $a.attr('href');
                var bmiddle_pic = $a.find('img').attr('src');
                var thumbnail_pic = original_pic;
                var index = thumbnail_pic.indexOf('.me/l');
                if(index > 0) {
                    index += 4;
                    thumbnail_pic = thumbnail_pic.substring(0, index) + 't' + 
                        thumbnail_pic.substring(index + 1);
                }
                var pics = {
                    thumbnail_pic: thumbnail_pic,
                    bmiddle_pic: bmiddle_pic,
                    original_pic: original_pic
                };
                callback(pics);
            },
            error: function() {
                callback(null);
            }
        });
    }
};

// https://groups.google.com/group/plixi/web/fetch-photos-from-url
var Plixi = {
  /*
   * http://api.plixi.com/api/tpapi.svc/imagefromurl?size=thumbnail&url=http://tweetphoto.com/5527850
   * http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http://tweetphoto.com/5527850
   * http://api.plixi.com/api/tpapi.svc/imagefromurl?size=big&url=http://tweetphoto.com/5527850
   */
  host: 'plixi.com',
  url_re: /http:\/\/(plixi\.com\/p|tweetphoto\.com)\//i,
  sync: true,
  get: function(url, callback) {
    var tpl = 'http://api.plixi.com/api/tpapi.svc/imagefromurl?size={{size}}&url=' + url;
    var pics = {
      thumbnail_pic: tpl.format({size: 'thumbnail'}),
      bmiddle_pic: tpl.format({size: 'medium'}),
      original_pic: url//tpl.format({size: 'big'})
    };
    callback(pics);
  }
};

// http://code.google.com/p/falang/issues/detail?id=190#makechanges
// http://img.ph.126.net/V2mX6JSNRZu_NkqIvk_kDA==/2357634404929042613.jpg#3
var Photo163 = {
    host: 'ph.126.net',
    url_re: /\.ph\.126\.net\/[\w\-\=]+\/\w+/i,
    sync: true,
    get: function(url, callback) {
        url = url.replace('#3', '');
        var pics = {
            thumbnail_pic: 'http://oimagec6.ydstatic.com/image?w=120&h=120&url=' + url,
            bmiddle_pic: url,
            original_pic: url
        };
        callback(pics);
    }
};

// http://code.google.com/p/imageshackapi/wiki/YFROGoptimizedimages
var Yfrog = {
  /*
   * http://yfrog.com/gyunmnrj:embed
   * http://yfrog.com/gyunmnrj:small
   */
  host: 'yfrog.com',
  url_re: /http:\/\/yfrog\.com\/\w+/i,
  show_link: true,
  sync: true,
  get: function(url, callback) {
    var pics = {
      thumbnail_pic: url + ':small',
      bmiddle_pic: url + ':embed',
      original_pic: url
    };
    callback(pics);
  }
};

// http://twitgoo.com/49d => http://twitgoo.com/49d/mini , http://twitgoo.com/49d/img
var Twitgoo = {
  host: 'twitgoo.com',
  url_re: /http:\/\/twitgoo\.com\/\w+/i,
  show_link: true,
  sync: true,
  get: function(url, callback) {
    var pics = {
      thumbnail_pic: url + '/mini',
      bmiddle_pic: url + '/img',
      original_pic: url + '/img'
    };
    callback(pics);
  }
};

// Add ’:full’, ‘:square’, ‘:view’, ‘:medium’, ‘:thumbnail’, or ‘:thumb’ 
// to the moby.to short url and you will be redirected to the correct image.
// http://developers.mobypicture.com/documentation/additional/inline-thumbnails/
// moby.to/sjhjvq
var MobyPicture = {
  host: 'moby.to',
  url_re: /http:\/\/(moby\.to|www\.mobypicture\.com)\/\w+/i,
  get: function (url, callback, ele) {
    if (url.indexOf('mobypicture.com') >= 0) {
      var short_url = $(ele).html();
      if (short_url.indexOf('moby.to') < 0) {
        // 如果还是不行，则直接爬页面获取
        // ajax get: <input id="bookmark_directlink" type="text" value="http://moby.to/r2g9zv"/>
        $.get(url, function (data) {
          var new_url = $(data).find('#bookmark_directlink').val();
          callback(MobyPicture._format_urls(new_url));
        });
        return; 
      }
      url = short_url;
    }
    callback(this._format_urls(url));
  },
  _format_urls: function (url) {
    if (url.indexOf('moby.to') < 0) {
      return null;
    }
    return {
      thumbnail_pic: url + ':thumb',
      bmiddle_pic: url + ':medium',
      original_pic: url + ':full'
    };
  }
};

// http://api.imgur.com/
// http://i.imgur.com/xuCIW.png or http://imgur.com/z2pX5.png
// key: cba6198873ac20498a5686839b189fc0
var Imgur = {
  host: 'imgur.com',
  url_re: /http:\/\/(i\.)?imgur\.com\/\w+\.\w+/i,
  show_link: true,
  sync: true,
  get: function(url, callback) {
    var re = /imgur.com\/(\w+)\.(\w+)/i;
    var tpl = 'http://i.imgur.com/{{word}}.{{ext}}';
    var results = re.exec(url);
    var pics = null;
    if(results) {
      var word = results[1];
      var ext = results[2];
      pics = {
        thumbnail_pic: tpl.format({word: word + 's', ext: ext}),
        bmiddle_pic: tpl.format({word: word + 'm', ext: ext}),
        original_pic: url
      };
    }
    callback(pics);
  },
  key: 'cba6198873ac20498a5686839b189fc0',
  api: 'http://imgur.com/api/upload.json'
};

var SinaImage = {
  host: 'sinaimg.cn',
  url_re: /sinaimg\.cn\/(\w+)\/\w+/i,
  sync: true,
  get: function(url, callback, ele) {
    var m = this.url_re.exec(url);
    callback({
      thumbnail_pic: url.replace(m[1], 'thumbnail'),
      bmiddle_pic: url.replace(m[1], 'bmiddle'),
      original_pic: url.replace(m[1], 'large')
    });
  }
};

var QQImage = {
  // http://app.qpic.cn/mblogpic/19dd9c4ece7b86262466/2000
  // => 
  // http://app.qpic.cn/mblogpic/19dd9c4ece7b86262466/160
  // http://app.qpic.cn/mblogpic/19dd9c4ece7b86262466/460
  // http://app.qpic.cn/mblogpic/19dd9c4ece7b86262466/2000
  host: 'qpic.cn',
  sync: true,
  url_re: /qpic\.cn\/mblogpic\/\w+\/(\w+)/i,
  get: function(url, callback, ele) {
    var m = this.url_re.exec(url);
    callback({
      thumbnail_pic: url.replace(m[1], '160'),
      bmiddle_pic: url.replace(m[1], '460'),
      original_pic: url.replace(m[1], '2000')
    });
  }
};

var SohuImage = {
    host: 't.itc.cn',
    url_re: /t\.itc\.cn\/.+\/(\w+(\.(png|jpg|gif|jpeg)))/i,
    sync: true,
    get: function(url, callback, ele) {
        var m = this.url_re.exec(url);
        callback({
            thumbnail_pic: url.replace(m[1], 'f_' + m[1]),
            bmiddle_pic: url.replace(m[1], 'm_' + m[1]),
            original_pic: url
        });
    }
};

// 图片服务
var ImageService = {
  services: {
    SinaImage: SinaImage,
    QQImage: QQImage,
    SohuImage: SohuImage,
    Instagram: Instagram, 
    Instagram2: Instagram2,
    TmallPhoto: TmallPhoto,
    TaobaoPhoto: TaobaoPhoto,
    Plixi: Plixi,
    Imgur: Imgur,
    Twitpic: Twitpic,
    Yfrog: Yfrog,
    Twitgoo: Twitgoo,
    MobyPicture: MobyPicture,
    Twipple: Twipple,
    Flickr: Flickr,
    DoubanImage: DoubanImage,
    Immio: Immio,
    Nodebox: Nodebox,
    Yupoo: Yupoo,
    FanfouImage: FanfouImage,
    Camplus: Camplus,
    Photo163: Photo163,
    Topit: Topit,
    Picplz: Picplz,
    Vida: Vida,
    ViaMe: ViaMe,
    PX500: PX500,
    Pinterest: Pinterest,
    Imgly: Imgly,
    FacebookPhoto: FacebookPhoto,
    Video163: Video163,
  },
  
  attempt: function (url, ele) {
    var $ele = $(ele);
    if ($ele.parent().parent().find('.thumbnail_pic').length > 0) {
      // 有图片，无需解析图片链接了
      return false;
    }
    var sourcelink = null;
    if (typeof url === 'object') {
      sourcelink = url.sourcelink;
      url = url.url;
    }
    for (var name in this.services) {
      var item = this.services[name];
      if (item.url_re.test(url)) {
        var old_title = $ele.attr('title');
        var title = _u.i18n("comm_mbleft_to_preview") + ', ' + _u.i18n('comm_mbright_to_open');
        if (old_title) {
          title += ', ' + old_title;
        }
        var attrs = {
          rhref: url,
          old_title: old_title,
          title: title, 
          //href: 'javascript:;',
          service: name
        };
        if (item.show_link) {
          attrs.show_link = '1';
        }
        if (sourcelink && sourcelink !== url) {
          attrs.sourcelink = sourcelink;
        }
        $ele.attr(attrs).one('click', function () {
          var $this = $(this);
          ImageService.show(this, $this.attr('service'), 
          $this.attr('rhref'), $this.attr('sourcelink'), $this.attr('show_link') === '1');
          return false;
        });
        if (item.sync) {
          $ele.click();
        }
        return true;
      }
    }
    return false;
  },
  
  show: function (ele, service, url, sourcelink, show_link) {
    service = this.services[service];
    service.get(url, function (pics, sync) {
      if (!pics) {
        return;
      }
      sourcelink = sourcelink || url;
      var title = _u.i18n("comm_mbright_to_open_pic");
      if (pics.caption) {
        title = pics.caption + ', ' + title;
      }
      // 是否需要原生链接，如果转发带图片的时候
      var need_sourcelink = service.need_sourcelink ? '1' : '0';
      var tpl = '<div><a target="_blank" class="thumbnail_pic" ' +
        ' sourcelink="' + sourcelink + '" need_sourcelink="' + need_sourcelink + '" ' +
        ' href="javascript:void(0);" bmiddle="{{bmiddle_pic}}" original="{{original_pic}}" title="' +
        title +'"><img class="imgicon pic" src="{{thumbnail_pic}}" /></a></div>';
      var $ele = $(ele);
      if (show_link !== true) {
        $ele.hide();
      } else {
        var old_title = $ele.attr('old_title') || '';
        if (pics.caption) {
          old_title = pics.caption + (old_title? (', ' + old_title) : '');
        }
        var attrs = {
          title: old_title,
          href: $ele.attr('rhref')
        };
        $ele.attr(attrs);
      }
      $ele.parent().after(tpl.format(pics));
    }, ele);
  },
  
  upload: function (pic, callback) {
    var settings = Settings.get();
    this.services[settings.image_service].upload(pic, callback);
  }
};

var VideoService = {
  // 判断是否qq支持的视频链接 youku,tudou,ku6
  is_qq_support: function (url) {
    return false;
    // return this.services.youku.url_re.test(url) ||
    //   this.services.ku6.url_re.test(url) ||
    //   this.services.tudou.url_re.test(url) ||
    //   this.services.yinyuetai.url_re.test(url);
  },
  services: {
    // youku: {
    //   url_re: /youku\.com\/v_show\/id_([^\.]+)\.html/i,
    //   tpl: '<embed src="http://player.youku.com/player.php/sid/{{id}}/v.swf" quality="high" width="460" height="400" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed>'
    // },
    // ku6: {
    //   // http://v.ku6.com/special/show_3898167/rJ5BS7HWyEW4iHC3.html
    //   url_re: /ku6\.com\/.+?\/([^\.\/]+)\.html/i,
    //   tpl: '<embed src="http://player.ku6.com/refer/{{id}}/v.swf" quality="high" width="460" height="400" align="middle" allowScriptAccess="always" allowfullscreen="true" type="application/x-shockwave-flash"></embed>'
    // },
    // tudou: {
    //   url_re: /tudou\.com\/programs\/view\/([^\/]+)\/?/i,
    //   tpl: '<embed src="http://www.tudou.com/v/{{id}}/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="460" height="400"></embed>'
    // },
    // '56': {
    //   url_re: /56\.com\/.+?\/(v_[^\.]+)\.html/i,
    //   tpl: '<embed src="http://player.56.com/{{id}}.swf" type="application/x-shockwave-flash" allowNetworking="all" allowScriptAccess="always" width="460" height="400"></embed>'
    // },
    // http://video.sina.com.cn/playlist/4576702-1405053100-1.html#44164340 => 
    // http://you.video.sina.com.cn/api/sinawebApi/outplayrefer.php/vid=44164340_1405053100_1/s.swf
    // http://you.video.sina.com.cn/api/sinawebApi/outplayrefer.php/vid=44164340_1405053100_Z0LhTSVpCzbK+l1lHz2stqkP7KQNt6nkjWqxu1enJA5ZQ0/XM5GdZtwB5CrSANkEqDhAQJw+c/ol0x0/s.swf
    // http://you.video.sina.com.cn/b/32394075-1575345837.html =>
    // http://you.video.sina.com.cn/api/sinawebApi/outplayrefer.php/vid=32394075_1575345837/s.swf
    // sina: {
    //   url_re: /video\.sina\.com\.cn\/.+?\/([^\.\/]+)\.html(#\d+)?/i,
    //   format: function (matchs) {
    //     var id = matchs[1];
    //     if (matchs[2]) {
    //       id = matchs[2].substring(1) + id.substring(id.indexOf('-'));
    //     }
    //     return id.replace('-', '_');
    //   },
    //   tpl: '<embed src="http://you.video.sina.com.cn/api/sinawebApi/outplayrefer.php/vid={{id}}/s.swf" type="application/x-shockwave-flash" allowNetworking="all" allowScriptAccess="always" width="460" height="400"></embed>'
    // },
    // http://url.cn/2Arc4n
    // http://v.qq.com/video/play.html?vid=8snYX6VEFXq
    // http://v.qq.com/cover/x/xp5cyy8s332vn56.html?vid=8RpUd2iCw0c
    // qq: {
    //   url_re: /v\.qq\.com\/.+?vid=(\w+)/i,
    //   tpl: '<embed flashvars="version=20110401&amp;vid={{id}}&amp;autoplay=1&amp;list=2&amp;duration=&amp;adplay=1&amp;showcfg=1&amp;tpid=23" src="http://static.video.qq.com/TencentPlayer.swf" quality="high" name="_playerswf" id="_playerswf" bgcolor="#000000" width="460" height="400" align="middle" allowscriptaccess="always" allowfullscreen="true" type="application/x-shockwave-flash">'
    // },
    // http://www.youtube.com/v/A6vXOZbzBYY?fs=1
    // http://youtu.be/A6vXOZbzBYY
    // http://www.youtube.com/watch?v=x9S37QbWYJc&feature=player_embedded
    // youtube: {
    //   url_re: /(?:(?:youtu\.be\/(\w+))|(?:youtube\.com\/watch\?v=(\w+)))/i,
    //   format: function (matchs, url, ele) {
    //     if (url.indexOf('youtube.com/das_captcha') >= 0) {
    //       matchs = this.url_re.exec($(ele).html());
    //     }
    //     var id = matchs[1] || matchs[2];
    //     return id;
    //   },
    //   tpl: '<embed src="http://www.youtube.com/v/{{id}}?fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="460" height="400"></embed>'
    // },
    
    // http://www.yinyuetai.com/video/96953
    // yinyuetai: {
    //   url_re: /yinyuetai\.com\/video\/(\w+)/i,
    //   tpl: '<embed src="http://www.yinyuetai.com/video/player/{{id}}/v_0.swf" quality="high" width="460" height="400" align="middle"  allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed>'
    // },
    
    // http://www.xiami.com/song/2112011
    // http://www.xiami.com/widget/1_2112011/singlePlayer.swf
    // xiami: {
    //   append: true, // 直接添加在链接后面
    //   url_re: /xiami\.com\/song\/(\d+)/i,
    //   tpl: '<embed src="http://www.xiami.com/widget/0_{{id}}/singlePlayer.swf" type="application/x-shockwave-flash" width="257" height="33" wmode="transparent"></embed>'
    // },
    
    // http://v.zol.com.cn/video105481.html
    // zol: {
    //   url_re: /v\.zol\.com\.cn\/video(\w+)\.html/i,
    //   tpl: '<embed height="400" width="460" wmode="opaque" allowfullscreen="false" allowscriptaccess="always" menu="false" swliveconnect="true" quality="high" bgcolor="#000000" src="http://v.zol.com.cn/meat_vplayer323.swf?movieId={{id}}&open_window=0&auto_start=1&show_ffbutton=1&skin=http://v.zol.com.cn/skin_black.swf" type="application/x-shockwave-flash">'
    // },
    // http://v.ifeng.com/his/201012/00b4cb1a-7838-4846-aeaf-9967e3cdcd99.shtml
    // http://v.ifeng.com/v/jiashumei/index.shtml#bcd47338-3558-4436-90ca-4e233fcbc37a
    // ifeng: {
    //   url_re: /v\.ifeng\.com\/(.+?)\/([^\.\/]+)\./i,
    //   format: function (matchs, url, ele) {
    //     var re = /[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-Z0-9]{12}/i;
    //     var m = re.exec(url);
    //     if (m) {
    //       matchs = m;
    //     }
    //     return matchs[matchs.length - 1];
    //   },
    //   tpl: '<embed src="http://v.ifeng.com/include/exterior.swf?guid={{id}}&pageurl=http://www.ifeng.com&fromweb=other&AutoPlay=true" quality="high"  allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="460" height="400"></embed>'
    // },
    // http://code.google.com/p/falang/issues/detail?id=203
    // http://mi.xiaomi.com/yuyin/w.php?s=http://fx00402.files.xiaomi.net/11061124/7e32ba2c2df34b11bc51ad310179d5ebe10bfb0acbe6
    // xiaomi: {
    //   url_re: /mi\.xiaomi\.com\/yuyin\/w\.php\?s\=(.+)/i,
    //   tpl: '<object data="http://mi.xiaomi.com/flash/yuyin.swf" \
    //     type="application/x-shockwave-flash" width="460" height="340">\
    //     <param name="wmode" value="transparent">\
    //     <param name="flashvars" value="filepath={{id}}.mp3">\
    //     <param name="movie" value="http://mi.xiaomi.com/flash/yuyin.swf"></object>'
    // },
  },
  
  format_flash: function (flash_url) {
    return '<div><embed src="' + flash_url +
      '" type="application/x-shockwave-flash" quality="high" width="460" height="400" align="middle" allowScriptAccess="sameDomain"></embed></div>';
  },
  
  attempt: function (urldata, ele) {
    var url = urldata.url || urldata;
    var flash = urldata.flash || '';
    var flash_title = urldata.title || '';
    var screen_pic = urldata.screen;
    for (var name in this.services) {
      var service = this.services[name];
      if (service.url_re.test(url)) {
          var $ele = $(ele);
        if (service.append) {
          // 直接添加到后面
          var flash_code = flash ? this.format_flash(flash) : this.format_tpl(service, url, ele);
          var $parent = $ele.parent();
          if ($parent.find('.embed_insert').length == 0) {
            $parent.append('<div class="embed_insert">' + flash_code + '</div>');
          }
        } else {
          var old_title = $ele.attr('title');
          var title = _u.i18n("comm_mbleft_to_preview");
          if (flash_title) {
            title += '[' + flash_title + ']';
          }
          if (old_title) {
            title += ', ' + old_title;
          }
          var attrs = {
            title: title,
            rhref: url,
            href: 'javascript:;',
            flash: flash,
            flash_title: flash_title
          };
          $ele.attr(attrs).click(function () {
            var $this = $(this);
            VideoService.show(
              $this.attr('videoType'), 
              $this.attr('rhref'), 
              $this.attr('flash'), 
              $this.attr('flash_title'),
              this
            );
          });
          if (screen_pic) {
            var img_html = '<br/><img class="video_image" title="' +
              flash_title + '" src="' + screen_pic + '" /><br/>';
            $ele.parent().append(img_html);
          }
        }
        $ele.attr('videoType', name)
          .after(' [<a class="showVideoBtn external_link" href="" title="' +
            _u.i18n("comm_popup_play") + '">' + _u.i18n("abb_play") +'</a>]');
        return true;
      }
    }
    return false;
  },
  format_tpl: function (service, url, ele) {
    var matchs = service.url_re.exec(url);
    var id = null;
    if (service.format) {
      id = service.format(matchs, url, ele);
    } else {
      id = matchs[1];
    }
    return service.tpl.format({id: id});
  },
  show: function (name, url, flash, ele) {
    var service = this.services[name];
    var flash_code = flash ? this.format_flash(flash) : this.format_tpl(service, url, ele);
    popupBox.showVideo(url, flash_code);
  },
  popshow: function (ele) {
    var $this = $(ele).prev('a');
    var vtype = $this.attr('videoType');
    var flash = $this.attr('flash');
    var title = $this.attr('flash_title') || '';
    var shorturl = $this.html();
    var url = 'popshow.html?vtype=' + vtype + '&s=' + shorturl + '&title=' + title;
    if (flash) {
      url += '&flash=' + flash;
    } else {
      url += '&url=' + ($this.attr('rhref') || $this.attr('href'));
    }
    var l = (window.screen.availWidth - 510) / 2;
    var width_height = vtype == 'xiami' ? 'width=300,height=50': 'width=460,height=430';
    var params = 'left=' + l + ',top=30,' + width_height +
      ',menubar=no,location=no,resizable=no,scrollbars=yes,status=yes';
    window.open(url, '_blank', params);
  }
};

function _bind_tip_items($tip_div) {
  $tip_div.find('li').mouseover(function () {
    $tip_div.find('li').removeClass('cur');
    $(this).addClass('cur');
  });
}

// match_all_text 是否匹配全部内容
function at_user_autocomplete(ele_id, match_all_text, select_callback) {
  // support @ autocomplete
  var $tip_div = $('<div ele_id="' + ele_id +
    '" style="z-index: 2000; position: absolute;display:none; " class="at_user"><ul></ul></div>');
  $(document.body).append($tip_div);
  var ele = $(ele_id).get(0);
  ele.select_callback = select_callback;
  ele.match_all_text = match_all_text;
  $(ele_id).keyup(function (event) {
      if (!this._at_key_loading && // 不是正在加载
        event.keyCode != '13' && event.keyCode != '38' && event.keyCode != '40') {
        var key_index = 0, key = null;
        if (!match_all_text) {
          var value = $(this).val().substring(0, this.selectionStart);
          key_index = value.search(/@[^@\s]{1,20}$/g);
          if (key_index >= 0) {
                key = value.substring(key_index + 1);
                if (!/^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(key)){
                  key = null;
                }
              }
        } else {
          key = $(this).val();
        }
          var $text_tip = $('#text_tip');
          if (key) {
            // http://xiaocai.info/2011/03/js-textarea-body-offset/
            this._at_key = key;
            this._at_key_index = key_index;
            this._at_key_loading = true;
            at_user_search(key, function (names) {
              this._at_key_loading = false;
              var html = '';
                for (var user_id in names) {
                  var item = names[user_id];
                  var showname = item[1];
                  if (item[0] !== item[1]) {
                      showname += '(' + item[0] + ')';
                  }
                  html += '<li name="' + item[0] + '" user_id="' + user_id + '">' + showname + '</li>';
                }
                if (!html) {
                  $tip_div.hide();
                  return;
                }
                $tip_div.find('ul').html(html).find('li:first').addClass('cur');
                _bind_tip_items($tip_div);
                
                var $this = $(this);
                var ele_offset = $this.offset();
                if ($text_tip.length === 0) {
                  $text_tip = $('<div id="text_tip" style="z-index:-1000;position:absolute;opacity:0;overflow:auto;display:inline;word-wrap:break-word;"></div>');
                  $(document.body).append($text_tip);
                }
                $text_tip.css({
                left: ele_offset.left, 
                top: ele_offset.top, 
                height: $this.height,
                width: $this.width(),
                'font-family': $this.css('font-family'),
                'font-size': $this.css('font-size')
              });
                var text = $this.val().substring(0, this.selectionStart);
                function _format(s) {
                  return s.replace(/</ig, '&lt;').replace(/>/ig, '&gt;')
                    .replace(/\r/g, '').replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
                }
                $text_tip.html(_format(text) + '<span>&nbsp;</span>');
                var $span = $text_tip.find('span');
                var offset = $span.offset();
                var left = offset.left - $span.width();
                if ((left + $tip_div.width()) > (ele_offset.left + $this.width())) {
                  left -= $tip_div.width();
                }
                var top = Math.min(offset.top + $span.height(), ele_offset.top + $this.height());
                $tip_div.css({ left: left, top: top }).show();
            }, this);
          } else {
            $tip_div.hide();
          }
      }
    }).keydown(function (){
      if ($tip_div.css('display') !== 'none') {
//        keycode 38 = Up 
//        keycode 40 = Down
        if (event.keyCode === 13) {
          $tip_div.find('li.cur').click();
            return false;
          } else if (event.keyCode == 38) {
            var $prev = $tip_div.find('li.cur').prev();
            if ($prev.length == 1) {
              $tip_div.find('li.cur').removeClass('cur');
              $prev.addClass('cur');
            }
            return false;
          } else if (event.keyCode === 40) {
            var $next = $tip_div.find('li.cur').next();
            if ($next.length === 1) {
              $tip_div.find('li.cur').removeClass('cur');
              $next.addClass('cur');
            }
            return false;
          }
      }
    }).focusout(function () {
      // 延时隐藏，要不然点击选择的时候，已经被隐藏了，无法选择
      setTimeout(function () {
        $tip_div.hide();
      }, 100);
    }).click(function () {
      $(this).keyup();
    });
  $tip_div.click(function () {
      var $select_li = $(this).find('li.cur:first');
      var $text = $($tip_div.attr('ele_id'));
      var value = $text.val();
      var ele = $text.get(0);
      var user_name = $select_li.attr('name');
      if (ele.match_all_text) {
        $text.val(user_name);
        $text.focus();
      } else {
        var new_value = value.substring(0, ele._at_key_index + 1);
          new_value += user_name + ' ' + value.substring(ele.selectionStart);
          $text.focus().val(new_value);
          // 设置光标位置
          ele.selectionStart = ele.selectionEnd = ele._at_key_index + user_name.length + 2;
      }
      if (ele.select_callback) {
        ele.select_callback({
          id: $select_li.attr('user_id'),
          name: user_name,
          screen_name: $select_li.html()
        });
      }
      setTimeout(function () {
        $tip_div.hide();
      }, 100);
    });
};


//@user search
function at_user_search(query, callback, context) {
  var query_regex = new RegExp(query, 'i');
  var current_user = null;
  // 当前不是对话框回复的话，则代表是发微博
  if ($("#ye_dialog_window").is(':hidden')) {
      // 根据当前选择的用户来获取at数据
      // 如果只选择了一个用户，则使用选择的用户
      // 如果没有选择或者选择大于1人，则使用当前用户
      var $selected = $('#accountsForSend li.sel:last');
      if ($selected.length > 0) {
          current_user = getUserByUniqueKey($selected.attr('uniquekey'), 'all');
      } 
  }
  if (!current_user) {
      current_user = getUser();
  }
  var b_view = getBackgroundView();
  var hits = {}, hit_count = 0;
  var config = tapi.get_config(current_user);
  var data_types = [b_view.friendships.friend_data_type].concat(T_LIST.all);
  for (var index=0, index_len = data_types.length; index < index_len; index++) {
    var tweets = b_view.get_data_cache(data_types[index], current_user.uniqueKey) || [];
      for (var i = 0, len = tweets.length; i < len; i++){
        var tweet = tweets[i];
        var items = [tweet.user || tweet];
        var rt = tweet.retweeted_status || tweet.status;
        if (rt) {
          items.push(rt.user);
          if (rt.retweeted_status) {
            items.push(rt.retweeted_status.user);
          }
        }
        for (var j = 0, jlen = items.length; j < jlen; j++) {
          var user = items[j];
          if (_check_name(user, query_regex)) {
                if (!hits[user.id]) {
                        if (current_user.blogType === 'renren') {
                            hits[user.id] = [ user.screen_name + '(' + user.id + ')', user.screen_name ];
                        } else if (current_user.blogType === 'laiwang') {
                            hits[user.id] = [ user.id, user.screen_name ];
                        } else {
                            if (config.rt_at_name) {
                                hits[user.id] = [ user.name, user.screen_name ];
                            } else {
                                hits[user.id] = [ user.screen_name, user.screen_name ];
                            }
                        }
                  hit_count++;
                }
              }
        }
          if (hit_count >= 10) {
            return callback.call(context, hits);
        }
      }
  }
  if (hit_count < 2) {
    // 命中太少，则尝试获取最新的
    b_view.friendships.fetch_friends(current_user.uniqueKey, function (friends) {
      for (var i = 0, len = friends.length; i < len; i++) {
        user = friends[i];
        if (_check_name(user, query_regex)) {
                if (!hits[user.id]) {
                  if (config.rt_at_name) {
                    hits[user.id] = [ user.name, user.screen_name ];
                  } else {
                    hits[user.id] = [ user.screen_name, user.screen_name ];
                  }
                  hit_count++;
                  if (hit_count >= 10) {
                        break;
                    }
                }
              }
      }
      return callback.call(context, hits);
    });
  } else {
    return callback.call(context, hits);
  }
}

function _check_name(user, query_regex) {
  if (!user) {
    return false;
  }
  return user.screen_name && user.screen_name.search(query_regex) >= 0 || 
    user.name && user.name.search(query_regex) >= 0;
}


// 根据当前ip获取地理坐标信息
// callback(geo, error_message)
var get_location = function (callback) {
  $.ajax({
    url:'http://api.yongwo.de/api/ip', 
    success: function(ip) {
      var url = 'http://api.map.sina.com.cn/geocode/ip_to_geo.php?format=json&source=3434422667&ip=' + ip;
      $.ajax({
        url: url, 
        dataType: 'json',
        success: function(data){
          var geo = data.geos && data.geos[0];
          var error = null;
          if(geo && geo.latitude) {
            geo.latitude = parseFloat(geo.latitude);
            geo.longitude = parseFloat(geo.longitude);
          } else {
            error = String(geo && geo.error || geo);
            geo = null;
          }
          callback(geo, error);
        },
        error: function(jqXHR, textStatus, errorThrown){
          callback(null, String(errorThrown));
        }
      });
    },
    error: function(jqXHR, textStatus, errorThrown){
      callback(null, String(errorThrown));
    }
  });
};

/**
 * 将符合字节流的string转化成Blob对象
 * 
 * @param {String} data
 * @return {Blob} 
 * @api public
 */
function binaryToBlob(data) {
  var arr = new Uint8Array(data.length);
  for (var i = 0, l = data.length; i < l; i++) {
    arr[i] = data.charCodeAt(i);
  }
  // Chrome 21+ support ArrayBufferView
  var buffer = arr;
  var version = parseInt(getChromeVersion() || 0, 10);
  if (version < 21) {
    buffer = arr.buffer;
  }
  return buildBlob([buffer]);
}

/**
 * 根据URL获取图片的Blob对象
 * 
 * @param {String} url
 * @return {Blob} 
 * @api public
 */
function getImageBlob(url) {
  if (url.indexOf('data:') === 0) {
    // is dataUrl
    return dataUrlToBlob(url);
  }
  var r = new XMLHttpRequest();
  r.open("GET", url, false);
  // 详细请查看: https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data
  // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  r.overrideMimeType('text/plain; charset=x-user-defined');
  r.send(null);
  var blob = binaryToBlob(r.responseText);
  blob.name = blob.fileName = url.substring(url.lastIndexOf('/') + 1);
  blob.fileType = "image/jpeg"; //"image/octet-stream";
  return blob;
}

/**
 * 将dataUrl转化成Blob对象
 * 
 * @param {String} dataurl
 * @return {Blob} 
 * @api public
 */
function dataUrlToBlob(dataurl) {
  // data:image/jpeg;base64,xxxxxx
  var datas = dataurl.split(',', 2);
    var blob = binaryToBlob(atob(datas[1]));
  blob.fileType = datas[0].split(';')[0].split(':')[1];
  blob.name = blob.fileName = 'pic.' + blob.fileType.split('/')[1];
  return blob;
}

//http://blogs.cozi.com/tech/2010/04/generating-uuids-in-javascript.html
var UUID = {
   // Return a randomly generated v4 UUID, per RFC 4122
   uuid4: function()
   {
    return this._uuid(
      this.randomInt(), this.randomInt(),
      this.randomInt(), this.randomInt(), 4);
   },

   // Create a versioned UUID from w1..w4, 32-bit non-negative ints
   _uuid: function(w1, w2, w3, w4, version)
   {
    var uuid = new Array(36);
    var data = [
     (w1 & 0xFFFFFFFF),
     (w2 & 0xFFFF0FFF) | ((version || 4) << 12), // version (1-5)
     (w3 & 0x3FFFFFFF) | 0x80000000,    // rfc 4122 variant
     (w4 & 0xFFFFFFFF)
    ];
    for (var i = 0, k = 0; i < 4; i++)
    {
     var rnd = data[i];
     for (var j = 0; j < 8; j++)
     {
      if (k == 8 || k == 13 || k == 18 || k == 23) {
       uuid[k++] = '-';
      }
      var r = (rnd >>> 28) & 0xf; // Take the high-order nybble
      rnd = (rnd & 0x0FFFFFFF) << 4;
      uuid[k++] = this.hex.charAt(r);
     }
    }
    return uuid.join('');
   },

   hex: '0123456789abcdef',

   // Return a random integer in [0, 2^32).
   randomInt: function() {
     return Math.floor(0x100000000 * Math.random());
   }
};


var ActionCache = {
  _cache: null,
  _get_cache: function() {
    if(!this._cache) {
      var bg = getBackgroundView() || {};
      if(!bg.__action_cache) {
        bg.__action_cache = {};
      }
      this._cache = bg.__action_cache;
    }
    return this._cache;
  },
  set: function(key, value) {
    var cache = this._get_cache();
    if(value == null) {
      delete cache[key];
    } else {
      cache[key] = JSON.stringify(value);
    }
  },
  get: function(key) {
    var cache = this._get_cache();
    var value = cache[key];
    if(value) {
      value = JSON.parse(value);
    }
    return value;
  }
};

// 文字转化成图片的服务
var TextImage = {
  draw: function (text, options) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    options = options || {};
    var width = options.width || 500
      , font_size = options.font_size || 12
      , font_family = options.font_family || 'Arial'
      , font_weight = options.font_weight || 'normal' // bold or normal
      , margin = options.margin || 5;
    var font = font_weight + ' ' + font_size + "px " + font_family
      , left = 5, top = 5
      , line_width = width - margin * 2, line_height = font_size + margin
      , height = line_height;
    var can = document.createElement("canvas")
      , ctx = can.getContext("2d");
    can.width = width;
    ctx.font = font;
    var s = '', lines = [];
    for (var i = 0, len = text.length; i < len; i++) {
      var c = text[i];
      if (c === '\n') {
        // 下一行
        if(top + line_height > height) {
          height += line_height;
        }
        //ctx1.fillText(s, left, top);
        lines.push([s, left, top]);
        top += line_height;
        s = '';
        continue;
      }
      var text_width = ctx.measureText(s + c).width;
      if (text_width > line_width) {
        // 画一行, 判断断行位置
        var index = this._find_sep(s);
        if (index !== 0) {
          c = s.substring(index) + c;
          s = s.substring(0, index);
        }
        if (top + line_height > height) {
          height += line_height;
        }
        lines.push([s, left, top]);
        top += line_height;
        s = c;
      } else {
        s += c;
      }
    }
    if (s) {
      if (top + line_height > height) {
        height += line_height;
      }
      lines.push([s, left, top]);
    }
    can.width = width;
    can.height = height + 30; // 空白30px放水印logo
    // 需要在设置了高度后再设置textBaseline 才会生效
    ctx.font = font;
    ctx.textBaseline = "top";
    // 白色背景
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";
    for (var i = 0, len = lines.length; i < len; i++) {
      ctx.fillText.apply(ctx, lines[i]);
    }
    return can.toDataURL(); // png目前饭否，嘀咕，和雷猴都处理不太好。
  },
  SEP_RE: /\s|[^\x00-\xff]/i,
  // 找出分割字符
  _find_sep: function (s) {
    for (var i = s.length - 1; i > 0; i--) {
      if (this.SEP_RE.test(s[i])) {
        return i + 1;
      }
    }
    return 0;
  }
};

// 是否支持上传功能
function isSupportUpload() {
  return window.Blob || window.BlobBuilder || window.WebKitBlobBuilder;
}

function url_encode(text) {
  return OAuth.percentEncode(text);
}

function build_upload_params(data, pic) {
  pic.keyname = pic.keyname || 'file';
  var boundary = '----multipartformboundary' + Date.now();
  var dashdash = '--';
  var crlf = '\r\n';

  /* Build RFC2388 string. */
  var builder = '';

  builder += dashdash;
  builder += boundary;
  builder += crlf;
  
  for (var key in data) {
    var value = url_encode(data[key]);
    data[key] = value;
  }
  for (var key in data) {
    /* Generate headers. key */            
    builder += 'Content-Disposition: form-data; name="' + key + '"';
    builder += crlf;
    builder += crlf; 
     /* Append form data. */
    builder += data[key];
    builder += crlf;
    
    /* Write boundary. */
    builder += dashdash;
    builder += boundary;
    builder += crlf;
  }
  /* Generate headers. [PIC] */            
  builder += 'Content-Disposition: form-data; name="' + pic.keyname + '"';
  if (pic.fileName || pic.name) {
    // builder += '; filename="' + url_encode(pic.fileName) + '"';
    builder += '; filename="' + (pic.fileName || pic.name) + '"';
  }
  builder += crlf;

  builder += 'Content-Type: '+ (pic.fileType || pic.type);
  builder += crlf;
  builder += crlf;
  var parts = [];
  parts.push(builder);
  parts.push(pic);
  
  builder = crlf;
  /* Mark end of the request.*/ 
  builder += dashdash;
  builder += boundary;
  builder += dashdash;
  builder += crlf;
  parts.push(builder);

  var blob = buildBlob(parts);
  blob.contentType = 'multipart/form-data; boundary=' + boundary;
  return blob;
}

function buildBlob(parts) {
  var blob = null;
  var version = parseInt(getChromeVersion() || 0, 10);
  // https://developer.mozilla.org/en/DOM/Blob
  // Chrome 20+ support Blob() constructor
  if (version >= 20) {
    blob = new Blob(parts);
  } else {
    if (typeof BlobBuilder === 'undefined') {
      var BlobBuilder = window.WebKitBlobBuilder;
    }
    var bb = new BlobBuilder();
    for (var i = 0; i < parts.length; i++) {
      bb.append(parts[i]);
    }
    blob = bb.getBlob();
  }
  return blob;
}

function getChromeVersion() {
  var m = /Chrome\/(\d+)/i.exec(navigator.userAgent);
  if (m) {
    return m[1];
  }
  return;
}

function display_size(bytes) {   // simple function to show a friendly size
  var i = 0, fixed = 0;
  while (1023 < bytes) {
    bytes /= 1024;
    ++i;
  };
  if (i > 1) {
    fixed = 1;
  }
  return bytes.toFixed(fixed) + [" B", " KB", " MB", " GB", " TB"][i];
};

var xhr_provider = function (onprogress) {
  return function () {
    var xhr = jQuery.ajaxSettings.xhr();
    if (onprogress && xhr.upload) {
      xhr.upload.addEventListener('progress', onprogress, false);
    }
    return xhr;
  };
};

// http://james.padolsey.com/javascript/special-scroll-events-for-jquery/
(function () {
    
    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);
        
    special.scrollstart = {
        setup: function() {
            
            var timer,
                handler =  function(evt) {
                    
                    var _self = this,
                        _args = arguments;
                    
                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        jQuery.event.handle.apply(_self, _args);
                    }
                    
                    timer = setTimeout( function(){
                        timer = null;
                    }, special.scrollstop.latency);
                    
                };
            
            jQuery(this).bind('scroll', handler).data(uid1, handler);
            
        },
        teardown: function(){
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid1) );
        }
    };
    
    special.scrollstop = {
        latency: 300,
        setup: function() {
            
            var timer,
                    handler = function(evt) {
                    
                    var _self = this,
                        _args = arguments;
                    
                    if (timer) {
                        clearTimeout(timer);
                    }
                    
                    timer = setTimeout( function(){
                        
                        timer = null;
                        evt.type = 'scrollstop';
                        jQuery.event.handle.apply(_self, _args);
                        
                    }, special.scrollstop.latency);
                    
                };
            
            jQuery(this).bind('scroll', handler).data(uid2, handler);
            
        },
        teardown: function() {
            jQuery(this).unbind( 'scroll', jQuery(this).data(uid2) );
        }
    };
    
})();


var FILTER_TYPES = [
  [ '原图',         'none',               {dft: null} ],
  [ '伽玛',         'gamma',              {dft: 2, range: [0, 255]} ],   // "brightness|contrast|gamma|exposure" Multiplier of existing values (0-255)
  [ '高亮',         'brightness',         {dft: 2, range: [0, 255]} ],
  [ '对比增强',     'contrast',           {dft: 2, range: [0, 255]} ],
  [ '曝光增强',     'exposure',           {dft: 2, range: [0, 255]} ],
  //[ '反转',         'invert',             {dft: null} ],   
  [ '全音',         'tritone',            {dft: null} ], // [[0,0,0], [0,0,0],[0,0,0]]  if f=="tritone" low|mid|high range colors as rgb triplets [0-255,0-255,0-255]
  [ '曝光过度',     'solarize',           {dft: null} ],
  [ '灰度',         'grayscale',          {dft: null} ],
  [ '怀旧',         'sepia',              {dft: null} ],
  [ '阈值',         'threshold',          {dft: 1} ],   // "threshold" Multiplier of 127 (0-2)
  [ '平滑模糊',     'smooth',             {dft: 1, range: [1, 10]} ],  // "smooth" Radius (px 1-10)
  [ '旋转模糊',     'spinblur',           {dft: 4, range: [1, 64]} ], // "zoomblur|spinblur" Distance (px 1-64)
  [ '缩放模糊',     'zoomblur',           {dft: 15, range: [1, 64]} ], // "zoomblur|spinblur" Distance (px 1-64)
  [ '动态模糊',     'motionblur',         {dft: [32, 180]} ],   // [1,0]     if f=="motionblur" Distance (px 1-64) and angle (0-360)
  //[ 'invertalpha',        null ],
  //[ 'RGB混合',      'mixrgb',             {dft: null} ],
  [ '冷色',         'adjustrgba',         {dft: [.5,1,1.5,1]} ],   // [1,1,1,1] if f=="adjustrgba" red, green, blue, alpha. Multipliers of existing values (0-255)
  //[ 'HSBA调整',     'adjusthsba',         {dft: [1,1,1,1]} ],   // [1,1,1,1] if f=="adjusthsba" hue, saturation, brightness, alpha. Multipliers (0-255)
  //[ 'YUVA调整',     'adjustyuva',         {dft: [1,1,1,1]} ],   // [1,1,1,1] if f=="adjustyuva" luminance, blue–yellow chrominance, red–cyan chrominance, alpha. Multipliers of existing values (0-255)
  [ '色调分离',     'posterize',          {dft: 8, range: [1, 16]} ],  // "posterize" Number of levels (1-16)
  //[ '色基',         'colorkey',           {dft: [[0,0,0], [0,0,0]]} ],   // [[0,0,0], [0,0,0]]  if f=="colorkey" equals rgb min and rgb max triplet (0-255)
  //[ '色度键',       'chromakey',          {dft: [0,0,0,0,0]} ],   // [0,0,0,0,0]  f=="chromakey" hue (0-360) and hue tolerance, min saturation, min brightness, max brightness (0-100)
  //[ '轮廓',         'outline',            {dft: [1,0,'sobel']} ],   // [1,0,'name']     if f=="outline" Divisor of convolution result, bias (0-255) and operator ('sobel'|'scharr'|'prewitt'|'kirsh'|'roberts') 
  //[ '缠绕',         'convolve',           {dft: [-1,0]} ],   // [auto,0]  if f=="convolve" or m!=null. Divisor of convolution result (-1==auto), useable for normalization and bias (0-255) for brightness addition
  [ '浮雕',         'anaglyph',           {dft: null} ],
  [ '阿尔法遮罩',   'alphamask',          {dft: null} ],
  [ '上下模糊',     'tiltshift',          {dft: [0.5,0.4,0,5]} ],   //[0.5,0.4,0,4] if f=="tiltshift" Unmask position (0.0-1.0) and size (0.0-1.0) and horizontal or vertical orientation (0|1) and blur radius (px 1-8) 
  [ '左右模糊',     'tiltshift-2',          {dft: [0.5,0.4,1,5]} ], 
  //[ 'stackblur', [] ],
  //[ '多重阿尔法',   'multiplyalpha',      {dft: null} ],
  //[ '非多重阿尔法', 'unmultiplyalpha',    {dft: null} ]
];

function ImageFilterBuilder() {
  this.hiddenFilterImgId = "hiddenFilterImg";
}

ImageFilterBuilder.prototype = {
    onload: function () {
        var thumbnails = this.resizeImage(32, 32);
        this.thumbnailsDataURL = thumbnails.toDataURL("image/png");

        this.previewContainer.innerHTML = '';

        for (var i = 0, l = FILTER_TYPES.length; i < l; i++) {
            this.addFilterPreview(FILTER_TYPES[i]);
        };
    },
    resizeImage: function (w, h) {
        var canvas = document.createElement('canvas');

        canvas.width = w;               
        canvas.height = h; 

        var context = canvas.getContext('2d');

        context.drawImage(this.img, 0,0, w,h);

        return canvas;
    },

    getFilterTypeByName: function (filterType) {
        for (var i = 0, l = FILTER_TYPES.length; i < l; i++) {
            if (FILTER_TYPES[i][1] === filterType) {
                return FILTER_TYPES[i];
            }
        }
        return null;
    },

    addFilterPreview: function (filterType) {
        var img = new Image(),
            id = 'imgFilterPre_' + filterType[1];
        img.id = id;
        img.title = filterType[0];
        this.previewContainer.appendChild(img);
        img.onload = function () {
            cvi_corner.add(img, { shadow: 0, shade: 0 });
            cvi_corner.modify($("#"+id)[0], {filter:[{f:filterType[1], s:filterType[2]['dft']}]});
        }
        img.src = this.thumbnailsDataURL;
    },

    rebuildHiddenFilterImg: function () {
        var img = $("#" + this.hiddenFilterImgId);
        if(img.length){
            img.remove();
        }
        img = new Image();
        img.id = this.hiddenFilterImgId;
        img.style.display = "none";
        img.onload = function () {
            cvi_corner.add(img);
        }
        img.src = this.originalImg.src;
        document.body.appendChild(img);
    },

    applyFilter: function (filterTypeName, filterValue) {
        this.filteredName = filterTypeName;
        this.filtered = true;

        var me = this,
            filterType = me.getFilterTypeByName(filterTypeName),
            filterValue = filterValue || filterType[2]['dft'];
        cvi_corner.modify($("#"+me.hiddenFilterImgId)[0], {filter:[{f:filterType[1].split('-')[0], s: filterValue}]});

        setTimeout(function () {
            if (filterType[1] === 'none') {
                me.filterResult && me.filterResult(me.originalImg.src);
            } else {
                me.filterResult && me.filterResult($("#"+me.hiddenFilterImgId)[0].toDataURL("image/png"));
            }
        }, 350);
    },

    listFilters: function (img, previewContainer, rangeControl) {
        var me = this;
        this.filtered = false;
        this.filteredName = 'none';

        this.previewContainer = previewContainer;

        this.rangeControl = rangeControl;
        $(rangeControl).off('mouseup');
        $(rangeControl).on('mouseup', function (ev) {
            me.applyFilter(this.filterType, Number(this.value));
        });

        this.originalImg = new Image();
        this.originalImg.src = img.src;

        this.rebuildHiddenFilterImg();

        this.img = new Image();
        this.img.onload = function () {
            me.onload();
        };
        this.img.src = img.src;

        $(previewContainer).off('click', 'canvas');

        $(previewContainer).on('click', 'canvas', function (e) {
            $(previewContainer).find('.active').removeClass("active");
            $(this).addClass("active");

            var filterTypeName = this.id.split('_')[1];
            filterType = me.getFilterTypeByName(filterTypeName);
            var v = filterType[2];
            if (me.rangeControl) {
                if (v.range) {
                    me.rangeControl.filterType = filterTypeName;
                    me.rangeControl.min = v.range[0];
                    me.rangeControl.max = v.range[1];
                    me.rangeControl.value = v.dft;
                    me.rangeControl.style.display = "block";
                } else {
                    me.rangeControl.filterType = '';
                    me.rangeControl.style.display = "none";
                }
            };
            me.applyFilter(filterTypeName);
        });
    }
};