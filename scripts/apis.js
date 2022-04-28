/*
* @author qleelulu@gmail.com
*/

function Combo(callback) {
  this.callback = callback;
  this.items = 0;
  this.results = [];
}

Combo.prototype = {
  add: function () {
    var self = this;
    var id = this.items;
    this.items++;
    return function () {
      self.check(id, arguments);
    };
  },
  check: function (id, args) {
    this.results[id] = Array.prototype.slice.call(args);
    this.items--;
    if (this.items === 0) {
      this.callback.apply(this, this.results);
    }
  }
};

//destination, source1[, source2, ...]
Object.inherits = function (destination) {
  for (var i = 1, len = arguments.length; i < len; i++) {
    var source = arguments[i];
    if (!source) {
      continue;
    }
    for (var property in source) {
      destination[property] = source[property];
    }
    if (destination.super_ === undefined) {
      destination.super_ = source;
    }
  }
  return destination;
};

var OAUTH_CALLBACK_URL = chrome.extension.getURL('oauth_cb.html');
var FAWAVE_SERVER_BASE_URL = 'https://fawave.whyun.com';
var FAWAVE_OAUTH_CALLBACK_URL = FAWAVE_SERVER_BASE_URL + '/oauth2/callback';
var OAUTH_CALLBACK_URL2 = FAWAVE_SERVER_BASE_URL + '/oauth2/callback';
var RE_JSON_BAD_WORD = /[\u000B\u000C]/ig; //具体见：http://www.cnblogs.com/rubylouvre/archive/2011/02/12/1951760.html
var URL_RE = new RegExp('(?:\\[url\\s*=\\s*|)((?:www\\.|http[s]?://)[\\w\\.\\?%&\\-/#=;:!\\+~]+)(?:\\](.+)\\[/url\\]|)', 'ig');

// 伪装成微博AIR
var TSINA_APPKEYS = {
  fawave: ['FaWave', '874090086', 'f13a70ff5be42eec1436779ed902b79b']
};

var sinaApi = {
    combo: function (callback) {
        return new Combo(callback);
    },
    config: {
        host: 'http://api.t.sina.com.cn',
        user_home_url: 'http://weibo.com/n/',
        search_url: 'http://weibo.com/k/',
        result_format: '.json',
        source: '874090086',
        oauth_key: '874090086',
        oauth_secret: 'f13a70ff5be42eec1436779ed902b79b',
        // google app key
        google_appkey: 'AIzaSyAu4vq6sYO3WuKxP2G64fYg6T1LdIDu3pk',

        user_timeline_need_friendship: true, // 获取用户微博列表时是否需要额外获取与当前用户的关系信息
        max_text_length: 140,
        max_image_size: 5 * 1024 * 1024,
        userinfo_has_counts: true, // 用户信息中是否包含粉丝数、微博数等信息
        support_double_char: true, // 是否按双字节计算长度
        support_counts: true, // 是否支持批量获取转发和评论数
        support_counts_max_id_num: 99, // 支持一次同时获取多少个id的数据
        support_comment: true, // 判断是否支持评论列表
        support_do_comment: true, // 判断是否支持发送评论
        support_repost_comment: true, // 判断是否支持转发同时发评论
        support_repost_comment_to_root: false, // 判断是否支持转发同时给原文作者发评论
        support_repost: true, // 是否支持新浪形式转载
        support_comment_repost: true, // 判断是否支持评论同时转发
        support_repost_timeline: true, // 支持查看转发列表
        support_upload: true, // 是否支持上传图片
        repost_pre: '转:', // 转发前缀
        repost_delimiter: '//', //转发的分隔符
        image_shorturl_pre: ' [图] ', // RT图片缩址前缀
        support_favorites: true, // 判断是否支持收藏列表
        support_do_favorite: true, // 判断是否支持收藏功能
        support_geo: true, //是否支持地理位置信息上传
        latitude_field: 'lat', // 纬度参数名
        longitude_field: 'long', // 经度参数名
        // 是否支持max_id 分页
        support_max_id: true,
        support_destroy_msg: true, //是否支持删除私信
        support_direct_messages: false,
        support_sent_direct_messages: false, //是否支持自己发送的私信
        support_mentions: true,
        support_friendships_create: true,
        support_search: true,
        support_user_search: true, // 支持搜人
        support_search_max_id: false,
        support_favorites_max_id: false, // 收藏分页使用max_id
        support_auto_shorten_url: true, // 是否会自动对url进行缩短，如何会，则无须使用缩短服务
        rt_need_source: true, // RT的时候是否需要原始微博
        support_followers: true,

        need_processMsg: true, //是否需要处理消息的内容
        comment_need_user_id: false, // 评论是否需要使用到用户id，默认为false，兼容所有旧接口
        user_timeline_need_user: false, // user_timeline 是否需要调用show_user获取详细用户信息
        show_fullname: false, // 是否需要显示全名
        support_blocking: true, // 是否支持黑名单功能

        // api
        /*
         *  statuses/repost 转发一条微博 statuses/update 发布一条微博 statuses/upload 上传图片并发布一条微博 statuses/upload_url_text 发布一条微博同时指定上传的图片 statuses/destroy
         * 新的分享接口如下： statuses/share 第三方分享链接到微博（点击链接可查看接口文档） 您需要将原有分享、转发微博的接口，
         */
        public_timeline:      '/statuses/public_timeline',
        friends_timeline:     '/statuses/friends_timeline',
        comments_timeline: '/statuses/comments_timeline',
        user_timeline: '/statuses/user_timeline',
        mentions:             '/statuses/mentions',
        followers:            '/statuses/followers',
        friends:              '/statuses/friends',
        favorites:            '/favorites',
        favorites_create:     '/favorites/create',
        favorites_destroy:    '/favorites/destroy',
        counts:               '/statuses/counts',
        status_show:          '/statuses/show/{{id}}',
        update:               '/statuses/share',
        upload:               '/statuses/share',
        repost:               '/statuses/share',
        repost_timeline:      '/statuses/repost_timeline',
        comment:              '/statuses/comment',
        reply:                '/statuses/reply',
        comment_destroy:      '/statuses/comment_destroy/{{id}}',
        comments:             '/statuses/comments',
        destroy:              '/statuses/destroy/{{id}}',
        destroy_msg:          '/direct_messages/destroy/{{id}}',
        direct_messages:      '/direct_messages',
        sent_direct_messages: '/direct_messages/sent', //自己发送的私信列表，我当时为什么要命名为sent_direct_messages捏，我擦
        new_message:          '/direct_messages/new',
        verify_credentials:   '/account/verify_credentials',
        rate_limit_status:    '/account/rate_limit_status',
        friendships_create:   '/friendships/create',
        friendships_destroy:  '/friendships/destroy',
        friendships_show:     '/friendships/show',
        reset_count:          '/statuses/reset_count',
        user_show:            '/users/show/{{id}}',
        blocks_blocking:      '/blocks/blocking',
        blocks_blocking_ids:  '/blocks/blocking/ids',
        blocks_create:        '/blocks/create',
        blocks_destroy:       '/blocks/destroy',
        blocks_exists:        '/blocks/exists',

        // 用户标签
        tags: '/tags',
        create_tag: '/tags/create',
        destroy_tag: '/tags/destroy',
        tags_suggestions: '/tags/suggestions',

        // 搜索
        search: '/statuses/search',
        user_search: '/users/search',

        oauth_authorize: '/oauth/authorize',
        oauth_request_token:  '/oauth/request_token',
        oauth_callback: OAUTH_CALLBACK_URL2,
        oauth_access_token:   '/oauth/access_token',

        detailUrl:        '/jump?aid=detail&twId=',
        searchUrl:        '/search/',

        ErrorCodes: {
            "40025:Error: repeated weibo text!": "重复发送",
            "40028:": "新浪微博接口内部错误",
            "40031:Error: target weibo does not exist!": "不存在的微博ID",
            "40015:Error: not your own comment!": "评论ID不在登录用户的comments_by_me列表中",
            "40303:Error: already followed": "已跟随"
        }
    },

    // 翻译
    translate: function(text, target, callback, context) {
        var api = 'https://translate.google.com/translate_a/single?client=t&sl=auto';
        if (!target || target === 'zh-CN' || target === 'zh-TW') {
            target = 'zh';
        }
        var params = {tl: target, q: text};
        $.ajax({
            url: api,
            data: params,
            dataType: 'json',
            success: function(data, status) {
              //data = eval(data);
              if (data && data[0]) {
                  data = data[0];
                  var tran_text = '';
                  for(var i = 0, l = data.length; i < l; i++) {
                      tran_text += data[i][0];
                  }
                  callback.call(context, tran_text);
              } else {
                  showMsg(_u.i18n("comm_not_need_tran"), true);
                  callback.call(context, null);
              }
            },
            error: function(xhr, status) {
                var error = {message: status + ': ' + xhr.statusText};
                try {
                    error = JSON.parse(xhr.responseText).error;
                } catch (e) {
                }
                if (error.message === 'The source language could not be detected') {
                    showMsg(_u.i18n("comm_not_need_tran"), true);
                } else {
                    showMsg(_u.i18n("comm_could_not_tran") + error.message, true);
                }
                callback.call(context, null);
            }
        });
    },

    /**
     * 处理内容
     */
    processMsg: function (str_or_status, notEncode) {
      var str = str_or_status;
      var need_processMsg = this.config.need_processMsg;
      if (str_or_status.text !== undefined) {
        str = str_or_status.text;
      }
      if (str_or_status.full_text !== undefined) {
          str = str_or_status.full_text
      }

      if (str_or_status.need_processMsg !== undefined) {
        need_processMsg = str_or_status.need_processMsg;
      }
      if (typeof str === 'object') {
        return '&nbsp;';
      }
      if (str && need_processMsg) {
        if (!notEncode) {
          str = htmlencode(str);
        }
        str = str.replace(URL_RE, this._replaceUrl);

        str = this.processAt(str, str_or_status); //@***

        str = this.processEmotional(str);

        str = this.processSearch(str); //#xxXX#

        // TODO: 支持 IOS5 的emoji表情
        //    iOS 5 and OS X 10.7 (Lion) use the Unicode 6.0 standard ‘unified’ code points for emoji.
        //    参考： http://code.iamcal.com/php/emoji/
        // iOS emoji
        if (typeof jEmoji !== 'undefined') {
          // 支持 softbank to unified first
          str = jEmoji.unifiedToHTML(jEmoji.softbankToUnified(str));
        }
      }
      return str || '&nbsp;';
    },

    searchMatchReg: /#([^#]+)#/g,
    processSearch: function(str) {
        var search_url = this.config.search_url;
        str = str.replace(this.searchMatchReg, function(m, g1) {
            // 修复#xxx@xxx#嵌套问题
            var search = g1.remove_html_tag();
            return '<a target="_blank" href="'+ search_url +
                '{{search}}" title="Search #{{search}}">#{{search}}#</a>'
                .format({ search: search });
        });
        return str;
    },
    // return [[hash1, hash_value], ..., [#xxx#, xxx]]
    findSearchText: function (str) {
        var matchs = str.match(this.searchMatchReg);
        var result = [];
        if (matchs) {
            for (var i = 0, len = matchs.length; i < len; i++) {
                var s = matchs[i];
                result.push([s, s.substring(1, s.length - 1)]);
            }
        }
        return result;
    },
    formatSearchText: function (str) { // 格式化主题
        return '#' + str.trim() + '#';
    },
    _at_match_rex: /@([●\w\-\_\u2E80-\u3000\u303F-\u9FFF]+)/g,
    processAt: function (str) {
        //@*** u4e00-\u9fa5:中文字符 \u2E80-\u9FFF:中日韩字符
        //【观点·@任志强】今年提出的1000万套的保障房任务可能根本完不成
        // http://blog.oasisfeng.com/2006/10/19/full-cjk-unicode-range/
        // CJK标点符号：3000-303F
        return str.replace(this._at_match_rex,
            '<a class="getUserTimelineBtn" href="" data-screen_name="$1" rhref="' +
                this.config.user_home_url + '$1" title="' +
                _u.i18n("btn_show_user_title") +'">@$1</a>');
    },
    // 获取str里面所有@用户的名称列表，不包含@符合
    find_at_users: function (str) {
        if (!str) {
            return null;
        }
        var matchs = str.match(this._at_match_rex);
        if (matchs) {
            var users = [];
            for(var i = 0, l = matchs.length; i < l; i++) {
                var name = matchs[i].substring(1);
                if(users.indexOf(name) < 0) {
                    users.push(name);
                }
            }
            return users;
        }
        return null;
    },
    processEmotional: function (str) {
        return str.replace(/\[([\u4e00-\u9fff,\uff1f,\w]+)\]/g, this._replaceEmotional.bind(this));
    },
    _replaceUrl: function (m, g1, g2) {
        var _url = g1;
        if (g1.indexOf('http') !== 0) {
            _url = 'http://' + g1;
        }
        return '<a target="_blank" class="link" href="{{url}}">{{value}}</a>'.format({
            url: _url, title: g1, value: g2 || g1
        });
    },
    EMOTION_TPL: '<img title="{{title}}" src="{{src}}" />',
    _replaceEmotional: function (m, g1) {
        if (g1) {
            if (!this.bgEmotions && typeof getBackgroundView !== 'undefined') {
                this.bgEmotions = getBackgroundView().Emotions;
                if (this.bgEmotions) {
                    this.bgEmotions = this.bgEmotions.weibo;
                }
            }
            var face = this.bgEmotions && this.bgEmotions[g1];
            if (!face) {
                face = TSINA_API_EMOTIONS[g1];
                if (face) {
                    face = TSINA_FACE_URL_PRE + face;
                }
            }
            if (face) {
                return this.EMOTION_TPL.format({ title: m, src: face });
            }
        }
        return m;
    },

    /**
     * 设置认证头, 在函数 #_sendRequest 会调用此函数
     * 
     * @param {any} url 
     * @param {any} args 
     * @param {String} args.type http 请求 method 类型
     * @param {Object} args.data 请求数据
     * @param {Object} user
     * @param {String} user.blogType
     * @param {("baseauth"|"oauth"|"xauth")} user.authType
     * @param {String|undefined} user.userName baseauth使用
     * @param {String|undefined} user.password baseauth使用
     * @param {String|undefined} user.oauth_token_secret oauth1 和 xauth 使用
     * @param {String|undefined} user.oauth_token_key oauth1 和 xauth 使用
     */
    apply_auth: function (url, args, user) {
//      var appkey = null;
//      if(user.blogType === 'tsina' && user.appkey) {
//          // 设在其他key
//          appkey = TSINA_APPKEYS[user.appkey] || [user.appkey, user.appkey];
//          if(appkey && args.data.source) {
//              args.data.source = appkey[1];
//          }
//      }
        if (user.blogType === 'tsina') {
            delete args.data.source;
        }
        user.authType = user.authType || 'baseauth'; //兼容旧版本
        if (user.authType === 'baseauth') {
            args.headers.Authorization = make_base_auth_header(user.userName, user.password);
        } else if (user.authType === 'oauth' || user.authType === 'xauth') {
            var oauth_secret = this.config.oauth_secret;
            var oauth_key = this.config.oauth_key;
            //如果用户提供了api key/secret 则优先使用。
            if (user.blogType === 'twitter' && user.twitter_oauth_token_key && user.twitter_oauth_token_secret) {
                oauth_key = user.twitter_oauth_token_key;
                oauth_secret = user.twitter_oauth_token_secret;
            }
//          if(appkey) {
//              oauth_key = appkey[1];
//              oauth_secret = user.appkey_secret || appkey[2];
//          }
            var accessor = {
                consumerSecret: oauth_secret
            };
            // 已通过oauth认证
            if (user.oauth_token_secret) {
                accessor.tokenSecret = user.oauth_token_secret;
            }
            var parameters = {};
            for (var k in args.data) {
                parameters[k] = args.data[k];
                if (k.substring(0, 6) === 'oauth_') { // 删除oauth_verifier相关参数
                    delete args.data[k];
                }
            }
            var message = {
                action: url,
                method: args.type,
                parameters: parameters
            };
            message.parameters.oauth_consumer_key = oauth_key;
            message.parameters.oauth_version = '1.0';
            // 已通过oauth认证
            if (user.oauth_token_key) {
                message.parameters.oauth_token = user.oauth_token_key;
            }
            // 设置时间戳
            OAuth.setTimestampAndNonce(message);//oauth1认证，设置http请求头部
            // 签名参数
            OAuth.SignatureMethod.sign(message, accessor);
            // oauth参数通过get方式传递
            if (this.config.oauth_params_by_get === true) {
                args.data = message.parameters;
            } else {
                // 获取认证头部
                args.headers.Authorization = OAuth.getAuthorizationHeader(this.config.oauth_realm, message.parameters);
            }
        }
    },

    format_authorization_url: function (params) {
        var login_url = (this.config.oauth_host || this.config.host) + this.config.oauth_authorize;
        params = params || {};
        // params.forcelogin = 'true'; v1.0不支持，而且有了重新授权，不应该加此参数
        return OAuth.addToURL(login_url, params);
    },

    /**
     * 获取认证url，只有oauth才能调用此方法
     */ 
    get_authorization_url: function (user, callback, context) {
        if (user.authType === 'oauth') {
            var login_url = null;
            this.get_request_token(user, function (token, text_status, error_code) {
                if (token) {
                    user.oauth_token_key = token.oauth_token;
                    user.oauth_token_secret = token.oauth_token_secret;
                    // 返回登录url给用户登录
                    var params = {oauth_token: user.oauth_token_key};
                    if (this.config.oauth_callback) {
                        params.oauth_callback = this.config.oauth_callback;
                    }
                    login_url = this.format_authorization_url(params);
                }
                callback.call(context, login_url, text_status, error_code);
            }, this);
        } else {
            throw new Error(user.authType + ' not support get_authorization_url');
        }
    },

    /**
     * 获取request_token，只有在oauth时使用
     * 
     * @param {any} user 
     * @param {any} callback 
     * @param {any} context 
     */
    get_request_token: function (user, callback, context) {
        if (user.authType === 'oauth') {
            var params = {
                url: this.config.oauth_request_token,
                type: 'get',
                user: user,
                play_load: 'string',
                apiHost: this.config.oauth_host,
                data: {},
                need_source: false
            };
            if (this.config.oauth_callback) {
                params.data.oauth_callback = this.config.oauth_callback;
            }
            if (this.config.oauth_request_params) {
                $.extend(params.data, this.config.oauth_request_params);
            }
            this._sendRequest(params, function(token_str, text_status, error_code) {
                var token = null;
                if (text_status !== 'error') {
                    token = decodeForm(token_str);
                    if (!token.oauth_token) {
                        token = null;
                        error_code = token_str;
                        text_status = 'error';
                    }
                }
                callback.call(context, token, text_status, error_code);
            });
        } else {
            throw new Error(user.authType + ' not support get_request_token');
        }
    },


    /**
     * 获取access_token，只有oauth和xauth支持
     * 
     * @param {any} user 
     * @param {String} user.oauth_pin 不能为空
     * @param {any} callback 
     * @param {any} context 
     */
    get_access_token: function(user, callback, context) {
        if (user.authType === 'oauth' || user.authType === 'xauth') {
            var params = {
                url: this.config.oauth_access_token,
                type: 'get',
                user: user,
                play_load: 'string',
                apiHost: this.config.oauth_host,
                data: {},
                need_source: false
            };
            if (user.oauth_pin) {
                params.data.oauth_verifier = user.oauth_pin;
            }
            if (user.authType === 'xauth') {
                params.data.x_auth_username = user.userName;
                params.data.x_auth_password = user.password;
                params.data.x_auth_mode = "client_auth";
            }
            this._sendRequest(params, function (token_str, text_status, error_code) {
                var token = null;
                if (text_status !== 'error') {
                    token = decodeForm(token_str);
                    if (!token.oauth_token) {
                        token = null;
                        error_code = token_str;
                        text_status = 'error';
                    } else {
                        user.oauth_token_key = token.oauth_token;
                        user.oauth_token_secret = token.oauth_token_secret;
                    }
                }
                callback.call(context, token ? user : null, text_status, error_code);
            });
        } else {
            throw new Error(user.authType + ' not support get_access_token');
        }
    },

    /**
     * callbackFn(data, textStatus, errorCode):
            成功和错误都会调用的方法。
            如果失败则errorCode为服务器返回的错误代码(例如: 400)。
    */
    verify_credentials: function (user, callback, data, context){
      if (!user) {
        return callback && callback();
      }
      var params = {
        url: this.config.verify_credentials,
        type: 'get',
        user: user,
        play_load: 'user',//TODO 
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    rate_limit_status: function (data, callback, context) {
        if (!callback) {
            return;
        }
        var params = {
            url: this.config.rate_limit_status,
            type: 'get',
            play_load: 'rate',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // since_id, max_id, count, page
    friends_timeline: function (data, callback, context) {
        var params = {
            url: this.config.friends_timeline,
            type: 'get',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id, user_id, screen_name, since_id, max_id, count, page
    user_timeline: function (data, callback, context) {
      var need_friendship = this.config.user_timeline_need_friendship && data.need_friendship;
      delete data.need_friendship;
      var params = {
        url: this.config.user_timeline,
        type: 'get',
        play_load: 'status',
        data: data
      };

      // Make a Combo object.
      var both = this.combo(function (statuses_args, friendship_args, show_user_args, blocking_args) {
        var friendship = null;
        if (friendship_args && friendship_args[0]) {
          var relationship = friendship_args[0];
          if (relationship.relationship) {
            // twitter
            relationship = relationship.relationship;
          }
          friendship = relationship.target || relationship;
        }
        var statuses_result = statuses_args[0];
        // statuses_result 分为 [] 和 {items:[], user:xx}  两种类型
        var user_info = show_user_args[0];
        if (statuses_result && !user_info) {
          var statuses = statuses_result.items || statuses_result || [];
          if (statuses.length > 0) {
            // 取数组的第一个的user
            user_info = statuses[0].user || statuses[0].sender;
          }
        }
        if (user_info && friendship) {
          user_info.following = friendship.following;
          user_info.followed_by = friendship.followed_by;
        }
        if (statuses_result) {
          statuses_result.user = user_info;
        }
        if (user_info && blocking_args && blocking_args[0]) {
          user_info.blocking = blocking_args[0].result;
        }
        return callback.apply(context, statuses_args);
      });
      var oauth_user = data.user;
      var user_id = data.id || data.name;
      var screen_name = data.screen_name || data.name;
      this._sendRequest(params, both.add());
      // 获取friendships_show
      var friendship_callback = both.add();
      var user_timeline_callback = both.add();
      var user_blocking_callback = both.add();
      var args;
      if (need_friendship) {
        args = {user: oauth_user};
        if (user_id) {
          args.target_id = user_id;
        }
        if (screen_name) {
          args.target_screen_name = screen_name;
        }
        this.friendships_show(args, friendship_callback);
      } else {
        friendship_callback();
      }
      // 需要调用show user获取详细的用户信息
      if (this.config.user_timeline_need_user) {
        args = { user: oauth_user };
        args.id = user_id;
        args.screen_name = screen_name;
        this.user_show(args, user_timeline_callback);
      } else {
        user_timeline_callback();
      }
      if (need_friendship && this.config.support_blocking) {
        args = {user: oauth_user};
        if (user_id) {
          args.user_id = user_id;
        }
        if (screen_name) {
          args.screen_name = screen_name;
        }
        this.blocks_exists(args, user_blocking_callback);
      } else {
        user_blocking_callback();
      }
    },

    // id, count, page
    comments_timeline: function(data, callback, context){
        if (!callback) {
            return;
        }
        var params = {
            url: this.config.comments_timeline,
            type: 'get',
            play_load: 'comment',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id, count, page
    repost_timeline: function(data, callback, context){
        var params = {
            url: this.config.repost_timeline,
            type: 'get',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // since_id, max_id, count, page
    mentions: function (data, callback, context) {
      var params = {
        url: this.config.mentions,
        type: 'get',
        play_load: 'status',
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    comments_mentions: function (data, callback, context) {
      var params = {
        url: this.config.comments_mentions,
        type: 'get',
        play_load: 'status',
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    // id, user_id, screen_name, cursor, count
    followers: function (data, callback, context){
        var params = {
            url: this.config.followers,
            type: 'get',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id, user_id, screen_name, cursor, count
    friends: function (data, callback, context){
        var params = {
            url: this.config.friends,
            type: 'get',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // page
    favorites: function (data, callback, context) {
      var params = {
        url: this.config.favorites,
        type: 'get',
        play_load: 'status',
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    // id
    favorites_create: function (data, callback, context) {
      var params = {
        url: this.config.favorites_create,
        type: 'post',
        play_load: 'status',
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    // id
    favorites_destroy: function(data, callback, context) {
        var params = {
            url: this.config.favorites_destroy,
            type: 'post',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // ids
    counts: function(data, callback, context) {
      if (!callback) {
        return;
      }
      var params = {
        url: this.config.counts,
        type: 'get',
        play_load: 'count',
        data: data
      };
      this._sendRequest(params, callback, context);
    },

    // id
    user_show: function(data, callback, context){
        var params = {
            url: this.config.user_show,
            type: 'get',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // since_id, max_id, count
    direct_messages: function(data, callback, context){
        var params = {
            url: this.config.direct_messages,
            type: 'get',
            play_load: 'message',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // since_id, max_id, count
    sent_direct_messages: function(data, callback, context) {
        var params = {
            url: this.config.sent_direct_messages,
            type: 'get',
            play_load: 'message',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id
    destroy_msg: function(data, callback, context) {
        var params = {
            url: this.config.destroy_msg,
            type: 'post',
            play_load: 'message',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    /*data的参数列表：
    text 待发送消息的正文，请确定必要时需要进行URL编码 ( encode ) ，另外，不超过140英文或140汉字。
    message 必须 0 表示悄悄话 1 表示戳一下
    receiveUserId 必须，接收方的用户id
    source 可选，显示在网站上的来自哪里对应的标识符。如果想显示指定的字符，请与官方人员联系。
    */
    new_message: function(data, callbackFn, context) { // 私信
        if (!callbackFn) {
            return;
        }
        if (data && data.text) {
            data.text = this.url_encode(data.text);
        }
        var params = {
            url: this.config.new_message,
            type: 'post',
            play_load: 'message',
            data: data
        };
        this._sendRequest(params, callbackFn, context);
    },

    // id
    status_show: function(data, callback, context) {
        var params = {
            url: this.config.status_show,
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    get_geo: function () {
        var settings = Settings.get();
        if (this.config.support_geo && settings.isGeoEnabled && settings.geoPosition){
            if (settings.geoPosition.latitude) {
                return settings.geoPosition;
            }
        }
        return null;
    },

    // 格式化经纬度参数
    format_geo_arguments: function(data, geo){
        data[this.config.latitude_field] = geo.latitude;
        data[this.config.longitude_field] = geo.longitude;
    },
    _getSendMessage: function(data) {
        var blogType = (data.user ? data.user.blogType : data.blogType) || '';
        if (blogType === 'weibo') {
            return data.status + ' ' + FAWAVE_SERVER_BASE_URL;
        } else {
            return data.status;
        }
    },
    update: function(data, callback, context){
        var geo = this.get_geo();
        if (geo) {
            this.format_geo_arguments(data, geo);
        }
        if (data && data.status) {
            data.status = this._getSendMessage(data);
            data.status = this.url_encode(data.status);
        }
        var params = {
            url: this.config.update,
            type: 'post',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // 格式上传参数，方便子类覆盖做特殊处理
    // 子类可以增加自己的参数
    format_upload_params: function (user, data, pic) {

    },

    parse_upload_result: function (data) {
        return JSON.parse(data);
    },

    /* 上传图片
     * user: 当前用户
     * data: {source: xxx, status: xxx, ...}
     * pic: {keyname: 'pic', file: fileobj}
     * before_request: before_request function
     * onprogress: on_progress_callback function
     * callback: finish callback function
     * */
    upload: function (user, data, pic, before_request, onprogress, callback, context) {
        var auth_args = { type: 'post', data: {}, headers: {} };
        pic.keyname = pic.keyname || 'pic';
        data.source = data.source || this.config.source;
        if (data.status) {
            data.blogType = user.blogType;
            data.status = this._getSendMessage(data);
            delete data.blogType;
        }
        if (data.need_source === false) {
            delete data.need_source;
            delete data.source;
        }
        var geo = this.get_geo();
        if (geo) {
            this.format_geo_arguments(data, geo);
        }
        this.format_upload_params(user, data, pic);
        var boundary = '----multipartformboundary' + new Date().getTime();
        var dashdash = '--';
        var crlf = '\r\n';

        /* Build RFC2388 string. */
        var builder = '';

        builder += dashdash;
        builder += boundary;
        builder += crlf;

        for (var key in data) {
            // set auth params
            auth_args.data[key] = this.url_encode(data[key]);
        }
        var api = user.apiProxy || this.config.host;
        var resultFormat = this.config.result_format;
        if ('__uploadFormat' in data) {
            resultFormat = data.__uploadFormat;
            delete data.__uploadFormat;
        }
        var url = api + this.config.upload + resultFormat;
        if (this.config.use_method_param) {
            // 只使用method 做参数, 走rest api
            url = api;
        } else if (data.__upload_url) {
            url = data.__upload_url  + resultFormat;
            delete data.__upload_url;
            delete auth_args.data.__upload_url;
        }

        // 设置认证头部
        this.apply_auth(url, auth_args, user);
        for (var key in auth_args.data) {
            /* Generate headers. key */
            builder += 'Content-Disposition: form-data; name="' + key + '"';
            builder += crlf;
            builder += crlf;
             /* Append form data. */
            builder += auth_args.data[key];
            builder += crlf;

            /* Write boundary. */
            builder += dashdash;
            builder += boundary;
            builder += crlf;
        }
        /* Generate headers. [PIC] */
        builder += 'Content-Disposition: form-data; name="' + pic.keyname + '"';
        var fileName = pic.file.fileName || pic.file.name;
        if (fileName) {
          builder += '; filename="' + this.url_encode(fileName) + '"';
        }
        builder += crlf;

        builder += 'Content-Type: '+ (pic.file.fileType || pic.file.type);
        builder += crlf;
        builder += crlf;

        // console.log(builder)
        var parts = [];
        parts.push(builder);
        parts.push(pic.file);
        builder = crlf;

        /* Mark end of the request.*/
        builder += dashdash;
        builder += boundary;
        builder += dashdash;
        builder += crlf;
        parts.push(builder);

        if (before_request) {
          before_request();
        }
        var that = this;
        $.ajax({
            url: url,
            cache: false,
            timeout: 5 * 60 * 1000, //5分钟超时
            type : 'post',
            data: buildBlob(parts),
            dataType: 'text',
            contentType: 'multipart/form-data; boundary=' + boundary,
            processData: false,
            xhr: xhr_provider(onprogress),
            beforeSend: function (req) {
                for (var k in auth_args.headers) {
                    req.setRequestHeader(k, auth_args.headers[k]);
                }
            },
            success: function (data, textStatus, xhr) {
             // 如果没有网络，则会返回['', 'success', xhr.status === 0, xhr.statusText === '']
                var no_net_work = false;
                if (data === '' && textStatus === 'success' && xhr.status === 0 && xhr.statusText === '') {
                    no_net_work = true;
                    textStatus = 'error';
                    data = {error: 'No network', error_code: 10000};
                }
                if (!no_net_work) {
                    try {
                        data = that.parse_upload_result(data);
                    }
                    catch(err) {
                        data = { error: _u.i18n("comm_error_return") + ' [json parse error]', error_code: 500 };
                        textStatus = 'error';
                    }
                }
                var error_code = null;
                if (data) {
                    error_code = data.error_code;
                    var error = data.errors || data.error || data.wrong || data.error_msg;
                    if (data.ret && data.ret !== 0) { //腾讯
                        error = data.msg;
                        error_code = data.ret;
                    }
                    if (error) {
                        data.error = error;
                        textStatus = 'error';
                        var message = that.format_error(error, error_code, data);
                        _showMsg('error: ' + message + ', error_code: ' + error_code, false, true);
                    }
                } else {
                    error_code = 400;
                }
                callback.call(context, data, textStatus, error_code);
            },
            error: function (xhr, textStatus, errorThrown) {
                var r = null, status = 'unknow';
                if (xhr) {
                    if (xhr.status) {
                        status = xhr.status;
                    }
                    if (xhr.responseText) {
                        var r = xhr.responseText;
                        try {
                            r = JSON.parse(r);
                        }
                        catch (err) {
                            r = null;
                        }
                        if (r) {
                            _showMsg('error_code:' + r.error_code + ', error:' + r.error, false, true);
                        }
                    }
                }
                if (!r) {
                    textStatus = textStatus ? ('textStatus: ' + textStatus + '; ') : '';
                    errorThrown = errorThrown ? ('errorThrown: ' + errorThrown + '; ') : '';
                    _showMsg('error: ' + textStatus + errorThrown + 'statuCode: ' + status, false, true);
                }
                callback.call(context, r || {}, 'error', status); //不管什么状态，都返回 error
            }
        });
    },

    repost: function(data, callback, context) {
        if (data && data.status) {
            data.status = this._getSendMessage(data);
            data.status = this.url_encode(data.status);
        }
        var params = {
            url: this.config.repost,
            type: 'post',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    comment: function(data, callback, context){
        if (data && data.comment) {
            data.comment = this.url_encode(data.comment);
        }
        var params = {
            url: this.config.comment,
            type: 'post',
            play_load: 'comment',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    reply: function(data, callback, context){
        if (!callback) {
          return;
        }
        if (data && data.comment) {
            data.comment = this.url_encode(data.comment);
        }
        var params = {
            url: this.config.reply,
            type: 'post',
            play_load: 'comment',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    comments: function(data, callback, context){
        if (!callback) {
          return;
        }
        var params = {
            url: this.config.comments,
            type: 'get',
            play_load: 'comment',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id
    comment_destroy: function(data, callback, context){
        if(!callback) return;
        var params = {
            url: this.config.comment_destroy,
            type: 'post',
            play_load: 'comment',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    friendships_create: function (data, callback, context) {
        var params = {
            url: this.config.friendships_create,
            type: 'post',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id
    friendships_destroy: function (data, callback, context) {
        var params = {
            url: this.config.friendships_destroy,
            type: 'post',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },
    // [source_id, source_screen_name, ]target_id, target_screen_name
    friendships_show: function (data, callback, context) {
        var params = {
            url: this.config.friendships_show,
            type: 'get',
            play_load: 'object',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // type
    reset_count: function(data, callback, context){
        var params = {
            url: this.config.reset_count,
            type: 'post',
            play_load: 'result',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // user_id, count, page
    tags: function(data, callback, context) {
        var params = {
            url: this.config.tags,
            play_load: 'tag',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // count, page
    tags_suggestions: function(data, callback, context) {
        var params = {
            url: this.config.tags_suggestions,
            play_load: 'tag',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // tags
    create_tag: function(data, callback, context) {
        var params = {
            url: this.config.create_tag,
            type: 'post',
            play_load: 'tag',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // tag_id
    destroy_tag: function(data, callback, context) {
        var params = {
            url: this.config.destroy_tag,
            type: 'post',
            play_load: 'tag',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // id
    destroy: function(data, callback, context){
        var params = {
            url: this.config.destroy,
            type: 'POST',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // page, count
    blocks_blocking: function(data, callback, context) {
        var params = {
            url: this.config.blocks_blocking,
            type: 'get',
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // page, count
    blocks_blocking_ids: function(data, callback, context) {
        var params = {
            url: this.config.blocks_blocking_ids,
            type: 'get',
            play_load: 'json',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // user_id
    blocks_create: function(data, callback, context) {
        var params = {
            url: this.config.blocks_create,
            type: 'post',
            play_load: 'json',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // user_id
    blocks_destroy: function(data, callback, context) {
        var params = {
            url: this.config.blocks_destroy,
            type: 'post',
            play_load: 'json',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // user_id
    blocks_exists: function(data, callback, context) {
        var params = {
            url: this.config.blocks_exists,
            type: 'get',
            play_load: 'json',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // q, max_id, count
    search: function(data, callback, context) {
        var params = {
            url: this.config.search,
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    // q, page, count
    user_search: function(data, callback, context) {
        var params = {
            url: this.config.user_search,
            play_load: 'user',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    /**
     * 格式化响应数据，其他微博实现兼容新浪微博的数据格式
     * @param {Array[Object]|Object} data
     * @param {Array[Object]|undefined} data.results
     * @param {Array[Object]|undefined} data.users
     * @param {Array[Object]|undefined} data.statuses
     * @param {String|undefined} data.next_page
     * @param {String} [output] data.max_id
     * @param {Object|undefined} data.search_metadata
     * @param {String|undefined} data.search_metadata.next_page
     * @param {('status'|'user'| 'comment'| 'message'| 'count'| 'result(reset_count)')} play_load
     * @param {Object} args 请求参数
     * 
     * @return {Object} data
     */
    format_result: function (data, play_load, args) {
      var items = data;
      if (!$.isArray(items)) {
        items = data.results || data.users || data.statuses;
      }
      if ($.isArray(items)) {
        for (var i = 0, l = items.length; i < l; i++) {
          items[i] = this.format_result_item(items[i], play_load, args);
        }
      } else {
        data = this.format_result_item(data, play_load, args);
      }
      var next_results;
      if (args.url === this.config.search && data.next_page) {
        next_results = data.next_page;
      }
      if (data && data.search_metadata && data.search_metadata.next_results) {
        next_results = data.search_metadata.next_results;
      }
      if (next_results) {
        // next_results: "?max_id=345344279792726015&q=fawave&count=20&include_entities=1"
        // "next_page":"?page=2&max_id=1291867917&q=fawave", 提取max_id
        var p = decodeForm(next_results);
        data.max_id = p.max_id;
      }
      return data;
    },
    /**
     * 返回数据实体格式化
     * @param {Object} data
     * @param {{String:screen_name,String:profile_image_url,id:String}} [output] data.user 返回的用户数据结构
     * @param {String} data.from_user 用户昵称
     * @param {String} data.profile_image_url 用户头像
     * @param {String} data.from_user_id 用户id
     * @param {String} data.id 消息ID
     * @param {String} data.mid 微博ID
     * @param {Array[String]|undefined} data.pic_urls, 根据其返回数据 {Array[String]:thumbnail_pic,Array[String]:bmiddle_pic,Array[String]:original_pic}
     * @param {Object} data.retweeted_status
     * @param {('user'|'status'|'message'|'comment')} play_load
     * @param {Object} args
     * @param {Object} 
     */
    format_result_item: function (data, play_load, args) {
        if (!data) {
            return data;
        }
        if (play_load === 'user' && data && data.id) {
            data.t_url = 'http://weibo.com/' + (data.domain || data.id);
        } else if (play_load === 'status') {
            if (!data.user) { // search data
                data.user = {
                    screen_name: data.from_user,
                    profile_image_url: data.profile_image_url,
                    id: data.from_user_id
                };
                delete data.profile_image_url;
                delete data.from_user;
                delete data.from_user_id;
            }
            this.format_result_item(data.user, 'user', args);
//          var tpl = this.config.host + '/{{user.id}}/statuses/{{id}}';
//          // 设置status的t_url
//          data.t_url = tpl.format(data);
            data.t_url = 'http://weibo.com/' + data.user.id + '/' + WeiboUtil.mid2url(data.mid);
            // 多图
            if (data.pic_urls && data.pic_urls.length > 1) {
                data.bmiddle_pic = [];
                data.original_pic = [];
                data.thumbnail_pic = [];
                for (var i = 0; i < data.pic_urls.length; i++) {
                    var pic = data.pic_urls[i];
                    data.thumbnail_pic.push(pic.thumbnail_pic);
                    data.bmiddle_pic.push(pic.thumbnail_pic.replace('/thumbnail/', '/bmiddle/'));
                    data.original_pic.push(pic.thumbnail_pic.replace('/thumbnail/', '/large/'));
                }
            }
            if (data.retweeted_status) {
                data.retweeted_status = this.format_result_item(data.retweeted_status, 'status', args);
            }
        } else if(play_load == 'message') {
            this.format_result_item(data.sender, 'user', args);
            this.format_result_item(data.recipient, 'user', args);
        } else if(play_load == 'comment') {
            this.format_result_item(data.user, 'user', args);
            this.format_result_item(data.status, 'status', args);
        }
        return data;
    },

    // urlencode，子类覆盖是否需要urlencode处理
    url_encode: function (text) {
      return text;
      // return encodeURIComponent(text);
    },
    /**
     * 格式化请求数据
     * 
     * @param {Object} args
     * @param {Object} user
     */
    before_sendRequest: function (args, user) {

    },

    format_error: function(error, error_code, data) {
        if (this.config.ErrorCodes) {
            error = this.config.ErrorCodes[error] || error;
        }
        return error;
    },
    /**
     * 解析http请求响应数据
     * 
     * @param {Object|undefined} [input+output] data 请求返回数据
     * @param {Number|undefined} data.ret
     * @param {String|undefined} data.error
     * @param {String|Array[Object]|undefined} data.errors
     * @param {String} play_load 请求类型 
     * @param {String} args 请求参数
     * @return {error_textStatus:String, error_code:Number} result
     */
    parseResponse: function(data,play_load,args) {
        var error_code = null;
        var error_textStatus = null;
        if(data) {
            error_code = data.error_code || data.code;
            var error = data.error || data.error_msg;
            if(data.ret && data.ret !== 0) { //腾讯
                if(data.msg === 'have no tweet'){
                    data.data = {info:[]};
                } else if(data.ret === 4 && data.errcode === 0) {
                    error = null;
                    data = {};
                } else {
                    error = data.msg;
                    error_code = data.ret;
                }
            } else {
                // 腾讯正确的结果
                if(data.ret !== undefined && (data.msg === 'have no tweet' || data.msg === 'have no user')) {
                    data.data = {info:[]};
                }
            }
            if(!error && data.errors) {
                if(typeof(data.errors)==='string') {
                    error = data.errors;
                }else if(data.errors.length){ //'{"errors":[{"code":53,"message":"Basic authentication is not supported"}]}'
                    if(data.errors[0].message){
                        error = data.errors[0].message;
                    }else{
                        for(var i in data.errors[0]){
                            error += i + ': ' + data.errors[0][i];
                        }
                    }
                }
            }
            if(error || error_code) {
                data.error = error;
                error_textStatus = this.format_error(data.error || data.wrong || data.message || data.error_msg, error_code, data);
                
                error_code = error_code || 'unknow';
                
            } else {
                //成功再去格式化结果
                data = this.format_result(data, play_load, args);
            }
        } else {
            error_code = 999;
        }
        //callbackFn && callbackFn.call(context, data, textStatus, error_code);
        return {error_textStatus, error_code,newData:data};
    },

    _toastErrorMsg: function(callmethod,error_textStatus,error_code) {
        var error_msg = callmethod + ' error: ' + error_textStatus;
        if(!error_textStatus && error_code){ // 错误为空，才显示错误代码
            error_msg += ', error_code: ' + error_code;
        }
        showMsg(error_msg, false, true);
    },
    
    /**
     * 请求回调函数.
     *
     * @callback RequestCallback
     * @param {Object} context
     * @param {Object} data
     * @param {String} textStatus
     * @param {Number|String} error_code
     */
    
	/**
	 * 发送  http 请求，其间会调用 #before_sendRequest 和 #apply_auth
	 * 
	 * @param {Object} params
	 * @param {String} params.payload 格式化数据格式，其他微博实现兼容新浪微博的数据格式 status, user, comment, message, count, result(reset_count)
	 * @param {String|undefined} params.type http请求method，GET 或者 POST
	 * @param {String} params.url 请求链接地址
	 * @param {Boolean} params.need_source
	 * @param {Object|undefined} params.user
	 * @param {String|undefined} params.contentType http 请求content-type头
	 * @param {String} params.content
	 * @param {Object|undefined} params.data 请求数据
	 * @param {Object|undefined} params.data.user
	 * @param {RequestCallback} callbackFn
	 * @param {Object} context
	 */
    _sendRequest: function (params, callbackFn, context) {
        var args = { type: 'get', play_load: 'status', headers: {} };
        $.extend(args, params);
        args.data = args.data || {};
        args.data.source = args.data.source || this.config.source;
        if (args.need_source === false) {
            delete args.need_source;
            delete args.data.source;
        }
        if (!args.url) {
            showMsg('url未指定', true);
            callbackFn({}, 'error', '400');
            return;
        }
        var user = args.user || args.data.user || localStorage.getObject(CURRENT_USER_KEY);
        if (!user) {
            showMsg('用户未指定', true);
            callbackFn({}, 'error', 400);
            return;
        }
        args.user = user;
        if (args.data && args.data.user) {
            delete args.data.user;
        }
        // 请求前调用
        this.before_sendRequest(args, user);

        if (!args.type || args.type.toUpperCase() === 'GET') {
            // 腾讯直接加额外参数的话oauth通不过
            if (user.blogType !== 'tqq'){
                // 不缓存。需要加入oauth验证，所以放在oauth之前。
                args.data.nocache = new Date().getTime();
            }
        }

        var api = user.apiProxy || args.apiHost || this.config.host;
        var url = api + args.url.format(args.data);
        if (args.play_load !== 'string' && this.config.result_format) {
          url += this.config.result_format;
        }
        // 删除已经填充到url中的参数
        var pattern = /\{\{([\w\s\.\(\)\'\",-]+)?\}\}/g;
        args.url.replace(pattern, function(match, key) {
            delete args.data[key];
        });
        // 设置认证头部
        this.apply_auth(url, args, user);
        var play_load = args.play_load; // 返回的是什么类型的数据格式
        delete args.play_load;
        var callmethod = user.uniqueKey + ': ' + args.type + ' ' + args.url;
        var request_data = args.content || args.data;
        var processData = !args.content;
        var contentType = args.contentType || 'application/x-www-form-urlencoded';
        
        $.ajax({
            url: url,
//            cache: false, // chrome不会出现ie本地cache的问题, 若url参数带有_=xxxxx，digu无法获取完整的用户信息
            timeout: 60*1000, //一分钟超时
            type: args.type,
            data: request_data,
            contentType: contentType,
            processData: processData,
            dataType: 'text',
            context: this,
            beforeSend: function (req) {
                for (var key in args.headers) {
                    req.setRequestHeader(key, args.headers[key]);
                }
            },
            success: function (data, textStatus, xhr) {
                // 如果没有网络，则会返回['', 'success', xhr.status === 0, xhr.statusText === '']
                var no_net_work = false;
                if(data === '' && textStatus === 'success' && xhr.status === 0 && xhr.statusText === '') {
                    no_net_work = true;
                    textStatus = 'error';
                    data = {error: 'No network', error_code: 10000};
                }
                /******
                 * FaWave内部错误码：
                 *   800: JSON解析错误
                 *   999: 服务器返回结果不对，未知错误
                 */
                if (play_load !== 'string' && !no_net_work) {
                    data = data.replace(RE_JSON_BAD_WORD, '');
                    try {
                        data = JSON.parse(data);
                    }
                    catch(err) {//返回数据不能被格式化为json
                        if(xhr.status == 201 || xhr.statusText == "Created") { // rest成功
                            if(!data) {
                                data = true;
                            }
                        } else {
                            if(data.indexOf('{"wrong":"no data"}') > -1 || data === '' || data.toLowerCase() == 'ok') {
                                data = [];
                            } else {
                                data = {error: callmethod + ' ' + _u.i18n("comm_error_return")
                                        + ' ' + err.message, error_code:500};
                                textStatus = 'error';
                            }
                        }
                    }
                }
                
                var {error_textStatus, error_code,newData} = this.parseResponse(data,play_load, args);
                if (error_code) {
                    this._toastErrorMsg(callmethod,error_textStatus,error_code);
                }

                callbackFn && callbackFn.call(context, newData || data,  error_textStatus || textStatus, error_code);
                
                hideLoading();
            },
            error: function (xhr, textStatus, errorThrown) {
                var r = null, status = 'unknow';
                try{
                    if(xhr){
                        if(xhr.status){
                            status = xhr.status;
                        }
                        if(xhr.responseText){
                            var r = xhr.responseText;
                            try{
                                r = JSON.parse(r);
                            }
                            catch(err){
                                r = null;
                            }
                            if(r){
                                if(typeof(r.error) === 'object') {
                                    r = r.error;
                                }
                                var error_code = r.error_code || r.code || r.type;
                                r.error = this.format_error(r.error || r.wrong || r.message || r.error_text || r.msg, error_code, r);
                                if (!r.error && r.errors) {
                                  if (typeof r.errors[Symbol.iterator] === 'function') { // 检查errors是不是iterable
                                    if (r.errors[0] && r.errors[0].code == 261) {
                                      r.error = "twitter restricted our api key. cannot send anything. use your own api key/secret, get them from https://developer.twitter.com"
                                    }
                                  }
                                }
                                if (!args.dont_show_error) {
                                    var error_msg = callmethod + ' error: ' + r.error;
                                    if(!r.error && error_code){ // 错误为空，才显示错误代码
                                        error_msg += ', error_code: ' + error_code;
                                    }
                                    showMsg(error_msg, false, true);
                                }
                            }
                        }
                    }
                } catch (err) {
                    r = null;
                }
                if (!r) {
                    textStatus = textStatus ? ('textStatus: ' + textStatus + '; ') : '';
                    errorThrown = errorThrown ? ('errorThrown: ' + errorThrown + '; ') : '';
                    r = {error:callmethod + ' error: ' + textStatus + errorThrown + ' statuCode: ' + status};
                    if(!args.dont_show_error) {
                        showMsg(r.error, false, true);
                    }
                }
                callbackFn.call(context, r||{}, 'error', status); // 不管什么状态，都返回 error
                hideLoading();
            }
        });
    }
};


//以下为一些有用的函数或者扩展

// 生成HTTP Basic Authentication的字符串："Base base64String"
function make_base_auth_header(user, password) {
  var tok = user + ':' + password;
  var hash = Base64.encode(tok);
  return "Basic " + hash;
}

// 生成HTTP Basic Authentication的url："http://userName:password@domain.com"
function make_base_auth_url(domain, user, password) {
  return "http://" + user + ":" + password + "@" + domain;
}

var WeiboAPI2 = Object.inherits({}, sinaApi, {
  config: Object.inherits({}, sinaApi.config, {
    oauth_access_token: '/access_token',
    oauth_authorize: '/authorize',
    oauth_callback: OAUTH_CALLBACK_URL2,
    oauth_host: 'https://api.weibo.com/oauth2',

    support_direct_messages: false,
    support_sent_direct_messages: false,
    support_blocking: false,
    support_comments_mentions: true,
    support_like: true, // 支持赞
    host: 'https://api.weibo.com/2',
    verify_credentials: '/users/show',

    // status
    destroy: '/statuses/destroy',
    // comment
    comments: '/comments/show',
    comments_timeline: '/comments/timeline',
    comments_mentions: '/comments/mentions',
    comment: '/comments/create',
    reply: '/comments/reply',
    comment_destroy: '/comments/destroy',
    // search
    support_search: false,
    search: '/search/topics',
    user_search: '/search/suggestions/users',
    // friendship
    user_timeline_need_friendship: false, // user自带此信息
    followers: '/friendships/followers',
    friends: '/friendships/friends',
  }),

  apply_auth: function (url, args, user) {
    delete args.data.source;
    if (args.__refresh_access_token) {
      return;
    }
    if (user.oauth_token_key) {
      args.data.access_token = user.oauth_token_key;
    }
  },

  get_access_token: function (user, callback, context) {
    var params = {
      url: this.config.oauth_access_token,
      type: 'post',
      user: user,
      play_load: 'string',
      apiHost: this.config.oauth_host,
      data: {
        code: user.oauth_pin,
        client_id: this.config.oauth_key,
        client_secret: this.config.oauth_secret,
        redirect_uri: this.config.oauth_callback,
        grant_type: 'authorization_code'
      },
      need_source: false
    };
    this._sendRequest(params, function (data, text_status, error_code) {
      data = JSON.parse(data);
      if (text_status !== 'error' && data && data.access_token) {
        // https://developers.google.com/accounts/docs/OAuth2InstalledApp?hl=zh-CN#choosingredirecturi
        user.oauth_token_key = data.access_token;
        user.oauth_expires_in = data.expires_in;
        user.oauth_token_type = data.token_type;
        user.oauth_refresh_token = data.refresh_token;
        user.oauth_remind_in = data.remind_in;
        user.uid = data.uid;
      } else {
        user = null;
        text_status = text_status || 'error';
        error_code = error_code || JSON.stringify(data);
      }
      callback.call(context, user, text_status, error_code);
    });
  },

  // http://open.weibo.com/wiki/Oauth2
  get_authorization_url: function (user, callback, context) {
    var params = {
      response_type: 'code',
      client_id: this.config.oauth_key,
      redirect_uri: this.config.oauth_callback,
      // forcelogin: 'true'
    };
    var loginURL = this.config.oauth_host + this.config.oauth_authorize + '?';
    var args = [];
    for (var k in params) {
      args.push(k + '=' + encodeURIComponent(params[k]));
    }
    loginURL += args.join('&');
    callback.call(context, loginURL, 'success', 200);
  },

  url_encode: function (text) {
    return text;
  },

  before_sendRequest: function (args, user) {
    switch (args.url) {
      case this.config.verify_credentials:
        args.data.uid = user.uid;
        break;
      case this.config.friendships_destroy:
      case this.config.friendships_create:
        args.data.uid = args.data.id;
        delete args.data.id;
        break;
      case this.config.friends:
      case this.config.followers:
        if (args.data.user_id) {
          args.data.uid = args.data.user_id;
          delete args.data.user_id;
        }
        break;
    }
  },

  format_result: function (data, play_load, args) {
    var items = data;
    if (!$.isArray(items)) {
      items = data.results || data.users ||
        data.statuses || data.comments || data.favorites || data.reposts;
    }
    if ($.isArray(items)) {
      var needs = [];
      for (var i = 0, l = items.length; i < l; i++) {
        items[i] = this.format_result_item(items[i], play_load, args);
      }
      if (data.statuses || data.comments || data.favorites || data.reposts) {
        data.items = items;
        delete data.statuses;
        delete data.comments;
        delete data.favorites;
        delete data.reposts;
      }
    } else {
      data = this.format_result_item(data, play_load, args);
      if (args.url === this.config.rate_limit_status) {
        if (data.limit_time_unit === 'HOURS') {
          data.hourly_limit = data.user_limit;
          data.remaining_hits = data.remaining_user_hits;
        }
      }
    }
    return data;
  },

  reset_count: function (data, callback, context) {
    callback.call(context);
  },
});

WeiboAPI2._format_result_item = WeiboAPI2.format_result_item;
WeiboAPI2.format_result_item = function (data, play_load, args) {
  if (args.url === this.config.favorites && play_load === 'status' && data.favorited_time) {
    var status = data.status;
    status.favorited_time = data.favorited_time;
    status.favorited_tags = data.tags;
    data = status;
  }
  if (play_load === 'status' && data && data.deleted === '1') {
    if (!data.user) {
      data.user = {
        id: '0',
        profile_image_url: 'http://tp1.sinaimg.cn/7539050679/50/7539050679/1'
      };
    }
    return data;
  }
  data = this._format_result_item(data, play_load, args);
  if (data && play_load === 'user') {
    data.followed_by = data.following; // 我的关注
    data.following = data.follow_me; // 我的粉丝
  }
  return data;
};

// 腾讯微博api
var TQQAPI = Object.inherits({}, WeiboAPI2, {
  config: Object.inherits({}, WeiboAPI2.config, {
    host: 'https://open.t.qq.com/api',
    user_home_url: 'http://t.qq.com/',
    search_url: 'http://t.qq.com/k/',
    result_format: '',
    source: 'b6d893a83bd54e598b5a7c359599190a',
    oauth_key: 'b6d893a83bd54e598b5a7c359599190a',
    oauth_secret: '34ad78be42426de26e5c4b445843bb78',
    oauth_host: 'https://open.t.qq.com',
    oauth_authorize:      '/cgi-bin/oauth2/authorize',
    // oauth_request_token:  '/cgi-bin/request_token',
    oauth_access_token:   '/cgi-bin/oauth2/access_token',
    oauth_callback: 'https://chrome.google.com/webstore/detail/fawave/aicelmgbddfgmpieedjiggifabdpcnln/callback',
    // 竟然是通过get传递
    oauth_params_by_get: true,
    support_comment: true, // 不支持评论列表，不支持转发 ＋ 评论
    support_do_comment: true,
    support_repost: true,
    support_direct_messages: true,
    support_sent_direct_messages: true, //是否支持自己发送的私信
    support_comment_repost: false, // 判断是否支持评论同时转发
    support_repost_comment: false, // 判断是否支持转发同时发评论
    support_repost_comment_to_root: false, // 判断是否支持转发同时给原文作者发评论
    support_repost_timeline: true, // 支持查看转发列表
    support_favorites_max_id: true,
    support_comments_mentions: false,
    reply_dont_need_at_screen_name: true, // @回复某条微博 无需填充@screen_name
    rt_at_name: true, // RT的@name而不是@screen_name
    repost_delimiter: ' || ', //转发时的分隔符
    support_counts: true,
    support_counts_max_id_num: 29,
    max_image_size: 4 * 1024 * 1024,
    latitude_field: 'wei', // 纬度参数名
    longitude_field: 'jing', // 经度参数名
    friends_timeline: '/statuses/home_timeline',
    repost_timeline:      '/t/re_list_repost',
    user_timeline_need_friendship: false, // show_user信息中已经包含
    user_timeline_need_user: true,
    show_fullname: true,
    support_blocking: true,
    support_like: false,
    syncflag: 1, // 微博同步到空间分享标记（可选，0-同步，1-不同步，默认为1）

    blocks_blocking:      '/friends/blacklist',
    blocks_blocking_ids:  '/friends/blacklist/ids',
    blocks_create:        '/friends/addblacklist',
    blocks_destroy:       '/friends/delblacklist',
    blocks_exists:        '/friends/exists',

    mentions:             '/statuses/mentions_timeline',
    followers:            '/friends/user_fanslist',
    friends:              '/friends/user_idollist',
    favorites:            '/fav/list_t',
    favorites_create:     '/fav/addt',
    favorites_destroy:    '/fav/delt',
    counts:               '/t/re_count',
    // 转发的统计接口竟然还是不一样的
    // http://open.t.qq.com/resource.php?i=1,1#8_100
    sub_counts:           '/t/sub_re_count',
    status_show:          '/t/show',
    update:               '/t/add',
    upload:               '/t/add_pic',
    repost:               '/t/re_add',
    comment:              '/t/comment',
    comments:             '/t/re_list',
    destroy:              '/t/del',
    destroy_msg:          '/private/del',
    direct_messages:      '/private/recv',
    sent_direct_messages: '/private/send',
    new_message:          '/private/add',
    rate_limit_status:    '/account/rate_limit_status',
    friendships_create:   '/friends/add',
    friendships_destroy:  '/friends/del',
    friendships_show:     '/friends/check',
    reset_count:          '/info/update',
    user_show:            '/user/other_info',

    // 用户标签
    tags:                 '/tags',
    create_tag:           '/tags/create',
    destroy_tag:          '/tags/destroy',
    tags_suggestions:     '/tags/suggestions',

    // 搜索
    search:               '/search/t',
    user_search:          '/search/user',
    verify_credentials: '/user/info',

    gender_map: {0:'n', 1:'m', 2:'f'}
  }),

  apply_auth: function (url, args, user) {
    var oauth_consumer_key = TQQAPI.config.oauth_key;
    delete args.data.source;
    if (args.__refresh_access_token) {
      return;
    }

    if (user.oauth_token_key) {
      args.data.access_token = user.oauth_token_key;
      args.data.oauth_consumer_key = oauth_consumer_key;
      args.data.openid = user.openid;
      args.data.oauth_version = '2.a';
      args.data.scope = 'all';
    }
  },

  get_access_token: function (user, callback, context) {
    var params = {
      url: this.config.oauth_access_token,
      type: 'post',
      user: user,
      play_load: 'string',
      apiHost: this.config.oauth_host,
      data: {
        code: user.oauth_pin,
        client_id: this.config.oauth_key,
        client_secret: this.config.oauth_secret,
        redirect_uri: this.config.oauth_callback,
        grant_type: 'authorization_code'
      },
      need_source: false
    };
    this._sendRequest(params, function (data, text_status, error_code) {
      if (text_status !== 'error' && data) {
        data = decodeForm(data);
        user.oauth_token_key = data.access_token;
        user.oauth_expires_in = data.expires_in;
        user.oauth_token_type = data.token_type;
        user.oauth_refresh_token = data.refresh_token;
        user.oauth_remind_in = data.remind_in;
        user.uid = data.name;
        user.openid = data.openid;
      } else {
        user = null;
        text_status = text_status || 'error';
        error_code = error_code || JSON.stringify(data);
      }
      callback.call(context, user, text_status, error_code);
    });
  },

  // http://code.google.com/p/falang/issues/detail?id=224
  RET_ERRORS: {
    0: '成功返回',
    1: '参数错误',
    2: '频率受限',
    3: '鉴权失败',
    4: '服务器内部错误'
  },
  // RET=4,二级错误字段【发表接口】errcode 说明：
  RET4_ERRCODES: {
//      0: '表示成功',
    4: '表示有过多脏话',
    5: '禁止访问',
    6: '该记录不存在',
    8: '内容超过最大长度：420字节 （以进行短url处理后的长度计）',
    9: '包含垃圾信息：广告，恶意链接、黑名单号码等',
    10: '发表太快，被频率限制',
    11: '源微博已删除',
    12: '源微博审核中',
    13: '重复发表'
  },
  // Ret=3,二级错误字段【验签失败】errcode 说明：
  RET3_ERRCODES: {
    1: '无效TOKEN,被吊销',
    2: '请求重放',
    3: 'access_token不存在',
    4: 'access_token超时',
    5: 'oauth 版本不对',
    6: 'oauth 签名方法不对',
    7: '参数错',
    8: '处理失败',
    9: '验证签名失败',
    10: '网络错误',
    11: '参数长度不对',
    12: '处理失败12',
    13: '处理失败13',
    14: '处理失败14',
    15: '处理失败15'
  },

  /**
   * 格式化错误
   * 
   * @param {String} error_msg 
   * @param {Number} error_code 
   * @param {Object} err 
   * @param {Number} err.ret
   * @returns {String} message
   */
  format_error: function (error_msg, error_code, err) {
    // err.ret => err.errcode
    var message = null;
    if (err) {
      if (err.ret === 3) {
        message = this.RET3_ERRCODES[err.errcode];
      } else if (err.ret === 4) {
        message = this.RET4_ERRCODES[err.errcode];
      }
      if (!message) {
        message = this.RET_ERRORS[err.ret];
        if (message) {
          message += ': ' + error_msg;
        }
      }
    }
    return message || error_msg;
  },

  _VIDEO_PADDING: '!!!{{status.video.shorturl}}!!!',
  EMOTION_MAP: {
    1: '狂喜',
    2: '偷乐',
    3: '无感',
    4: '伤心',
    5: '咆哮'
  },
  processMsg: function (status, notEncode) {
    var statusText;
    if (status.video && status.video.picurl && status.text) {
      // 添加视频链接
      if (status.text.indexOf(status.video.shorturl) < 0) {
        status.text += ' ' + status.video.shorturl;
      }
      var text = status.text.replace(status.video.shorturl, this._VIDEO_PADDING);
      var s = this.super_.processMsg.call(this, text, notEncode);
      var video_html = '<a href="' + status.video.realurl + '" title="' +
        status.video.title + '" target="_blank" class="link">' + status.video.shorturl + '</a>';
      s = s.replace(this._VIDEO_PADDING, video_html);
      s += '<br/><img class="video_image" title="' + status.video.title + '" src="' + status.video.picurl + '" />';
      statusText = s;
    } else {
      statusText = this.super_.processMsg.call(this, status, notEncode);
    }
    if (status.emotionurl) {
      var title = this.EMOTION_MAP[status.emotiontype] || ('未知心情:' + status.emotiontype);
      statusText = '<img src="' + status.emotionurl + '" alt="' + title + '" title="' + title + '" />' + statusText;
    }
    if ((!statusText || statusText === '&nbsp;') && status._type === 2) {
      statusText = '转播';
    }
    return statusText;
  },

  //page.js里面调用的时候没有加载表情字典,所以需要判断
  _emotion_rex: window.TQQ_EMOTIONS_ALL ? new RegExp('\/(' +
    Object.keys(window.TQQ_EMOTIONS_ALL).join('|') + ')', 'g') : null,
  _shuoshuo_emotion_rex: /\[em\](\w+)\[\/em\]/g,
  processEmotional: function (str) {
    if (!this._emotion_rex) {
      return str;
    }
    // show shuoshuo faces : http://code.google.com/p/falang/issues/detail?id=318
    str = str.replace(this._shuoshuo_emotion_rex, function (m, g1) {
      if (g1) {
        return '<img src="http://qzonestyle.gtimg.cn/qzone/em/' + g1 + '.gif" />';
      }
    });

    return str.replace(this._emotion_rex, function (m, g1) {
      if (window.TQQ_EMOTIONS_ALL && g1) {
        var emotion = window.TQQ_EMOTIONS_ALL[g1];
        if (emotion) {
          var tpl;
          if (emotion.indexOf('http://') >= 0) {
            tpl = '<img title="{{title}}" src="{{emotion}}" />';
          } else {
            tpl = '<img title="{{title}}" src="' + TQQ_EMOTIONS_URL_PRE + '{{emotion}}" />';
          }
          return tpl.format({title: g1, emotion: emotion});
        }
      }
      return m;
    });
  },

  AT_USER_RE: /([^#])?@([\w\-\_]+)/g,
  ONLY_AT_USER_RE: /@([\w\-\_]+)/g,

  processAt: function (str, status) { //@***
    var tpl = '{{m1}}<a class="getUserTimelineBtn" href="" data-screen_name="{{m2}}" rhref="' +
      this.config.user_home_url +'{{m2}}" title="' +
      _u.i18n("btn_show_user_title") + '">{{username}}</a>';
    return str.replace(this.AT_USER_RE, function (match, $1, $2) {
      var users = status.users || {};
      var username = users[$2];
      if (username) {
        username += '(@' + $2 + ')';
      } else {
        username = '@' + $2;
      }
      var data = {
        m1: $1 || '',
        m2: $2,
        username: username
      };
      return tpl.format(data);
    });
  },

  // urlencode，子类覆盖是否需要urlencode处理
  url_encode: function (text) {
    return text;
  },

  rate_limit_status: function (data, callback, context) {
    callback.call(context, {error: _u.i18n("comm_no_api")});
  },

  format_upload_params: function (user, data, pic) {
    if (data.status) {
      data.content = data.status;
      delete data.status;
    }
    data.format = 'json';
    delete data.source;
  },

  upload: function (user, data, pic, before_request, onprogress, callback, context) {
    if (data && (data.syncflag === null || data.syncflag === undefined)) {
      data.syncflag = this.config.syncflag;
    }
    this.super_.upload.call(this, user, data, pic, before_request, onprogress,
    function (result, text_status, error_code) {
      if (result && result.data) {
        result = result.data;
      }
      if (text_status !== 'error' && result && !result.error && result.id) {
        // 获取微博的内容，以便拿到图片url
        this.status_show({user: user, id: result.id}, callback, context);
      } else {
        callback.apply(context, arguments);
      }
    }, this);
  },

  _get_friendships: function (user, followers_args, callback, context) {
    var ids = [];
    var result = followers_args[0];
    if (result && result.items) {
      for (var i = 0, len = result.items.length; i < len; i++) {
        ids.push(String(result.items[i].id));
      }
    }
    if (ids.length > 0) {
      this.friendships_show({user: user, target_ids: ids.join(',')}, function () {
        var infos = arguments[0];
        if (infos) {
          for (var i = 0, len = result.items.length; i < len; i++) {
            var user = result.items[i];
            var info = infos[user.id];
            if (info) {
              for (var k in info) {
                user[k] = info[k];
              }
            }
          }
        }
        callback.apply(context, followers_args);
      });
    } else {
      callback.apply(context, followers_args);
    }
  },

  user_search: function (data, callback, context) {
    var user = data.user;
    this.super_.user_search.call(this, data, function () {
      this._get_friendships(user, arguments, callback, context);
    }, this);
  },

  followers: function (data, callback, context) {
    var user = data.user;
    this.super_.followers.call(this, data, function () {
      this._get_friendships(user, arguments, callback, context);
    }, this);
  },

  friends: function (data, callback, context) {
    var user = data.user;
    this.super_.friends.call(this, data, function () {
      this._get_friendships(user, arguments, callback, context);
    }, this);
  },

  reset_count: function (data, callback, context) {
    // Type：5 首页未读消息记数，6 @页消息记数 7 私信页消息计数 8 新增听众数 9 首页广播数（原创的）
    // 1 comments 2 metions 3 messages 4 fans
    if (data.type === 1) {
      return callback.call(context, true);
    }
    data.op = 1;
    if (data.type === 2) {
      data.type = 6;
    } else if(data.type === 3) {
      data.type = 7;
    } else if(data.type === 4) {
      data.type = 8;
    }
    var params = {
      url: this.config.reset_count,
      type: 'get',
      play_load: 'result',
      data: data
    };
    this._sendRequest(params, callback, context);
  },

  sub_counts: function (data, callback, context) {
    var params = {
      url: this.config.sub_counts,
      type: 'get',
      play_load: 'json',
      data: data
    };
    this._sendRequest(params, callback, context);
  },

  before_sendRequest: function (args, user) {
    if (args.play_load === 'string') {
        // oauth
      return;
    }
    args.data.format = 'json';
    if (args.data.count) {
      args.data.reqnum = args.data.count;
      delete args.data.count;
    }
    if (args.data.since_id) {
      args.data.pagetime = args.data.since_id;
      args.data.pageflag = args.data.pageflag === undefined ? 2 : args.data.pageflag;
      delete args.data.since_id;
    }
    if (args.data.max_id) {
      args.data.pagetime = args.data.max_id;
      args.data.pageflag = 1;
      delete args.data.max_id;
    }
    var content = args.data.status || args.data.text || args.data.comment;
    if (content) {
      args.data.content = content;
      delete args.data.status;
      delete args.data.text;
      delete args.data.comment;
    }

    if (args.url === this.config.user_timeline ||
      args.url === this.config.mentions ||
      args.url === this.config.friends_timeline) {
      // type: 拉取类型, 0x1 原创发表 0x2 转载 0x8 回复 0x10 空回 0x20 提及 0x40 点评
      // 如需拉取多个类型请|上(0x1|0x2) 得到3，type=3即可,填零表示拉取所有类型
      args.data.type = 0x1 | 0x2 | 0x8 | 0x10 | 0x20;
    }

    switch (args.url) {
      case this.config.counts:
        args.data.flag = 2;
        break;
      case this.config.new_message:
      case this.config.user_timeline:
        if (args.data.id) {
          args.data.name = args.data.id;
          delete args.data.id;
        } else if (args.data.screen_name) {
          args.data.name = args.data.screen_name;
          delete args.data.screen_name;
        }
        break;
      case this.config.blocks_blocking:
        if (args.data.page) {
          args.data.startindex = (parseInt(args.data.page, 10) - 1) * args.data.reqnum;
        }
        break;
      case this.config.blocks_create:
      case this.config.blocks_destroy:
        args.data.name = args.data.user_id || args.data.screen_name;
        delete args.data.user_id;
        delete args.data.screen_name;
        break;
      case this.config.comments:
        // flag:标识0 转播列表，1点评列表 2 点评与转播列表
        args.data.flag = 1;
        args.data.rootid = args.data.id;
        delete args.data.id;
        break;
      case this.config.repost_timeline:
        args.url = args.url.replace('_repost', '');
        args.data.flag = 0;
        args.data.rootid = args.data.id;
        delete args.data.id;
        break;
      case this.config.reply:
        // 使用 回复@xxx:abc 点评实现 reply
        args.url = this.config.comment;
        args.data.content = '回复@' + args.data.reply_user_id + ':' + args.data.content;
        args.data.reid = args.data.id;
        delete args.data.id;
        delete args.data.reply_user_id;
        delete args.data.cid;
        break;
      case this.config.comment:
        args.data.reid = args.data.id;
        delete args.data.id;
        break;
      case this.config.repost:
        args.data.reid = args.data.id;
        delete args.data.id;
        break;
      case this.config.friendships_destroy:
      case this.config.friendships_create:
      case this.config.user_show:
        args.data.name = args.data.id || args.data.screen_name;
        delete args.data.id;
        break;
      case this.config.followers:
      case this.config.friends:
        args.data.startindex = args.data.cursor;
        args.data.name = args.data.user_id;
        if (String(args.data.startindex) === '-1') {
          args.data.startindex = '0';
        }
        if (args.data.reqnum > 30) {
            // 最大只能获取30，否则就会抛错 {"data":null,"msg":"server error","ret":4}
          args.data.reqnum = 30;
        }
        delete args.data.cursor;
        delete args.data.user_id;
        break;
      case this.config.search:
      case this.config.user_search:
        args.data.keyword = args.data.q;
        args.data.pagesize = args.data.reqnum;
        delete args.data.reqnum;
        delete args.data.q;
        break;
      case this.config.update:
        // 判断是否@回复
        if (args.data.sina_id) {
          args.data.reid = args.data.sina_id;
          delete args.data.sina_id;
          args.url = '/t/reply';
        }
        break;
      case this.config.friendships_show:
        // Names: 其他人的帐户名列表（最多30个）
        // Flag: 0 检测听众，1检测收听的人 2 两种关系都检测
        args.data.flag = 2;
        // 批量获取
        args.data.names = args.data.target_ids || args.data.target_id;
        delete args.data.target_screen_name;
        delete args.data.target_id;
        delete args.data.target_ids;
        break;
      case this.config.comments_timeline:
        args.url = this.config.mentions;
        args.data.type = 0x40;
        break;
    }
    if (args.url === this.config.update) {
      // 判断是否有视频链接
      if (args.data.content) {
        var urls = UrlUtil.findUrls(args.data.content) || [];
        for (var i = 0, len = urls.length; i < len; i++) {
          var url = urls[i];
          if (VideoService.is_qq_support(url)) {
            args.url = '/t/add_video';
            args.data.url = url;
            break;
          }
        }
      }
      if (args.data.syncflag === null || args.data.syncflag === undefined) {
        args.data.syncflag = this.config.syncflag;
      }
    }
  },

  format_result: function(data, play_load, args) {
    if (play_load === 'string') {
      return data;
    }
    if (args.url === this.config.friendships_create ||
        args.url === this.config.friendships_destroy) {
      return true;
    }
    if (!data.data && data.msg === 'ok') {
      return true;
    }
    data = data.data;
    if (!data) {
      return data;
    }
    var items = data.info || data;
    delete data.info;
    var users = data.user || {};
    if (!$.isArray(items)) {
      items = data.results || data.users;
    }
    if ($.isArray(items)) {
      for (var i = 0, l = items.length; i < l; i++) {
        items[i] = this.format_result_item(items[i], play_load, args, users);
      }
      data.items = items;
      if (data.user && !data.user.id) {
        delete data.user;
      }
      if (args.url === this.config.followers || args.url === this.config.friends) {
        if (data.items.length >= parseInt(args.data.reqnum, 10)) {
          var start_index = parseInt(args.data.startindex, 10) || 0;
          if (start_index === -1) {
            start_index = 0;
          }
          data.next_cursor = start_index + data.items.length;
        } else {
          data.next_cursor = '0'; // 无分页了
        }
      }
    } else {
      data = this.format_result_item(data, play_load, args, users);
    }
    var item;
    if (args.url === this.config.friendships_show) {
      /**
       * {"data":{"debehe":{"isfans":true,"isidol":false}},"errcode":0,"msg":"ok","ret":0}
       * =>
       * {
           "id":debehe
           ,"name":"debehe"
           ,"following":true
           ,"followed_by":false
         }
       *
       */
      if (data) {
        for (var key in data) {
          item = data[key];
          item.following = !!item.isfans;
          item.followed_by = !!item.isidol;
          item.blacked_by = !!item.ismyblack;
          item.name = item.id = key;
        }
        var keys = Object.keys(data);
        if (keys.length === 1) {
          // 单个获取只返回第一个
          data = data[keys[0]];
        }
      }
    } else if (args.url === this.config.counts) {
      if (data) {
        var items = [];
        for (var k in data) {
          var item = {};
          var d = data[k];
          item.id = k;
          item.rt = d.count;
          item.comments = d.mcount;
          items.push(item);
        }
        data = items;
      }
    }

    return data;
  },

  format_result_item: function (data, play_load, args, users, need_user) {
    if (play_load === 'user' && data && data.name) {
      var user = {};
      user.t_url = 'http://t.qq.com/' + data.name;
      user.screen_name = data.nick;
      user.id = data.name;
      user.name = data.name;
      user.province = data.province_code;
      user.city = data.city_code;
      user.verified = data.isvip;
      user.verified_reason = data.verifyinfo;
      if (data.isent) {
        // 企业认证
        user.verified_type = data.isent;
      }
      user.gender = this.config.gender_map[data.sex || 0];
      if (data.head) {
        user.profile_image_url = data.head + '/50'; // 竟然直接获取的地址无法拿到头像
      } else {
        user.profile_image_url = 'http://mat1.gtimg.com/www/mb/images/head_50.jpg';
      }
      user.followers_count = data.fansnum;
      user.friends_count = data.idolnum;
      user.statuses_count = data.tweetnum;
      user.favourites_count = data.favnum;
      user.description = data.introduction;
      user.email = data.email;
      user.homepage = data.homepage;
      user.bi_followers_count = data.mutual_fans_num; // 互粉数
      if (data.birth_day) {
        user.birthday = data.birth_year + '-' + data.birth_month + '-' + data.birth_day;
      }
      if (data.comp && data.comp.length > 0) {
        user.jobs = [];
        for (var i = 0; i < data.comp.length; i++) {
          var comp = data.comp[i];
          var end = comp.end_year > 3000 ? '' : comp.end_year;
          var job = '(' + comp.begin_year + '-' + end + ')' + comp.company_name;
          if (comp.department_name) {
            job += '-' + comp.department_name;
          }
          user.jobs.push(job);
        }
      }
      if (data.tag) {
        user.tags = data.tag;
        for (var j = 0, len = user.tags.length; j < len; j++) {
          var tag = user.tags[j];
          tag.url = 'http://t.qq.com/search/tag.php?k=#' + tag.name;
        }
      }
      // Ismyidol: 是否为accesstoken用户的收听的人
      // Ismyfans: 是否为accesstoken 用户的听众
      // Ismyblack: 是否在 accesstoken 用户的黑名单内
      user.following = !!data.ismyfans;
      user.followed_by = !!data.ismyidol;
      user.blocking = user.blacked_by = !!data.ismyblack;
      if (data.tweet && data.tweet.length > 0) {
        data.tweet[0].origtext = data.tweet[0].origtext || data.tweet[0].text;
        user.status = this.format_result_item(data.tweet[0], 'status', args, users, false);
      }
      return user;
    }

    if (play_load === 'status' || play_load === 'comment' || play_load === 'message') {
      // type:微博类型 1-原创发表、2-转载、3-私信 4-回复 5-空回 6-提及 7: 点评
      var status = {};
//          status.status_type = data.type;
      if (data.type === 7) {
        // 腾讯的点评会今日hometimeline，很不给力
        status.status_type = 'comments_timeline';
      }
      status.t_url = 'http://t.qq.com/p/t/' + data.id;
      status.id = data.id;
      status.text = data.origtext; //data.text;
      // http://t.qq.com/p/t/28172122700171
      // 除了fav/list_t， re_list评论数据和私信外, 返回的数据会被htmlencode
      if (args.url !== this.config.comments &&
          args.url !== this.config.favorites &&
          play_load !== 'message' && status.text) {
        status.text = htmldecode(status.text);
      }
      status.created_at = new Date(data.timestamp * 1000);
      status.timestamp = data.timestamp;
      status.video = data.video;
      status.music = data.music;
      status.emotiontype = data.emotiontype;
      status.emotionurl = data.emotionurl;
      status._type = data.type;
      if (data.image){
        status.thumbnail_pic = data.image[0] + '/160';
        status.bmiddle_pic = data.image[0] + '/460';
        status.original_pic = data.image[0] + '/2000';
      }
      if (data.source) {
        if (data.type === 4) {
          // 回复
          status.text = '@' + data.source.name + ' ' + status.text;
          status.related_dialogue_url = 'http://t.qq.com/p/r/' + status.id;
          status.in_reply_to_status_id = data.source.id;
          status.in_reply_to_screen_name = data.source.nick;
        } else {
          status.retweeted_status =
            this.format_result_item(data.source, 'status', args, users);
          // 评论
          if (play_load === 'comment') {
            status.status = status.retweeted_status;
            delete status.retweeted_status;
          }
        }
      }
      status.repost_count = data.count || 0;
      status.comments_count = data.mcount || 0; // 评论数
      status.source = data.from;
      if (data.fromurl) {
        status.source = '<a href="' + data.fromurl + '">' + status.source + '</a>';
      }
      if (need_user !== false) {
        status.user = this.format_result_item(data, 'user', args, users);
      }
      // 收件人
//          tohead: ""
//          toisvip: 0
//          toname: "macgirl"
//          tonick: "美仪"
      if (data.toname) {
        status.recipient = {
          name: data.toname,
          nick: data.tonick,
          isvip: data.toisvip,
          head: data.tohead
        };
        status.recipient = this.format_result_item(status.recipient, 'user', args, users);
      }

      // 如果有text属性，则替换其中的@xxx 为 中文名(@xxx)
      if (status && status.text) {
        var matchs = status.text.match(this.ONLY_AT_USER_RE);
        if (matchs) {
          status.users = {};
          for (var j = 0; j < matchs.length; j++) {
            var name = $.trim(matchs[j]).substring(1);
            status.users[name] = users[name];
          }
        }
      }
      if (!status.text && data.status === 3) {
        // 对不起，原文已经被作者删除。 http://t.qq.com/p/t/39599091698961
        status.text = '对不起，原文已经被作者删除。';
      }
      return status;
    }

    return data;
  }
});



// 雷猴api
var LeiHouAPI = Object.inherits({}, sinaApi, {

    // 覆盖不同的参数
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://leihou.com',
        user_home_url: 'http://leihou.com/',
        source: 'fawave', //貌似fawave被雷猴封了？加入source=fawave就好返回404
        repost_pre: 'RT',
        support_double_char: false,
        support_comment: false,
        support_do_comment: false,
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_sent_direct_messages: false,
        support_favorites: false,
        support_do_favorite: false,
        support_destroy_msg: false,
        support_user_search: false,
        support_auto_shorten_url: false,
        user_timeline_need_friendship: false,
        support_blocking: false,

        update: '/statuses/update',
        upload: '/statuses/update',
        repost: '/statuses/update',
        comment: '/statuses/update',
        search: '/search'
    }),

    // 无需urlencode
    url_encode: function(text) {
        return text;
    },

    rate_limit_status: function(data, callback, context) {
        callback.call(context, {error: _u.i18n("comm_no_api")});
    },

    comments_timeline: function(data, callback, context) {
        callback.call(context);
    },

    reset_count: function(data, callback, context) {
        callback.call(context);
    },

    counts: function(data, callback, context) {
        callback.call(context);
    },

    before_sendRequest: function(args) {
        if (args.url === this.config.friends || args.url === this.config.followers) {
            // cursor. 选填参数. 单页只能包含100个粉丝列表，为了获取更多则cursor默认从-1开始，
            // 通过增加或减少cursor来获取更多的，如果没有下一页，则next_cursor返回0
            args.data.page = args.data.cursor == '-1' ? 1 : args.data.cursor;
            delete args.data.cursor;
            if (!args.data.page) {
                args.data.page = 1;
            }
        } else if (args.url === this.config.repost) {
            // sina_id => in_reply_to_status_id
            if(args.data.sina_id) {
                args.data.in_reply_to_status_id = args.data.sina_id;
                delete args.data.sina_id;
            }
        } else if (args.url === this.config.new_message) {
            // id => user
            args.data.user = args.data.id;
            delete args.data.id;
        }
    },

    format_result: function(data, play_load, args) {
        if($.isArray(data)) {
            for(var i in data) {
                data[i] = this.format_result_item(data[i], play_load, args);
            }
        } else {
            data = this.format_result_item(data, play_load, args);
        }
        // 若是follwers api，则需要封装成cursor接口
        // cursor. 选填参数. 单页只能包含100个粉丝列表，为了获取更多则cursor默认从-1开始，
        // 通过增加或减少cursor来获取更多的，如果没有下一页，则next_cursor返回0
        if (args.url === this.config.followers || args.url === this.config.friends) {
            data = {users: data, next_cursor: args.data.page + 1, previous_cursor: args.data.page};
            if (data.users.length === 0) {
                data.next_cursor = 0;
            }
        }
        return data;
    },

    format_result_item: function(data, play_load, args) {
        if (play_load === 'status' && data.id) {
            // 'text': u'http://pic.leihou.com/428ed1 \u6d4b\u8bd523\u5e26\u56fe\u7247\u7684\u5fae\u535a\u4fe1\u606f',
            var pic = /http:\/\/pic\.leihou\.com\/(\w+)/.exec(data.text);
            if (pic && pic.length === 2) {
                data.thumbnail_pic = 'http://pic.leihou.com/pic/' + pic[1] + '_medium.jpg';
                data.bmiddle_pic = 'http://pic.leihou.com/pic/' + pic[1] + '_large.jpg';
                data.original_pic = data.bmiddle_pic;
            }
            var tpl = 'http://leihou.com/{{user.screen_name}}/lei/{{id}}';
            if(data.in_reply_to_status_id) {
                data.retweeted_status = {
                    id: data.in_reply_to_status_id,
                    user: {
                        id: data.in_reply_to_user_id,
                        screen_name: data.in_reply_to_screen_name,
                        name: data.in_reply_to_screen_name
                    }
                };
                // 查看相关对话的url
                data.related_dialogue_url = 'http://leihou.com/dialog/' + data.id;
                this.format_result_item(data.retweeted_status.user, 'user', args);
                data.retweeted_status.t_url = tpl.format(data.retweeted_status);
            }
            this.format_result_item(data.user, 'user', args);
            data.t_url = tpl.format(data);
        } else if (play_load === 'user' && data && data.id) {
            if(data.user) {
                data = data.user;
            }
            data.t_url = 'http://leihou.com/' + (data.screen_name || data.id);
            if(data.profile_image_url) {
                // 'profile_image_url': u'http://a1.leihou.com/avatar/5c/0c/13879_0_m.png'
                data.profile_image_url = data.profile_image_url.replace('_m.', '_s.');
            }
            if(data.location) {
                var province_city = data.location.split('.');
                data.province = province_city[0];
                data.city = province_city[1] || province_city[0];
            }
        } else if (play_load === 'comment') {
            this.format_result_item(data.user, 'user', args);
        } else if (play_load === 'message') {
            this.format_result_item(data.sender, 'user', args);
            data.sender.id = data.sender.screen_name;
            this.format_result_item(data.recipient, 'user', args);
        }
        return data;
    }
});
get_thing_funny = function() {
    b = "A"
    return "koSpMR"+(4*2)+"a0bCjUAiK"+b+"dfrnx6BI"
};
get_another_thing_funny= function() {
    wat= "SqAdyUVt"+"QIE"+"703zYr"
    return (100-6) +"AJYl7x"+"Gnpex9HNNmt"+5+"J0JxOw"+"DIYGq7K"+wat
};
//twitter api
var TwitterAPI = Object.inherits({}, sinaApi, {

    // 覆盖不同的参数
    config: Object.inherits({}, sinaApi.config, {
      oauth_host: 'https://api.twitter.com',
        host: 'https://api.twitter.com/1.1',
        user_home_url: 'https://twitter.com/',
        search_url: 'https://twitter.com/search?q=',
        source: 'fawave',
        oauth_key: get_thing_funny(),
        oauth_secret: get_another_thing_funny(),
        repost_pre: 'RT',
        support_comment: false,
        support_do_comment: false,
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_direct_messages: true,
        support_sent_direct_messages: false,
        support_auto_shorten_url: false,
        support_search_max_id: true,
        support_user_search_page: true, // 用户搜索按page
        support_upload: true,
        support_double_char: false,
        rt_need_source: false,
        user_timeline_need_friendship: true,
        show_fullname: true,
        support_blocking: true,
        oauth_callback: 'oob',

        update: '/statuses/update',
        upload: '/statuses/update_with_media', // https://upload.twitter.com/1/statuses/update_with_media.json
        // search: '/search_statuses',
        // repost: '/statuses/update',
        retweet: '/statuses/retweet/{{id}}',
        favorites_create: '/favorites/create',
        favorites: '/favorites/list',
        friends_timeline: '/statuses/home_timeline',
        friendships_lookup: '/friendships/lookup',
        friends: '/friends/list',
        followers: '/followers/list',
        mentions: '/statuses/mentions_timeline',
        search: '/search/tweets'
    }),

    // 已经支持中文
    searchMatchReg: /(#([\w\-\_\u2E80-\u3000\u303F-\u9FFF]+))/g,
    processSearch: function (str) {
        return str.replace(this.searchMatchReg,
            '<a class="tag" title="$2" href="https://twitter.com/search?q=%23$2" target="_blank">$1</a>');
    },

    // return [[hash1, hash_value], ..., [#xxx#, xxx]]
    findSearchText: function(str) {
        var matchs = str.match(this.searchMatchReg);
        var result = [];
        if(matchs) {
            for(var i = 0, len = matchs.length; i < len; i++) {
                var s = matchs[i].trim();
                result.push([s, s.substring(1)]);
            }
        }
        return result;
    },

    formatSearchText: function(str) { // 格式化主题
        return '#' + str.trim();
    },

    processEmotional: function(str){
        return str;
    },

    comments_timeline: function(data, callback, context) {
        callback.call(context);
    },

    reset_count: function(data, callback, context) {
        callback.call(context);
    },

    counts: function(data, callback, context) {
        callback.call(context);
    },

    retweet: function(data, callback, context) {
        var params = {
            url: this.config.retweet,
            type: 'post',
            play_load: 'status',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    friendships_lookup: function(data, callback, context) {
        var params = {
            url: this.config.friendships_lookup,
            type: 'get',
            play_load: 'object',
            data: data
        };
        this._sendRequest(params, callback, context);
    },

    _get_friendships: function(user, followers_args, callback, context) {
        var ids = [];
        var result = followers_args[0];
        if(result && result.users) {
            for(var i = 0, len = result.users.length; i < len; i++) {
                ids.push(String(result.users[i].id));
            }
        }
        if(ids.length > 0) {
            this.friendships_lookup({user: user, user_id: ids.join(',')}, function() {
                var infos = arguments[0];
                if(infos && infos.length > 0) {
                    var map = {};
                    for(var i = 0, l = infos.length; i < l; i++) {
                        var info = infos[i], relation = {following: false, followed_by: false};
                        if(info.connections) {
                            for(var j = 0, jl = info.connections.length; j < jl; j++) {
                                if(info.connections[j] === 'following') {
                                    relation.followed_by = true;
                                } else if(info.connections[j] === 'followed_by') {
                                    relation.following = true;
                                }
                            }
                        }
                        map[String(info.id)] = relation;
                    }
                    for (var i = 0, len = result.users.length; i < len; i++) {
                        var user = result.users[i];
                        var info = map[String(user.id)];
                        if (info) {
                            for(var k in info) {
                                user[k] = info[k];
                            }
                        }
                    }
                }
                callback.apply(context, followers_args);
            });
        } else {
            callback.apply(context, followers_args);
        }
    },

    user_search: function(data, callback, context) {
        var user = data.user;
        this.super_.user_search.call(this, data, function() {
            this._get_friendships(user, arguments, callback, context);
        }, this);
    },

    followers: function(data, callback, context) {
        var user = data.user;
        this.super_.followers.call(this, data, function() {
            this._get_friendships(user, arguments, callback, context);
        }, this);
    },

    friends: function(data, callback, context) {
        var user = data.user;
        this.super_.friends.call(this, data, function() {
            this._get_friendships(user, arguments, callback, context);
        }, this);
    },

    /**
     * Endpoint: https://upload.twitter.com/1/statuses/update_with_media.json
        Parameters:
             * media (the image, I guess),
             * status (the text which you will also want),
             * probably all other ones which currently work with update.json
        (lat, lon, etc).
     */
    format_upload_params: function (user, data, pic) {
      pic.keyname = 'media[]';
      delete data.source;
    },

    apply_auth: function (url, auth_args, user) {
        if (url.indexOf(this.config.upload) > 0 && this.config.host.indexOf('https://api.twitter.com') >= 0) {
            // https://dev.twitter.com/discussions/1059
            var data = auth_args.data;
            auth_args.data = {};
            this.super_.apply_auth.call(this, url, auth_args, user);
            auth_args.data = data;
        } else {
            this.super_.apply_auth.call(this, url, auth_args, user);
        }
    },

    blocks_exists: function(data, callback, context) {
        this.super_.blocks_exists.call(this, data, function(r, text, status) {
            if(status === 404) {
                callback({result: false}, text, status);
            } else {
                callback({result: true, user: r}, text, status);
            }
        }, context);
    },

    url_encode: function(text) {
        return text;
    },

    before_sendRequest: function(args, user) {
        if (args.url.indexOf('/oauth') < 0) {
            args.data.include_entities = 'true';
            args.data.contributor_details = 'true';
        }
        if (args.url === this.config.update) {
            if (args.data.sina_id) {
                args.data.in_reply_to_status_id = args.data.sina_id;
                delete args.data.sina_id;
            } else if (args.data.id) {
                args.data.in_reply_to_status_id = args.data.id;
                delete args.data.id;
            }
            delete args.data.source;
        } else if (args.url === this.config.new_message) {
            // id => user
            args.data.user = args.data.id;
            delete args.data.id;
        } else if (args.url === this.config.search) {
          delete args.data.page;
          args.data.show_user = 'true';
          delete args.data.source;
        } else if (args.url === this.config.user_search || args.url === this.config.blocks_blocking) {
            // args.data.per_page = args.data.count;
            // delete args.data.count;
        } else if (args.url === this.config.blocks_exists) {
            args.dont_show_error = true;
        }
        var hasAPI = user && user.apiProxy;
        if (!hasAPI && this.config.host === 'https://api.twitter.com' && args.url.indexOf('/oauth') < 0) {
            args.url = '/1' + args.url;
        }
    },

    format_result_item: function(data, play_load, args) {
        if (play_load === 'status' && data.id) {
            data.id = data.id_str || data.id;
            data.in_reply_to_status_id = data.in_reply_to_status_id_str || data.in_reply_to_status_id;
            // check media
            if(data.entities && data.entities.media && data.entities.media.length > 0) {
                var entities = data.entities;
                if(entities.media && entities.media.length > 0) {
                    for(var i = 0, len = entities.media.length; i < len; i++) {
                        var media = entities.media[i];
                        if(media.type === 'photo') {
                            data.thumbnail_pic = media.media_url;
                            data.bmiddle_pic = data.thumbnail_pic;
                            data.original_pic = data.thumbnail_pic;
                            if(data.text) {
                                data.text = data.text.replace(media.url, ''); // 去除图片链接尾巴
                            }
                            break;
                        }
                    }
                }
                delete data.entities;
            }
            // 修复&lt; &gt; 被转移问题 #302 http://code.google.com/p/falang/issues/detail?id=302
            if(data.text) {
                data.text = data.text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            }
            var tpl = this.config.user_home_url + '{{user.screen_name}}/status/{{id}}';
            if(data.retweeted_status) {
                data.retweeted_status.id = data.retweeted_status.id_str || data.retweeted_status.id;
                data.retweeted_status.t_url = tpl.format(data.retweeted_status);
                this.format_result_item(data.retweeted_status.user, 'user', args);
            }
            // search
            if(data.from_user && !data.user) {
                data.user = {
                    id: data.from_user_id_str || data.from_user_id,
                    profile_image_url: data.profile_image_url,
                    screen_name: data.from_user
                };
                delete data.from_user_id_str;
                delete data.profile_image_url;
                delete data.from_user;
                data.source = htmldecode(data.source);
            }
            data.t_url = tpl.format(data);
            this.format_result_item(data.user, 'user', args);
        } else if(play_load === 'user' && data && data.id) {
            data.t_url = this.config.user_home_url + (data.screen_name || data.id);
            data.following = false;
        }
        return data;
    }
});


var FanfouAPI = Object.inherits({}, sinaApi, {

    // 覆盖不同的参数
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://api2.fanfou.com',
        user_home_url: 'http://fanfou.com/',
        search_url: 'http://fanfou.com/q/',
        source: 'fawave',
        oauth_host: 'http://fanfou.com',
        oauth_key: '2f6d311aaa5779bc956310698a0a989b',
        oauth_secret: 'bdf029681e94c8ab9f7bc43d3d41435e',
        oauth_callback: OAUTH_CALLBACK_URL2,
        // oauth_params_by_get: true,
        repost_pre: '转',
        support_comment: false,
        support_do_comment: false,
        // support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_direct_messages: true,
        support_sent_direct_messages: false,
        support_auto_shorten_url: false,
        support_double_char: false,
        update: '/statuses/update',
        upload: '/photos/upload',
        repost: '/statuses/repost',
        search: '/search/public_timeline',
        favorites_create: '/favorites/create/{{id}}',
        support_user_search: false,
        user_timeline_need_friendship: false,
        show_fullname: true,
        support_blocking: false,

        gender_map: { '男': 'm', '女': 'f' }
    }),
    
    processAt: function (str, status) { //@*** ,饭否的用户名支持“.”
        // str = str.replace(, ' <a target="_blank" href="javascript:getUserTimeline(\'$1\');" rhref="'+ this.config.user_home_url +'$1" title="'+ _u.i18n("btn_show_user_title") +'">@$1</a>');
        // str = str.replace(/([^\w#])@([\w\-\u4e00-\u9fa5|\_\.]+)/g, '$1<a target="_blank" href="javascript:getUserTimeline(\'$2\');" rhref="'+ this.config.user_home_url +'$2" title="'+ _u.i18n("btn_show_user_title") +'">@$2</a>');
        var tpl = '<a class="getUserTimelineBtn" href="" data-screen_name="{{m1}}" rhref="' +
            this.config.user_home_url + '{{m1}}" title="' +
            _u.i18n("btn_show_user_title") + '">{{username}}</a>';
        return str.replace(/@([\w\-\u4e00-\u9fa5|\_\.]+)/g, function (match, $1) {
            var users = status.users || {};
            var userid = users[$1];
            var username = $1;
            if (userid) {
                username = '@' + $1 + '(' + userid + ')';
            } else {
                username = '@' + $1;
            }
            var data = {
                m1: userid || $1,
                username: username
            };
            return tpl.format(data);
        });
    },

    reset_count: function(data, callback, context) {
        callback.call(context);
    },

    counts: function(data, callback, context) {
        callback.call(context);
    },

    url_encode: function(text) {
        return text;
    },

    format_geo_arguments: function(data, geo) {
        data.location = geo.latitude + ',' + geo.longitude;
    },

    apply_auth: function(url, auth_args, user) {
        if (url.indexOf(this.config.upload) > 0) {
            // 图片上传无需签名
            var data = auth_args.data;
            auth_args.data = {};
            this.super_.apply_auth.call(this, url, auth_args, user);
            auth_args.data = data;
        } else {
            this.super_.apply_auth.call(this, url, auth_args, user);
        }
    },

    before_sendRequest: function(args, user) {
        if (args.url === this.config.new_message) {
            // id => user
            args.data.user = args.data.id;
            delete args.data.id;
        } else if (args.url === this.config.update) {
            if (args.data.sina_id) {
                args.data.in_reply_to_status_id = args.data.sina_id;
                delete args.data.sina_id;
            }
        } else if (args.url === this.config.repost) {
            args.url = this.config.update;
            args.data.repost_status_id = args.data.id;
            delete args.data.id;
        } else if (args.url === this.config.friends || args.url === this.config.followers) {
            // cursor. 选填参数. 单页只能包含100个粉丝列表，为了获取更多则cursor默认从-1开始，
            // 通过增加或减少cursor来获取更多的，如果没有下一页，则next_cursor返回0
            args.data.page = args.data.cursor == '-1' ? 1 : args.data.cursor;
            if (!args.data.page) {
                args.data.page = 1;
            }
            if (args.data.user_id) {
                args.data.id = args.data.user_id;
            }
            delete args.data.cursor;
            delete args.data.user_id;
            delete args.data.screen_name;
        }
    },

    /**
     * photo（必须）- 照片文件。和<input type="file" name="photo" />效果一样
     */
    format_upload_params: function(user, data, pic) {
        pic.keyname = 'photo';
    },

    format_result: function(data, play_load, args) {
        if ($.isArray(data)) {
            for (var i in data) {
                data[i] = this.format_result_item(data[i], play_load);
            }
        } else {
            data = this.format_result_item(data, play_load);
        }
        // 若是follwers api，则需要封装成cursor接口
        // cursor. 选填参数. 单页只能包含100个粉丝列表，为了获取更多则cursor默认从-1开始，
        // 通过增加或减少cursor来获取更多的，如果没有下一页，则next_cursor返回0
        if (args.url === this.config.followers || args.url === this.config.friends) {
            data = {
                users: data,
                next_cursor: Number(args.data.page) + 1,
                previous_cursor: args.data.page
            };
            if (data.users.length === 0) {
                data.next_cursor = '0';
            }
        }
        return data;
    },

    ONLY_AT_USER_RE: /@([^\s]+)/g,
    _FANFOU_IMAGEURL_RE: /http:\/\/fanfou\.com\/photo\/[\w\-]+$/i,
    format_result_item: function(data, play_load, args) {
        if (play_load === 'status' && data && data.id) {
            var users = {};
            users[data.user.screen_name] = data.user.id;

            var tpl = 'http://fanfou.com/statuses/{{id}}';
            data.t_url = tpl.format(data);
            this.format_result_item(data.user, 'user', args);
            if (data.repost_status && data.repost_status.photo) {
                // 删除当前status 重复出现的 photo
                delete data.photo;
            }
            // 'photo': {u'largeurl': u'http://photo.fanfou.com/n0/00/as/vd_161837.jpg',
            // u'imageurl': u'http://photo.fanfou.com/m0/00/as/vd_161837.jpg', // 太小了
            // u'thumburl': u'http://photo.fanfou.com/t0/00/as/vd_161837.jpg'},
            if (data.photo) {
                data.thumbnail_pic = data.photo.thumburl;
                data.bmiddle_pic = data.photo.largeurl;
                data.original_pic = data.photo.largeurl;
                delete data.photo;
                // 删除图片 http://fanfou.com/photo/b0QRkVL6-2Y
                data.text = data.text.replace(this._FANFOU_IMAGEURL_RE, '');
            }
            if (data.in_reply_to_status_id) {
                data.related_dialogue_url = 'http://fanfou.com/statuses/' + data.in_reply_to_status_id + '?fr=viewreply';
                users[data.in_reply_to_screen_name] = data.in_reply_to_user_id;
            }
            if (data.text) {
                data.text = htmldecode(data.text);
            }
            if (data.repost_status) {
                data.retweeted_status = this.format_result_item(data.repost_status, 'status', args);
                delete data.repost_status;
                users[data.retweeted_status.user.screen_name] = data.retweeted_status.user.id;
            }
            // 如果有text属性，则替换其中的 `@screen_name` 为 `@screen_name(id)`
            if (data && data.text) {
                var matchs = data.text.match(this.ONLY_AT_USER_RE);
                if (matchs) {
                    data.users = {};
                    // in_reply_to_screen_name <> in_reply_to_user_id
                    // repost_screen_name <> repost_user_id
                    // repost_status.in_reply_to_user_id and repost_user_id
                    if (data.repost_screen_name) {
                        users[data.repost_screen_name] = data.repost_user_id;
                    }
                    for (var j = 0; j < matchs.length; j++) {
                        var name = $.trim(matchs[j]).substring(1);
                        data.users[name] = users[name];
                    }
                }
            }
        } else if (play_load === 'user' && data && data.id) {
            data.t_url = 'http://fanfou.com/' + (data.id || data.screen_name);
            data.gender = this.config.gender_map[data.gender];
            data.followed_by = data.following;
            data.following = false;
            data.name = data.id || data.name;
        }
        return data;
    }
});


var GooglePlusAPI = Object.inherits({}, sinaApi, {
  config: Object.inherits({}, sinaApi.config, {
    host: 'https://www.googleapis.com/plus/v1',
    source: '',
    result_format: '', // 由alt参数确定返回值格式
    support_counts: false,
    support_repost: true,
    support_comment_repost: true,
    support_repost_timeline: false, // 支持查看转发列表
    support_upload: false, // 是否支持上传图片
    support_cursor_only: true,  // 只支持游标方式翻页
    support_mentions: false,
    support_direct_messages: false,
    support_sent_direct_messages: false,
    support_auto_shorten_url: false,
    support_geo: false,
    repost_pre: 'RT ',
    need_processMsg: false,
    user_timeline_need_friendship: false,
    support_blocking: false,

    // oauth
    oauth_scope: [
      'https://www.googleapis.com/auth/plus.me'
    ].join(' '),
    oauth_key: '828316891836.apps.googleusercontent.com',
    oauth_secret: 'XmewNnlKyFGDvBJ-Qa3HDkc_',
    oauth_callback: 'http://localhost:1984/fawave/callback',
    oauth_host: 'https://accounts.google.com/o/oauth2',
    oauth_authorize:      '/auth',
    oauth_access_token:   '/token',
    oauth_token_need_refresh: true, // 需要定时刷新token

    friends_timeline: '/people/me/activities/public',
    user_timeline: '/people/{{id}}/activities/public',
    followers: '/people/{{user_id}}/@groups/@followers',
    friends: '/people/{{user_id}}/@groups/@following',
    favorites: '/activities/@me/@liked',
    favorites_create: '/activities/@me/@liked/{{id}}?key={{key}}&alt={{alt}}',
    favorites_destroy: '/activities/@me/@liked/{{id}}?key={{key}}&alt={{alt}}_delete',
    friendships_create: '/people/@me/@groups/@following/{{id}}?key={{key}}&alt={{alt}}',
    friendships_destroy: '/people/@me/@groups/@following/{{id}}?key={{key}}&alt={{alt}}_delete',
    update: '/activities/@me/@self?key={{key}}&alt={{alt}}',
    repost: '/activities/@me/@self?key={{key}}&alt={{alt}}_repost',
    repost_real: '/activities/@me/@self?key={{key}}&alt={{alt}}',
    destroy: '/activities/@me/@self/{{id}}?key={{key}}&alt={{alt}}',
    comments: '/activities/{{user_id}}/@self/{{id}}/@comments',
    comment: '/activities/{{user_id}}/@self/{{id}}/@comments?key={{key}}&alt={{alt}}',
    reply: '/activities/{{user_id}}/@self/{{id}}/@comments?key={{key}}&alt={{alt}}',
    search: '/activities/search',
    user_search: '/activities/search/@people',
    verify_credentials: '/people/me'
  }),

  apply_auth: function (url, args, user) {
    delete args.data.source;
    if (args.__refresh_access_token) {
      return;
    }
    if (user.oauth_token_key) {
      args.data.access_token = user.oauth_token_key;
    }
  },

  get_access_token: function (user, callback, context) {
    var params = {
      url: this.config.oauth_access_token,
      type: 'post',
      user: user,
      play_load: 'json',
      apiHost: this.config.oauth_host,
      data: {
        code: user.oauth_pin,
        client_id: this.config.oauth_key,
        client_secret: this.config.oauth_secret,
        redirect_uri: this.config.oauth_callback,
        grant_type: 'authorization_code'
      },
      need_source: false
    };
    this._sendRequest(params, function (data, text_status, error_code) {
      if (text_status !== 'error' && data && data.access_token) {
        // https://developers.google.com/accounts/docs/OAuth2InstalledApp?hl=zh-CN#choosingredirecturi
        user.oauth_token_key = data.access_token;
        user.oauth_expires_in = data.expires_in;
        user.oauth_token_type = data.token_type;
        user.oauth_refresh_token = data.refresh_token;
      } else {
        user = null;
        text_status = text_status || 'error';
        error_code = error_code || JSON.stringify(data);
      }
      callback.call(context, user, text_status, error_code);
    });
  },

  refresh_access_token: function (user, callback, context) {
    var params = {
      url: this.config.oauth_access_token,
      type: 'post',
      user: user,
      play_load: 'json',
      apiHost: this.config.oauth_host,
      data: {
        client_id: this.config.oauth_key,
        client_secret: this.config.oauth_secret,
        refresh_token: user.oauth_refresh_token,
        grant_type: 'refresh_token'
      },
      need_source: false,
      __refresh_access_token: true
    };
    this._sendRequest(params, function (data, text_status, error_code) {
      var result = null;
      if (text_status !== 'error' && data && data.access_token) {
        // https://developers.google.com/accounts/docs/OAuth2InstalledApp?hl=zh-CN#choosingredirecturi
        result = {
          oauth_token_key: data.access_token,
          oauth_expires_in: data.expires_in,
          oauth_token_type: data.token_type
        };
      } else {
        text_status = text_status || 'error';
        error_code = error_code || JSON.stringify(data);
      }
      callback.call(context, result, text_status, error_code);
    });
  },

  // https://developers.google.com/accounts/docs/OAuth2InstalledApp?hl=zh-CN
  get_authorization_url: function (user, callback, context) {
    var params = {
      response_type: 'code',
      client_id: this.config.oauth_key,
      redirect_uri: this.config.oauth_callback,
      scope: this.config.oauth_scope,
      state: String(new Date().getTime())
    };
    // https://accounts.google.com/o/oauth2/auth
    var loginURL = this.config.oauth_host + this.config.oauth_authorize + '?';
    var args = [];
    for (var k in params) {
      args.push(k + '=' + encodeURIComponent(params[k]));
    }
    loginURL += args.join('&');
    callback.call(context, loginURL, 'success', 200);
  },

  format_result: function (data, play_load, args) {
    var items = data.items || data;
    if ($.isArray(items)) {
        for (var i = 0, l = items.length; i < l; i++) {
            items[i] = this.format_result_item(items[i], play_load, args);
        }
        if (data.nextPageToken) {
          data.next_cursor = data.nextPageToken;
        } else {
          data.next_cursor = '0'; // end
        }
    } else {
        data = this.format_result_item(data, play_load, args);
    }
    return data;
  },

  format_result_item: function (data, play_load, args) {
    if (play_load === 'user') {
      // https://developers.google.com/+/api/latest/people
      data.name = data.screen_name = data.displayName;
      delete data.displayName;
      data.description = data.aboutMe;
      data.gender = data.gender === 'male' ? 'm' : (data.gender === 'female' ? 'f' : 'n');
      data.profile_image_url = data.image.url;
      if (Array.isArray(data.organizations)) {
        for (var i = 0, l = data.organizations.length; i < l; i++) {
          var org = data.organizations[i];
          data.description += (org.type ? org.type + ':' : '') + org.title + ' at ' + org.name +'<br/>';
        }
        delete data.organizations;
      }
      if (Array.isArray(data.urls)) {
        for (var i = 0, l = data.urls.length; i < l; i++) {
          var info = data.urls[i];
          data.description += (info.type ? info.type + ':' : '') + info.value +'<br/>';
        }
        delete data.urls;
      }
      if (data.placesLived && data.placesLived[0]) {
        var place = data.placesLived[0];
        data.city = place.value;
      }
      delete data.placesLived;
    } else if (play_load === 'status') {
      data.user = this.format_result_item(data.actor, 'user', args);
      delete data.actor;
      data.text = data.title;
      delete data.title;
      // provider => source
      data.source = data.provider.title;
      delete data.provider;
      data.created_at = data.published;
      delete data.published;
      data.t_url = data.url;
      delete data.url;
      var obj = data.object;
      if (obj) {
        delete data.object;
        if (obj.attachments && obj.attachments[0]) {
          var attachment = obj.attachments[0];
          if (attachment.content) {
            data.text = attachment.content;
          }
          if (attachment.fullImage) {
            data.original_pic = data.bmiddle_pic = attachment.fullImage.url;
          }
          if (attachment.image) {
            data.thumbnail_pic = attachment.image.url;
          }
        }
        if (obj.content) {
          data.text = obj.content;
        }
        data.comments_count = obj.replies.totalItems;
        data.repost_count = obj.resharers.totalItems;
        data.favorite_count = obj.plusoners.totalItems;
      }
      delete data.crosspostSource;
    }
    return data;
  },
});

// 豆瓣
/*
 * 豆瓣 API 通过HTTP Status Code来说明 API 请求是否成功 下面的表格中展示了可能的HTTP Status Code以及其含义

状态码 含义
200 OK  请求成功
201 CREATED 创建成功
202 ACCEPTED    更新成功
400 BAD REQUEST 请求的地址不存在或者包含不支持的参数
401 UNAUTHORIZED    未授权
403 FORBIDDEN   被禁止访问
404 NOT FOUND   请求的资源不存在
500 INTERNAL SERVER ERROR   内部错误

 */
// 豆瓣V2 http://developers.douban.com/wiki/?title=oauth2
var DoubanAPI2 = Object.inherits({}, WeiboAPI2, {
  config: Object.inherits({}, WeiboAPI2.config, {
    oauth_access_token: '/token',
    oauth_authorize: '/auth',
    oauth_callback: FAWAVE_OAUTH_CALLBACK_URL,
    oauth_host: 'https://www.douban.com/service/auth2',
    source: '00297ce75d80d969007c76b618828c3b',
    oauth_key: '00297ce75d80d969007c76b618828c3b',
    oauth_secret: '86aa78d771520e0e',

    result_format: '',
    show_fullname: true,
    reply_dont_need_at_screen_name: true,

    support_sent_direct_messages: false,
    support_blocking: false,
    support_comments_mentions: false,
    support_comment: false,
    support_repost: false,
    support_comment_repost: false,
    support_repost_timeline: false,
    support_auto_shorten_url: false,
    support_mentions: false,
    support_direct_messages: false,
    support_favorites: false,
    support_counts: false,
    support_like: false,
    user_timeline_need_friendship: true,
    user_timeline_need_user: true,

    host: 'https://api.douban.com',
    verify_credentials: '/v2/user/~me',

    // status
    friends_timeline: '/shuo/v2/statuses/home_timeline',
    user_timeline: '/shuo/v2/statuses/user_timeline/{{screen_name}}',
    update: '/shuo/v2/statuses/',
    upload: '/shuo/v2/statuses/',
    destroy: '/shuo/v2/statuses/{{id}}_delete',
    retweet: '/shuo/v2/statuses/{{id}}/reshare_post',

    // likes
    favorites_create: '/shuo/v2/statuses/{{id}}/like',
    favorites_destroy: '/shuo/v2/statuses/{{id}}/like_delete',

    // comment
    comments: '/shuo/v2/statuses/{{id}}/comments',
    // comments_timeline: '/comments/timeline',
    // comments_mentions: '/comments/mentions',
    comment: '/shuo/v2/statuses/{{id}}/comments_post',
    reply: '/shuo/v2/statuses/{{id}}/comments_post',
    comment_destroy: '/shuo/v2/statuses/comment/{{cid}}',
    // search
    support_search: false,
    search: '/search/topics',
    user_search: '/shuo/v2/users/search',
    // friendship
    followers: '/shuo/v2/users/{{user_id}}/followers',
    friends: '/shuo/v2/users/{{user_id}}/following',
    friendships_create: '/shuo/v2/friendships/create',
    friendships_destroy: '/shuo/v2/friendships/destroy',
    friendships_show: '/shuo/v2/friendships/show',
    oauth_scope: ['shuo_basic_r' , 'shuo_basic_w', 'douban_basic_common']
  }),

  apply_auth: function (url, args, user) {
    delete args.data.source;
    if (args.__refresh_access_token) {
      return;
    }
    if (user.oauth_token_key) {
      // Authorization: Bearer xxx
      args.headers.Authorization = 'Bearer ' + user.oauth_token_key;
      // args.data.access_token = user.oauth_token_key;
    }
  },

  refresh_access_token: function (user, callback, context) {
    var params = {
      url: this.config.oauth_access_token,
      type: 'post',
      user: user,
      play_load: 'json',
      apiHost: this.config.oauth_host,
      data: {
        client_id: this.config.oauth_key,
        client_secret: this.config.oauth_secret,
        refresh_token: user.oauth_refresh_token,
        grant_type: 'refresh_token'
      },
      need_source: false,
      __refresh_access_token: true
    };
    this._sendRequest(params, function (data, text_status, error_code) {
      var result = null;
      if (text_status !== 'error' && data && data.access_token) {
        // https://developers.google.com/accounts/docs/OAuth2InstalledApp?hl=zh-CN#choosingredirecturi
        result = {
          oauth_token_key: data.access_token,
          oauth_expires_in: data.expires_in,
          oauth_token_type: data.token_type
        };
      } else {
        text_status = text_status || 'error';
        error_code = error_code || JSON.stringify(data);
      }
      callback.call(context, result, text_status, error_code);
    });
  },

  retweet: function (data, callback, context) {
    var params = {
      url: this.config.retweet,
      type: 'post',
      play_load: 'status',
      data: data
    };
    this._sendRequest(params, callback, context);
  },

  user_show: function (data, callback) {
    if (!data.id) {
      return callback();
    }
    this.user_search({q: data.id, user: data.user}, function (users, code_text, code) {
      callback(users && users[0], code_text, code);
    });
  },

  // user, callback, data
  verify_credentials: function (user, callback, data) {
    var self = this;
    self.super_.verify_credentials.call(self, user, function (result, code_text, code) {
      self.user_show({id: result.id, user: result}, function (userAll) {
        callback(userAll || result, code_text, code);
      });
    }, data);
  },

  format_upload_params: function (user, data, pic) {
    data.text = data.status;
    delete data.status;
    pic.keyname = 'image';
  },

  before_sendRequest: function (args, user) {
    if (args.data.max_id) {
      args.data.until_id = args.data.max_id;
      delete args.data.max_id;
    }
    if (args.data.status) {
      args.data.text = args.data.status;
      delete args.data.status;
    }
    if (args.data.cursor) {
      args.data.start = args.data.cursor;
      delete args.data.cursor;
    }
    switch (args.url) {
    case this.config.user_timeline:
      if (args.data.id) {
        args.data.screen_name = args.data.id;
        delete args.data.id;
      }
      break;
    case this.config.favorites_create:
      args.type = 'POST';
      break;
    case this.config.favorites_destroy:
      args.type = 'DELETE';
      args.url = args.url.replace('_delete', '');
      break;
    case this.config.comment:
      args.type = 'POST';
      args.data.text = args.data.comment;
      delete args.data.comment;
      args.url = args.url.replace('_post', '');
      break;
    case this.config.destroy:
      args.type = 'DELETE';
      args.url = args.url.replace('_delete', '');
      break;
    case this.config.retweet:
      args.type = 'POST';
      args.url = args.url.replace('_post', '');
      break;
    case this.config.friendships_create:
      args.data.user_id = args.data.id;
      delete args.data.id;
      break;
    case this.config.friendships_destroy:
      args.data.user_id = args.data.id;
      delete args.data.id;
      break;
    }
  },

  format_result: function (data, play_load, args) {
    var items = data;
    if (!$.isArray(items)) {
      items = data.results || data.users ||
        data.statuses || data.comments || data.favorites || data.reposts;
    }
    if ($.isArray(items)) {
      var needs = [];
      for (var i = 0, l = items.length; i < l; i++) {
        items[i] = this.format_result_item(items[i], play_load, args);
      }
      if (data.statuses || data.comments || data.favorites || data.reposts) {
        data.items = items;
        delete data.statuses;
        delete data.comments;
        delete data.favorites;
        delete data.reposts;
      }

      // set cursor
      var cursor = parseInt(args.data && args.data.start || 0, 10) || 0;
      cursor += items.length;
      data.next_cursor = cursor;
    } else {
      data = this.format_result_item(data, play_load, args);
      if (args.url === this.config.rate_limit_status) {
        if (data.limit_time_unit === 'HOURS') {
          data.hourly_limit = data.user_limit;
          data.remaining_hits = data.remaining_user_hits;
        }
      }
    }
    return data;
  },

  format_result_item: function (data, play_load, args) {
    if (play_load === 'user') {
      var user = {
        id: data.id,
        screen_name: data.name || data.screen_name,
        name: data.uid,
        profile_image_url: data.large_avatar || data.avatar,
        t_url: data.alt || data.original_site_url,
        created_at: data.created_at || data.created,
        // city: data.city || data.loc_id,
        city_name: data.city || data.loc_name,
        location: data.location,
        is_first_visit: data.is_first_visit,
        new_site_to_vu_count: data.new_site_to_vu_count,
        description: data.description || data.desc,
        verified: data.verified || false,
        logged_in: data.logged_in,

        followers_count: data.followers_count,
        friends_count: data.following_count,
        statuses_count: data.statuses_count,

        blocked: data.blocked,
        blocking: data.blocking,
      };

      if (args && args.url === this.config.friends) {
        // following by me
        user.followed_by = data.following;
      } else {
        // following by user
        user.following = data.following;
      }

      if (!user.t_url) {
        if (data.type === 'user') {
          user.t_url = 'http://www.douban.com/people/' + data.uid;
        }
      }
      user._data = data;
      return user;
      // "relation": "contact", //和当前登录用户的关系，friend或contact
    } else if (play_load === 'status') {
      var status = {
        id: data.id,
        created_at: data.created_at,
        retweet_count: data.reshared_count,
        favorite_count: data.like_count,
        comments_count: data.comments_count,
        text: data.text,
        favorited: data.liked,
        user: this.format_result_item(data.user, 'user', args),
      };
      var url = status.user.t_url;
      if (!/\/$/.test(url)) {
        url += '/';
      }
      status.t_url = url + 'status/' + status.id;
      if (!status.text) {
        status.text = data.title;
        if (status.text === '说：') {
          status.text = '转播';
        }
      } else if (data.title !== '说：') {
        status.text = '“' + status.text + '” , ' + data.title;
      }

      var attachments = data.attachments;
      if (attachments && attachments.length) {
        var attachment = attachments[0];
        status.text = status.text || '';
        if (attachment.title) {
          status.text += ' : ' + attachment.title;
        }
        if (attachment.description) {
          status.text += ' >> "' + attachment.description + '"';
        }
        if (attachment.href) {
          status.text += ' ' + attachment.href;
        }
        var media = attachment.media;
        if (media && media.length) {
          media = media[0];
          if (media.type === 'image') {
            status.original_pic = media.original_src;
            status.bmiddle_pic = media.original_src;
            status.thumbnail_pic = media.src;
            if (status.original_pic && /\/spic\//.test(status.original_pic)) {
              status.original_pic = status.original_pic.replace('/spic/', '/opic/');
              status.bmiddle_pic = status.bmiddle_pic.replace('/spic/', '/lpic/');
            }
            if (!status.original_pic) {
              status.original_pic = status.thumbnail_pic.replace('/small/', '/raw/');
              status.bmiddle_pic = status.thumbnail_pic.replace('/small/', '/median/');
            }
          }
        }
      }
      if (data.source && data.source.href) {
        status.source = '<a href="' + data.source.href + '">' + data.source.title + '</a>';
      }
      // 替换打分星星 [score]4[/score]
      if (status.text && /\[score\]\d\[\/score\]/.test(status.text)) {
        status.text = status.text.replace('[score]5[/score]', '★★★★★');
        status.text = status.text.replace('[score]4[/score]', '★★★★☆');
        status.text = status.text.replace('[score]3[/score]', '★★★☆☆');
        status.text = status.text.replace('[score]2[/score]', '★★☆☆☆');
        status.text = status.text.replace('[score]1[/score]', '★☆☆☆☆');
        status.text = status.text.replace('[score]0[/score]', '');
      }
      status._data = data;
      if (data.reshared_status) {
        status.retweeted_status = this.format_result_item(data.reshared_status, 'status');
      }
      // console.log(status)
      return status;
    } else if (play_load === 'comment') {
      var comment = data;
      comment.user = this.format_result_item(data.user, 'user');
      return comment;
    }
    return data;
  },

  // reset_count: function (data, callback, context) {
  //   callback.call(context);
  // },
});



var TianyaAPI = Object.inherits({}, sinaApi, {
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://open.tianya.cn/api',
        source: '12d4d19aee679b8713297c2583fe21b204dd9ca0a',
        oauth_key: '12d4d19aee679b8713297c2583fe21b204dd9ca0a',
        oauth_secret: '0b3b77ad0586343a18670a18e44d7457',
        result_format: '', // 由outformat参数确定返回值格式
        oauth_callback: FAWAVE_OAUTH_CALLBACK_URL,
        userinfo_has_counts: false, // 用户信息中是否包含粉丝数、微博数等信息
        comment_need_user_id: true,
        support_comment: true,
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_max_id: false,
        support_favorites: false,
        support_do_favorite: false,
        support_mentions: true,
        support_auto_shorten_url: false,
        support_followers: false,
        user_timeline_need_friendship: false,
        //support_cursor_only: true,
        support_search: false,
        support_direct_messages: false,
        support_sent_direct_messages: false,
        support_blocking: false,
        oauth_host: 'http://open.tianya.cn',
        oauth_authorize:      '/oauth/authorize.php',
        oauth_request_token:  '/oauth/request_token.php',
        oauth_access_token:   '/oauth/access_token.php',
        update: '/weibo/add.php',
        upload: '/weibo/addimg.php',
        verify_credentials: '/user/info.php',
        friends_timeline: '/weibo/gethomeline.php',
        user_timeline: '/weibo/getmyweibo.php',
        comments_timeline: '/weibo/getreceivecomment.php',
        mentions: '/weibo/getaboutme.php',
        comment: '/weibo/addcomment.php',
    }),

    user_cache: {},

    apply_auth: function(url, args, user) {
        if(url && url.indexOf('access_token.php') < 0 && user.oauth_token_secret) {
            // oauth_token
            // oauth_token_secret
            args.data.oauth_token = user.oauth_token_key;
            args.data.oauth_token_secret = user.oauth_token_secret;
            // timestamp: time()
            // tempkey: strtoupper(md5($timestamp.$appkey.$oauth_token.$oauth_token_secret.$appsecret))
            var timestamp = (new Date().getTime() / 1000).toFixed(0);
            var tempkey = hex_md5(timestamp + this.config.oauth_key +
                user.oauth_token_key + user.oauth_token_secret + this.config.oauth_secret).toUpperCase();
            args.data.timestamp = timestamp;
            args.data.tempkey = tempkey;
        } else {
            this.super_.apply_auth.call(this, url, args, user);
        }
    },
    counts: function(data, callback, context) {
      callback.call(context);
    },

    rate_limit_status: function(data, callback, context) {
      callback.call(context, {error: _u.i18n("comm_no_api")});
    },

    url_encode: function(text) {
      return text;
    },

    before_sendRequest: function(args, user) {
        args.data.outformat = 'json';
        if (args.url.indexOf('/oauth/') < 0) {
            args.data.appkey = args.data.source;
            delete args.data.source;
        }
        if (args.url === this.config.update) {
            args.data.word = args.data.status;
            delete args.data.status;
        }
        if (args.data.count) {
            args.data.pagesize = args.data.count;
            delete args.data.count;
        }
        if (args.url === this.config.comment) {
            // http://open.tianya.cn/wiki/index.php?title=Weibo/addcomment
            args.data.word = encodeURIComponent(args.data.comment);
            args.data.authorid = args.data.user_id;
            delete args.data.comment;
            delete args.data.user_id;
        }
    },

    format_upload_params: function(user, data, pic) {
        pic.keyname = 'media';
        data.appkey = data.source;
        delete data.source;
        data.word = data.status;
        delete data.status;
    },
    format_result: function(data, play_load, args) {
        if(data && !data.error && data.data) {
            data = data.data.items || data.data;
        }
        if($.isArray(data)) {
            for(var i = 0, l = data.length; i < l; i++) {
                data[i] = this.format_result_item(data[i], play_load, args);
            }
        } else {
            data = this.format_result_item(data, play_load, args);
        }
        return data;
    },
    format_result_item: function(data, play_load, args) {
        if(play_load === 'user') {
            data = data.user || data;
            data.id = data.user_id;
            data.screen_name = data.user_name;
            if(data.register_date) {
                data.created_at = new Date(data.register_date);
            }
            if(data.birthday) {
                data.birthday = new Date(data.birthday);
            }
            data.verified = !!data.isvip;
            // gender: 性别,m--男，f--女,n--未知
            data.gender = 'n';
            if (data.sex && data.sex.indexOf) {
                if (data.sex.indexOf('男') >= 0) {
                    data.gender = 'm';
                } else if (data.sex.indexOf('女') >= 0) {
                    data.gender = 'f';
                }
            }
            data.description = data.describe;
            // http://tx.tianyaui.com/logo/32962113
            data.profile_image_url = data.userheadphoto || 'http://tx.tianyaui.com/logo/' + data.id;
            data.t_url = 'http://my.tianya.cn/' + data.id;
        } else if(play_load === 'status') {
            data.text = data.originContent || data.titleOrigin;
            delete data.originContent;
            delete data.titleOrigin;
            delete data.word;
            if(this.user_cache[data.uid]) {
                data.user = this.user_cache[data.uid];
            } else {
                data.user = {
                    user_id: data.uid,
                    user_name: data.uname
                };
                data.user = this.format_result_item(data.user, 'user', args);
            }
            delete data.uid;
            delete data.uname;

            if(data.time) {
                data.created_at = new Date(data.time);
                delete data.time;
            }
            if(data.medias && data.medias.image && data.medias.image[0]) {
                var image = data.medias.image[0];
                data.thumbnail_pic = image.sUrl;
                data.bmiddle_pic = image.mUrl;
                data.original_pic = image.lUrl;
            }
            delete data.medias;
            delete data.media;
            data.t_url = 'http://my.tianya.cn/t/' + data.user.id + '/' + data.id;
            data.source = data.from;
            delete data.from;
            data.repost_count = data.shareCount;
            data.comments_count = data.replyCount;

            if(data.sharedId) {
                data.retweeted_status = {
                    id: data.sharedId,
                    text: htmldecode(data.sharedTitle || '')
                };
                if(data.sharedMedias && data.sharedMedias.image && data.sharedMedias.image[0]) {
                    var image = data.sharedMedias.image[0];
                    data.retweeted_status.thumbnail_pic = image.sUrl;
                    data.retweeted_status.bmiddle_pic = image.mUrl;
                    data.retweeted_status.original_pic = image.lUrl;
                }
                delete data.sharedMedias;
                delete data.sharedMedia;
                data.retweeted_status.repost_count = data.sharedShareCount;
                data.retweeted_status.comments_count = data.sharedReplyCount;

                if(this.user_cache[data.sharedUid]) {
                    data.retweeted_status.user = this.user_cache[data.sharedUid];
                } else {
                    data.retweeted_status.user = {
                        user_id: data.sharedUid,
                        user_name: data.sharedUname
                    };
                    data.retweeted_status.user = this.format_result_item(data.retweeted_status.user, 'user', args);
                }
                data.retweeted_status.t_url = 'http://my.tianya.cn/t/' + data.retweeted_status.user.id + '/' + data.retweeted_status.id;
            }
        } else if(play_load === 'comment') {
            data.text = data.wordOrigin;
            delete data.wordOrigin;
            delete data.word;
            data.user = {
                user_id: data.uid,
                user_name: data.uname
            };
            data.user = this.format_result_item(data.user, 'user', args);
            delete data.uid;
            delete data.uname;
            data.created_at = new Date(data.time);
            delete data.time;

            if(data.twId) {
                data.status = {
                    id: data.twId,
                    media: data.twMedia,
                    mediaFlag: data.twMediaFlag,
                    medias: data.twMedias,
                    replyCount: data.twReplyCount,
                    shareCount: data.twShareCount,
                    star: data.twStar,
                    title: data.twTitle,
                    titleOrigin: data.twTitleOrigin,
                    uid: data.twUid,
                    uname: data.twUname
                };
                data.status = this.format_result_item(data.status, 'status', args);
                for(var k in data) {
                    if(k.indexOf('tw') === 0) {
                        delete data[k];
                    }
                }
                if(data.sharedTwId) {
                    data.status.retweeted_status = {
                        id: data.sharedTwId,
                        media: data.sharedTwMedia,
                        mediaFlag: data.sharedTwMediaFlag,
                        medias: data.sharedTwMedias,
                        replyCount: data.sharedTwReplyCount,
                        shareCount: data.sharedTwShareCount,
                        star: data.sharedTwStar,
                        title: data.sharedTwTitle,
                        titleOrigin: data.sharedTwTitleOrigin || htmldecode(data.sharedTwTitle || ''),
                        uid: data.sharedTwUid,
                        uname: data.sharedTwUname
                    };
                    data.status.retweeted_status = this.format_result_item(data.status.retweeted_status, 'status', args);
                    for(var k in data) {
                        if(k.indexOf('sharedTw') === 0) {
                            delete data[k];
                        }
                    }
                }
            }
        }
        return data;
    }
});

// facebook: http://developers.facebook.com/docs/api
var FacebookAPI = Object.inherits({}, sinaApi, {
    config: Object.inherits({}, sinaApi.config, {
        host: 'https://graph.facebook.com/v2.9',
        user_home_url: 'http://www.facebook.com/',
        source: '121425774590172',
        oauth_key: '121425774590172',
        oauth_secret: 'ab7ffce878acf3c7e870c0e7f0a1b29a',
        result_format: '',
        userinfo_has_counts: false,
        support_counts: false,
        support_cursor_only: true,  // 只支持游标方式翻页
        support_friends_only: true, // 只支持friends
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_sent_direct_messages: false,
        support_comment: false,
        support_do_comment: true,
        support_mentions: false,
        support_favorites: false,
        support_auto_shorten_url: false,
        user_timeline_need_friendship: false,
        support_blocking: false,

        direct_messages: '/me/inbox',
        verify_credentials: '/me',
        friends_timeline: '/me/feed',
        destroy: '/{{id}}_delete',
        user_timeline: '/me/feed',
        update: '/me/feed_update',
        upload: '/me/photos',
        friends: '/{{user_id}}/friends',
        followers: '/{{user_id}}/friends',
        comment: '/{{id}}/comments',
        favorites_create: '/{{id}}/likes',
        favorites_destroy: '/{{id}}/likes',
        new_message: '/{{id}}/notes',

        oauth_authorize:      '/oauth/authorize',
        oauth_request_token:  '/oauth/request_token',
        oauth_callback: OAUTH_CALLBACK_URL2,
        oauth_access_token:   '/oauth/access_token',
        oauth_scope: [
            'user_about_me',
            'user_photos',
            'user_posts',

            //'user_likes',
            'user_website',
            'user_location',

            'publish_actions',"public_profile","user_friends"/*,"email"*/
        ].join(',')
    }),

    url_encode: function(text) {
        return text;
    },

    apply_auth: function(url, args, user) {

    },

    get_access_token: function(user, callback, context) {
        var params = {
            url: this.config.oauth_access_token,
            type: 'get',
            user: user,
            play_load: 'status',
            apiHost: this.config.oauth_host,
            data: {
                client_id: this.config.oauth_key,
                redirect_uri: this.config.oauth_callback,
                client_secret: this.config.oauth_secret,
                code: user.oauth_pin
            },
            need_source: false
        };
        this._sendRequest(params, function(token, text_status, error_code) {
            if(text_status != 'error') {
                //token = decodeForm(token_str);
                if(!token.access_token) {
                    token = null;
                    error_code = token_str;
                    text_status = 'error';
                } else {
                    user.oauth_token_key = token.access_token;
                }
            }
            callback.call(context, token ? user : null, text_status, error_code);
        });
    },

    // 获取认证url
    get_authorization_url: function (user, callback, context) {
        var params = {
            client_id: this.config.oauth_key,
            redirect_uri: this.config.oauth_callback,
            scope: this.config.oauth_scope
        };
        var login_url = this.format_authorization_url(params);
        callback.call(context, login_url, 'success', 200);
    },

    format_upload_params: function(user, data, pic) {
        data.message = data.status;
        delete data.status;
        if (user.oauth_token_key) {
            data.access_token = user.oauth_token_key;
        }
        pic.keyname = 'source';
    },

    before_sendRequest: function(args, user) {
        delete args.data.source;
        delete args.data.since_id;
        if(args.play_load == 'string') {
            return;
        }
        if (user.oauth_token_key) {
            args.data.access_token = user.oauth_token_key;
        }
        if (args.data.count) {
            args.data.limit = args.data.count;
            delete args.data.count;
        }
        if(args.data.cursor) {
            if(String(args.data.cursor) != '-1') {
                if(args.url == this.config.friends) {
                    args.data.offset = args.data.cursor;
                } else {
                    args.data.until = args.data.cursor;
                }
            }
            delete args.data.cursor;
        }
        if(args.url == this.config.update) {
            args.url = args.url.replace('_update', '');
            args.data.message = args.data.status;
            delete args.data.status;
        }
        else if(args.url == this.config.comment) {
            args.data.message = args.data.comment;
            delete args.data.comment;
        }
        else if(args.url == this.config.destroy) {
            args.url = args.url.replace('_delete', '');
            args.type = 'DELETE';
        }
        else if(args.url == this.config.favorites_destroy) {
            args.type = 'DELETE';
        }
        else if(args.url == this.config.new_message) {
            args.data.message = args.data.text;
            args.data.subject = args.data.text.slice(0, 80);
            delete args.data.text;
        } else if(args.url == this.config.user_search) {
            // https://graph.facebook.com/search?q=mark&type=user
            args.url = '/search';
            args.data.type = 'user';
        } else if(args.url == this.config.search) {
            args.url = '/search';
            args.data.type = 'post';
        }
    },

    format_result: function(data, play_load, args) {
        var items = data;
        if(!$.isArray(data) && data.data) {
            items = data.items = data.data;
            delete data.data;
        }
        if($.isArray(items)) {
            for(var i in items) {
                items[i] = this.format_result_item(items[i], play_load, args);
            }
        } else {
            data = this.format_result_item(data, play_load, args);
        }
        if(data.paging) { // cursor 分页
            if(data.paging.next) {
                var params = decodeForm(data.paging.next);
                data.next_cursor = String(params.until || params.offset);
            } else {
                data.next_cursor = '0'; // 到底了
            }
        }
        if (!data.user) {
            data.user = args.user;
        }
        return data;
    },

    format_result_item: function(data, play_load, args) {
        if(play_load == 'user' && data && data.id) {
            data.t_url = data.link || 'http://www.facebook.com/profile.php?id=' + data.id;
            data.profile_image_url = this.config.host + '/' + data.id + '/picture';
            data.screen_name = data.name;
            data.description = data.about;
//          gender_map: {0:'n', 1:'m', 2:'f'},
            if(data.gender) {
                data.gender = data.gender == 'male' ? 'm' : 'f';
            } else {
                data.gender = 'n';
            }
            // "location": {"id": "106262882745698",  "name": "Guangzhou, China"}
            if(data.location && data.location.name) {
                data.province = data.location.name;
            }
            if(data.hometown && data.hometown.name) {
                data.city = data.hometown.name;
            }
            delete data.location;
            delete data.hometown;
            delete data.about;
        } else if(play_load == 'status' || play_load == 'message') {
            data.text = data.message || '';
            if(!data.text) {
                if(data.name) {
                    data.text += ' ' + data.name;
                }
                if(data.link) {
                    data.text += ' ' + data.link;
                }
            }
            delete data.message;
            data.t_url = data.link;
            delete data.link;
            if(data.picture) {
                if(data.picture.indexOf('/safe_image.php?') > 0) {
                    data.thumbnail_pic = data.picture;
                    var params = decodeForm(data.picture);
                    data.bmiddle_pic = params.url;
                    data.original_pic = data.bmiddle_pic;
                } else {
                    data.thumbnail_pic = data.picture;
                    data.bmiddle_pic = data.picture.replace('_s.', '_n.');
                    data.original_pic = data.bmiddle_pic;
                }
                delete data.picture;
            }
            if(data.application) {
                data.source = '<a href="http://www.facebook.com/apps/application.php?id={{id}}" target="_blank">{{name}}</a>'.format(data.application);
                delete data.application;
            }
            data.user = this.format_result_item(data.from, 'user', args);
            data.created_at = data.created_time || data.updated_time;
            delete data.from;
        } else if(play_load == 'comment') {
        }
        return data;
    }
});


// plurk: http://www.plurk.com/API/issueKey
var PlurkAPI = Object.inherits({}, sinaApi, {
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://www.plurk.com/API',
        source: '4e4QGBY94z6v3zvb2rvDqH8yzSccvk2D',
        result_format: '',
        support_counts: false,
        support_comment: false,
        support_double_char: false,
        support_direct_messages: false,
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_mentions: false,
//        support_user_search: false, // 暂时屏蔽
        support_cursor_only: true,  // 只支持游标方式翻页
        support_auto_shorten_url: false,
        user_timeline_need_friendship: false,
        support_blocking: false,
        repost_pre: 'RT', // 转发前缀
        verify_credentials: '/Users/login',
        update: '/Timeline/plurkAdd',
        upload: '/Timeline/uploadPicture',
        destroy: '/Timeline/plurkDelete',
        favorites: '/Timeline/getPlurks?filter=only_favorite',
        favorites_create: '/Timeline/favoritePlurks',
        favorites_destroy: '/Timeline/unfavoritePlurks',
        friends_timeline: '/Polling/getPlurks',
        followers: '/FriendsFans/getFansByOffset',
        friends: '/FriendsFans/getFollowingByOffset',
        friendships_create: '/FriendsFans/setFollowing?user_id={{id}}&follow=true',
        friendships_destroy: '/FriendsFans/setFollowing?user_id={{id}}&follow=false',
        comment: '/Responses/responseAdd',
        comment_destroy: '/Responses/responseDelete',
        comments: '/Responses/get',
        search: '/PlurkSearch/search',
        user_search: '/UserSearch/search',
        user_timeline: '/Timeline/getPlurks' // filter: Can be only_user
    }),

    url_encode: function(text) {
        return text;
    },

    format_upload_params: function(user, data, pic) {
        data.api_key = data.source;
        delete data.source;
        delete data.lat;
        delete data.long;
        pic.keyname = 'image';
    },

    upload: function(user, params, pic, before_request, onprogress, callback, context) {
        this.super_.upload.call(this, user, {}, pic, before_request, onprogress, function(data) {
            if(data && data.full) {
                params.user = user;
                params.status += ' ' + data.full;
                this.update(params, callback, context);
            } else {
                callback.call(context, 'error');
            }
        }, this);
    },

    before_sendRequest: function(args) {
        // args.data.source => args.data.app_key
        args.data.api_key = args.data.source;
        delete args.data.source;
        if(args.data.count) {
            args.data.limit = args.data.count;
            delete args.data.count;
        }
        if(args.url == this.config.update) {
            args.data.content = args.data.status;
            delete args.data.status;
            args.data.qualifier = ':';
        }
        if(args.url == this.config.destroy) {
            args.data.plurk_id = args.data.id;
            delete args.data.id;
        }
        if(args.url == this.config.favorites_create || args.url == this.config.favorites_destroy) {
            args.data.ids = '[' + args.data.id + ']';
            delete args.data.id;
        }
        if(args.url == this.config.friends_timeline) {
            if(!args.data.since_id) {
                args.url = this.config.user_timeline;
            } else {
                args.data.offset = args.data.since_id;
                delete args.data.since_id;
            }
            args.is_friends_timeline = true;
        }
        if(args.data.cursor) {
            args.data.offset = args.data.cursor;
            // 如果是friends_timeline，获取旧数据需要user_timeline接口
            if(args.is_friends_timeline) {
                args.url = this.config.user_timeline;
            }
            delete args.data.cursor;
        }
        if(args.url == this.config.user_timeline) {
//          args.data.filter = 'only_user';
            delete args.data.screen_name;
            delete args.data.id;
        }
        if(args.url == this.config.followers || args.url == this.config.friends) {
            delete args.data.screen_name;
            delete args.data.limit;
            if(args.data.offset && String(args.data.offset) == '-1') {
                args.data.offset = 0;
            }
        }
        if(args.url == this.config.comments) {
            args.data.plurk_id = args.data.id;
            delete args.data.id;
        }
        if(args.url == this.config.comment) {
            args.data.plurk_id = args.data.id;
            args.data.content = args.data.comment;
            args.data.qualifier = ':';
            delete args.data.comment;
            delete args.data.id;
        }
        if(args.url == this.config.search || args.url == this.config.user_search) {
            args.data.query = args.data.q;
            delete args.data.q;
        }
    },

    apply_auth: function (url, args, user) {
        // 登录的时候才需要认证数据
        if (args.url === this.config.verify_credentials && user.authType === 'baseauth') {
            args.data.username = user.userName;
            args.data.password = user.password;
        }
    },

    format_result: function(data, play_load, args) {
        if (data.success_text == 'ok') {
            return true;
        }
        var items = data;
        if(args.url == this.config.user_search) {
            items = data.users;
        }
        var status_users = data.plurk_users || data.plurks_users || data.friends || data.users;
        delete data.plurk_users;
        delete data.plurks_users;
        delete data.friends;
        delete data.users;
        if(args.url != this.config.verify_credentials && data && (data.plurks || data.responses)) {
            items = data.plurks || data.responses;
            data.items = items;
            delete data.plurks;
            delete data.responses;
        }
        if($.isArray(items)) {
            for(var i in items) {
                if(play_load == 'status' || play_load == 'comment') {
                    items[i].user = this.format_result_item(status_users[String(items[i].owner_id || items[i].user_id)], 'user', args);
                }
                items[i] = this.format_result_item(items[i], play_load, args);
            }
            // 设置cursor
            if(items.length > 0) {
                if(args.url == this.config.followers
                        || args.url == this.config.friends
                        || args.url == this.config.user_search) {
                    data = {items: items};
                    var last_offset = Number(args.data.offset || 0);
                    data.next_cursor = last_offset + items.length;
                } else {
                    // 需要去掉GMT才可以正确分页，奇怪
                    if(items[items.length-1].created_at) {
                        data.next_cursor = new Date(items[items.length-1].created_at.replace(' GMT', '')).format("yyyy-M-dThh:mm:ss"); // 2009-6-20T21:55:34
                    }
                    if(args.is_friends_timeline) {
                        // 设置cursor_id
                        items[0].cursor_id = new Date(items[0].created_at.replace(' GMT', '')).format("yyyy-M-dThh:mm:ss");
                    }
                    if(args.url == this.config.comments) {
                        data.has_next = false;
                        data.comment_count = data.response_count;
                    }
                }
            } else {
                if(args.url == this.config.followers
                        || args.url == this.config.friends
                        || args.url == this.config.user_search) {
                    // 没有数据了
                    data = {items: [], next_cursor: '0'};
                }
            }
        } else {
            data = this.format_result_item(data, play_load, args);
        }
        return data;
    },

    STATUS_IMAGE_RE: /\[img\|\|([^\|]+)\|\|([^\|]+)\|\|[^\]]+\]/i,
    // http://images.plurk.com/7599513_960138cc109c460ada4fc26195dcf79f.jpg
    STATUS_IMAGE_RE2: /http:\/\/images\.plurk\.com\/([\w\_\-]+)\.\w+/i,

    format_result_item: function(data, play_load, args) {
        if(play_load == 'user' && data) {
//          data.friends_count = data.fans_count;
            data.followers_count = data.fans_count;
            var user_info = data.user_info || data;
            data.screen_name = user_info.display_name || user_info.nick_name;
            data.user_name = user_info.nick_name;
            data.id = user_info.id;
            data.gender = user_info.gender == 1 ? 'm' : (user_info.gender == 2 ? 'f' : 'n');
            if (user_info.has_profile_image) {
                if(user_info.avatar) {
                    data.profile_image_url = 'http://avatars.plurk.com/{{id}}-medium{{avatar}}.gif'.format(user_info);
                } else {
                    data.profile_image_url = 'http://avatars.plurk.com/{{id}}-medium.gif'.format(user_info);
                }
            } else {
                data.profile_image_url = 'http://www.plurk.com/static/default_medium.gif';
            }
//          data.statuses_count = '';
        } else if(play_load == 'status') {
            data.text = data.content_raw; // + '<hr />' + data.content;
            // [img||http://images.plurk.com/tn_bce71a811306b51d7c6a4d09c824716d.gif||http://icanhascheezburger.files.wordpress.com/2011/01/8d541dd8-5efd-48be-b72a-cc777e57ded6.jpg||http://feedproxy.google.com/~r/ICanHasCheezburger/~3/43qwiPfzKOY/||comic]
            var m = this.STATUS_IMAGE_RE.exec(data.text);
            if(m) {
                data.original_pic = m[2];
                data.thumbnail_pic = m[1];
                data.bmiddle_pic = m[2];
                data.text = data.text.replace(m[0], '');
            } else {
                m = this.STATUS_IMAGE_RE2.exec(data.text);
                if(m) {
                    data.original_pic = m[0];
                    data.thumbnail_pic = 'http://images.plurk.com/tn_' + m[1] + '.gif';
                    data.bmiddle_pic = m[0];
                    data.text = data.text.replace(m[0], '');
                }
            }
            data.id = data.plurk_id;
            data.created_at = data.posted;
            delete data.posted;
            delete data.plurk_id;
            delete data.content;
            delete data.content_raw;
        } else if(play_load == 'comment') {
            data.text = data.content_raw;
            data.created_at = data.posted;
            delete data.content;
            delete data.content_raw;
        }
        return data;
    }
});

var TumblrAPI = Object.inherits({}, sinaApi, {
    config: Object.inherits({}, sinaApi.config, {
        host: 'https://api.tumblr.com/v2',
        source: '',
        oauth_host: 'https://www.tumblr.com',
        oauth_key: 'mAlMxvwJ9LHwiBDHiMgNk65y9weZW2UtcdOSWyTWTUi1S39OnF',
        oauth_secret: 'k9QW6nFZIyJtAqQgZ6Q5FHyJyGJa8D7Im7RG9mip4NFtgJSrhH',
        oauth_callback: OAUTH_CALLBACK_URL2,
        result_format: '',
        userinfo_has_counts: false, //用户信息中是否包含粉丝数、微博数等信息
        support_counts: false,
        support_repost: true,
        support_comment_repost: true,
        support_repost_timeline: false, // 支持查看转发列表
        support_cursor_only: true,  // 只支持游标方式翻页
        support_mentions: false,
        support_direct_messages: false,
        support_auto_shorten_url: false,
        need_processMsg: false,
        user_timeline_need_friendship: false,

        verify_credentials: '/user/info'
    }),


    /**
     * 返回数据实体格式化
     * @param {Object} data
     * @param {{String:screen_name,String:profile_image_url,id:String}} [output] data.user 返回的用户数据结构
     * @param {('user'|'status'|'message'|'comment')} play_load
     * @param {Object} args
     * @param {Object} 
     * 
     * @return {Object} data
     */
    format_result_item: function (data, play_load, args) {
        if (play_load === 'user') {
            data = {
                screen_name:data.name,
                profile_image_url:'https://s3.meituan.net/v1/mss_3d027b52ec5a4d589e68050845611e68/avatar/s0/00/00/00.jpg',
                id:1
            };
        }
        return data;
    },

    /**
     * 解析http请求响应数据
     * 
     * @param {Object|undefined} [input+output] data 请求返回数据
     * @param {Number|undefined} data.ret
     * @param {String|undefined} data.error
     * @param {String|Array[Object]|undefined} data.errors
     * @param {String} play_load 请求类型 
     * @param {String} args 请求参数
     * @return {error_textStatus:String, error_code:Number, newData:Object} result
     */
    parseResponse: function(data,play_load,args) {
        var error_textStatus = null;
        var error_code = null;
        if (typeof(data) !== 'string') {
            const meta = data.meta;
            if (meta.status != 200) {
                error_textStatus = meta.msg;
                error_code = meta.status;
            } else {
                data = this.format_result(data.response,play_load,args);
            }
        }
        
        return {error_textStatus,error_code,newData:data};
    },

});


var TSinaAPI = WeiboAPI = sinaApi;


var T_APIS = {
    'tsina': TSinaAPI,
    'weibo': WeiboAPI2,
    'tqq': TQQAPI,
    'leihou': LeiHouAPI,
    'fanfou': FanfouAPI,
    'douban_v2': DoubanAPI2,
    //'renren': RenrenAPI,
    'googleplus': GooglePlusAPI,
    'facebook': FacebookAPI,
    'plurk': PlurkAPI,
    //'identi_ca': StatusNetAPI,
    'tumblr': TumblrAPI,
    'tianya': TianyaAPI,
    'twitter': TwitterAPI // fxxx gxfxw first.
};


// 封装兼容所有微博的api，自动判断微博类型
var tapi = {

    // 自动判断当前用户所使用的api, 根据user.blogType判断
    api_dispatch: function(data) {
        return T_APIS[(data.user ? data.user.blogType : data.blogType) || 'tsina'];
    },

    search: function(data, callback, context) {
        return tapi.api_dispatch(data).search(data, callback, context);
    },

    user_search: function(data, callback, context) {
        return tapi.api_dispatch(data).user_search(data, callback, context);
    },

    translate: function(user, text, target, callback, context) {
        return tapi.api_dispatch(user).translate(text, target, callback, context);
    },

    processMsg: function(user, str_or_status, not_encode) {
        return tapi.api_dispatch(user).processMsg(str_or_status, not_encode);
    },

    find_at_users: function(user, str) {
        return tapi.api_dispatch(user).find_at_users(str);
    },

    get_config: function(user) {
        return this.api_dispatch(user).config;
    },

    get_authorization_url: function (user, callback, context) {
      return this.api_dispatch(user).get_authorization_url(user, callback, context);
    },

    get_access_token: function (user, callback, context) {
      return this.api_dispatch(user).get_access_token(user, callback, context);
    },

    refresh_access_token: function (user, callback, context) {
      return this.api_dispatch(user).refresh_access_token(user, callback, context);
    },

    verify_credentials: function (user, callback, data, context) {
        return this.api_dispatch(user).verify_credentials(user, callback, data, context);
    },

    rate_limit_status: function (data, callback, context){
        return this.api_dispatch(data).rate_limit_status(data, callback, context);
    },

    // since_id, max_id, count, page
    friends_timeline: function (data, callback, context){
        return this.api_dispatch(data).friends_timeline(data, callback, context);
    },

    // id, user_id, screen_name, since_id, max_id, count, page
    user_timeline: function (data, callback, context){
        return this.api_dispatch(data).user_timeline(data, callback, context);
    },

    // id, count, page
    comments_timeline: function (data, callback, context){
        return this.api_dispatch(data).comments_timeline(data, callback, context);
    },

    // id, count, page, since_id, max_id
    repost_timeline: function (data, callback, context){
        return this.api_dispatch(data).repost_timeline(data, callback, context);
    },

    // since_id, max_id, count, page
    mentions: function (data, callback, context){
        return this.api_dispatch(data).mentions(data, callback, context);
    },

    // same to mentions
    comments_mentions: function (data, callback, context) {
      return this.api_dispatch(data).comments_mentions(data, callback, context);
    },

    // id, user_id, screen_name, cursor, count
    followers: function (data, callback, context){
        return this.api_dispatch(data).followers(data, callback, context);
    },

    // id, user_id, screen_name, cursor, count
    /**
     * 获取关注人列表
     *
     * cursor: 用于分页请求，请求第1页cursor传-1，
     *  在返回的结果中会得到next_cursor字段，
     *  表示下一页的cursor。next_cursor为0表示已经到记录末尾。
     * 返回值格式 data = {users: [], next_cursor: xx}
     */
    friends: function(data, callback, context){
        return this.api_dispatch(data).friends(data, callback, context);
    },

    // page
    favorites: function(data, callback, context){
        return this.api_dispatch(data).favorites(data, callback, context);
    },

    // id
    favorites_create: function(data, callback, context){
        return this.api_dispatch(data).favorites_create(data, callback, context);
    },

    // id
    favorites_destroy: function(data, callback, context){
        return this.api_dispatch(data).favorites_destroy(data, callback, context);
    },

    // ids
    counts: function(data, callback, context){
        return this.api_dispatch(data).counts(data, callback, context);
    },

    // id
    user_show: function(data, callback, context){
        return this.api_dispatch(data).user_show(data, callback, context);
    },

    // since_id, max_id, count
    direct_messages: function(data, callback, context){
        return this.api_dispatch(data).direct_messages(data, callback, context);
    },

    // since_id, max_id, count
    sent_direct_messages: function(data, callback, context){
        return this.api_dispatch(data).sent_direct_messages(data, callback, context);
    },

    // id
    destroy_msg: function(data, callback, context){
        return this.api_dispatch(data).destroy_msg(data, callback, context);
    },

    new_message: function(data, callback, context){
        return this.api_dispatch(data).new_message(data, callback, context);
    },

    update: function (data, callback, context){
        return this.api_dispatch(data).update(data, callback, context);
    },

    upload: function (user, data, pic, before_request, onprogress, callback, context) {
        return this.api_dispatch(user).upload(user, data, pic,
                before_request, onprogress, callback, context);
    },

    repost: function(data, callback, context){
        return this.api_dispatch(data).repost(data, callback, context);
    },

    comment: function(data, callback, context){
        return this.api_dispatch(data).comment(data, callback, context);
    },

    reply: function(data, callback, context){
        return this.api_dispatch(data).reply(data, callback, context);
    },

    comments: function(data, callback, context){
        return this.api_dispatch(data).comments(data, callback, context);
    },

    // id
    comment_destroy: function(data, callback, context){
        return this.api_dispatch(data).comment_destroy(data, callback, context);
    },

    friendships_create: function(data, callback, context){
        return this.api_dispatch(data).friendships_create(data, callback, context);
    },

    // id
    friendships_destroy: function(data, callback, context){
        return this.api_dispatch(data).friendships_destroy(data, callback, context);
    },

    friendships_show: function(data, callback, context){
        return this.api_dispatch(data).friendships_show(data, callback, context);
    },

    // type
    reset_count: function(data, callback, context){
        return this.api_dispatch(data).reset_count(data, callback, context);
    },

    // id
    retweet: function(data, callback, context){
        return this.api_dispatch(data).retweet(data, callback, context);
    },

    // id
    destroy: function(data, callback, context){
        return this.api_dispatch(data).destroy(data, callback, context);
    },

    // user_id, count, page
    tags: function(data, callback, context) {
        return this.api_dispatch(data).tags(data, callback, context);
    },

    // count, page
    tags_suggestions: function(data, callback, context) {
        return this.api_dispatch(data).tags_suggestions(data, callback, context);
    },

    // tags
    create_tag: function(data, callback, context) {
        return this.api_dispatch(data).create_tag(data, callback, context);
    },

    // tag_id
    destroy_tag: function(data, callback, context) {
        return this.api_dispatch(data).destroy_tag(data, callback, context);
    },

    // id
    status_show: function(data, callback, context) {
        return this.api_dispatch(data).status_show(data, callback, context);
    },

    // page, count
    blocks_blocking: function(data, callback, context) {
        return this.api_dispatch(data).blocks_blocking(data, callback, context);
    },

    // page, count
    blocks_blocking_ids: function(data, callback, context) {
        return this.api_dispatch(data).blocks_blocking_ids(data, callback, context);
    },

    // user_id, screen_name
    blocks_create: function(data, callback, context) {
        return this.api_dispatch(data).blocks_create(data, callback, context);
    },

    // user_id, screen_name
    blocks_destroy: function(data, callback, context) {
        return this.api_dispatch(data).blocks_destroy(data, callback, context);
    },

    // user_id, screen_name
    blocks_exists: function(data, callback, context) {
        return this.api_dispatch(data).blocks_exists(data, callback, context);
    },

    // str
    findSearchText: function(user, str) {
        return this.api_dispatch(user).findSearchText(str);
    },

    // str
    formatSearchText: function(user, str) {
        return this.api_dispatch(user).formatSearchText(str);
    }
};



/**
 * http://www.instapaper.com/api/simple
 *
 * @type Object
 */
var Instapaper = {

    request: function(user, url, data, callback, context){
        var headers = {};
        if(user) {
            headers = {Authorization: make_base_auth_header(user.username, user.password)};
        }
        $.ajax({
            url: url,
            data: data,
            timeout: 60000,
            type: 'post',
            beforeSend: function(req) {
                for(var k in headers) {
                    req.setRequestHeader(k, headers[k]);
                }
            },
            success: function(data, text_status, xhr){
                callback.call(context, text_status == 'success', text_status, xhr);
            },
            error: function(xhr, text_status, err){
                callback.call(context, false, text_status, xhr);
            }
        });
    },

    authenticate: function(user, callback, context) {
        var api = 'https://www.instapaper.com/api/authenticate';
        this.request(user, api, {}, callback, context);
    },

    add: function(user, data, callback, context){
        var api = 'https://www.instapaper.com/api/add';
        this.request(user, api, data, callback, context);
    }
};

/**
 * Read It Later: http://readitlaterlist.com/api/docs/
 */
var ReadItLater = {
    apikey: '5bOAabomd1c6eRl363pQy55JaNTMBf20',
    request: Instapaper.request,
    // https://readitlaterlist.com/v2/auth?username=name&password=123&apikey=yourapikey
    authenticate: function(user, callback, context) {
        var api = 'https://readitlaterlist.com/v2/auth';
        user.apikey = this.apikey;
        this.request(null, api, user, callback, context);
    },
    // https://readitlaterlist.com/v2/add?username=name&password=123&apikey=yourapikey&url=http://google.com&title=Google
    add: function(user, data, callback, context){
        var api = 'https://readitlaterlist.com/v2/add';
        data.username = user.username;
        data.password = user.password;
        data.apikey = this.apikey;
        this.request(null, api, data, callback, context);
    }
};

/*!
 * weibo-mid - lib/mid.js
 *
 * https://github.com/fengmk2/weibo-mid
 *
 * 新浪微博mid与url互转实用工具
 * 初始版本作者: @XiNGRZ (http://weibo.com/xingrz)
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

var mid = {
  BASE62: [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ]
};

/**
 * Base62 decode.
 *
 * @param {String} str
 * @return {String}
 */
mid.base62Decode = function (str) {
  var num = 0;
  var len = str.length;
  for (var i = 0; i < len; i++) {
    var n = len - i - 1;
    var s = str[i];
    num += mid.BASE62.indexOf(s) * Math.pow(62, n);
  }
  return num;
};

/**
 * Base64 encode.
 *
 * @param {String} num
 * @return {String}
 */
mid.base62Encode = function (num) {
  var str = '';
  var r = 0;
  while (num !== 0 && str.length < 100) {
    r = num % 62;
    str = mid.BASE62[r] + str;
    num = Math.floor(num / 62);
  }
  return str;
};

/**
 * Conver base62 hash string to number string.
 *
 * @param {String} hash weibo hash string, e.g.: "wr4mOFqpbO"
 * @return {String} number string, e.g.: "201110410216293360"
 */
mid.decode = function (hash) {
  var id = '';

  for (var end = hash.length; end > 0; end -= 4) {
    var start = end - 4;
    if (start < 0) {
      start = 0;
    }
    var h = hash.substring(start, end);
    var n = String(mid.base62Decode(h));
    var padding = 7 - n.length;
    if (padding > 0 && start > 0) {
      // not first group and not 7 length string, must add '0' padding.
      for (; padding > 0; padding--) {
        n = '0' + n;
      }
    }
    id = n + id;
  }

  return id;
};

/**
 * Convert number string to base62 hash string.
 *
 * @param {String} mid weibo mid, e.g.: "201110410216293360"
 * @return {String} hash string, e.g.: "wr4mOFqpbO"
 */
mid.encode = function (id) {
  id = String(id);
  if (!/^\d+$/.test(id)) {
    return id;
  }

  var hash = '';
  for (var end = id.length; end > 0; end -= 7) {
    var start = end - 7;
    if (start < 0) {
      start = 0;
    }
    var num = id.substring(start, end);
    var h = mid.base62Encode(num);
    var padding = 4 - h.length;
    if (padding > 0 && start > 0) {
      // not first group and not 4 length string, must add '0' padding.
      for (; padding > 0; padding--) {
        h = '0' + h;
      }
    }
    hash = h + hash;
  }

  return hash;
};

var WeiboUtil = mid;
WeiboUtil.mid2url = mid.encode;
WeiboUtil.url2mid = mid.decode;
