//嘀咕api http://code.google.com/p/digu-api/wiki/DiguAPI
var DiguAPI = Object.inherits({}, sinaApi, {

    // 覆盖不同的参数
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://api.minicloud.com.cn',
        user_home_url: 'http://t.digu.com/',
        search_url: 'http://digu.com/search/',
        source: 'fawave',
        support_comment: false,
        support_do_comment: false,
        support_double_char: false,
        support_repost: false,
        support_comment_repost: false,
        support_repost_timeline: false,
        support_max_id: false,
        support_sent_direct_messages: false,
        support_auto_shorten_url: false,
        repost_pre: '转载:',
        support_search_max_id: false,
        user_timeline_need_friendship: false,
        support_blocking: false,

        verify_credentials:   '/account/verify',

        mentions:             '/statuses/replies',

        destroy_msg:          '/messages/handle/destroy/{{id}}',
        direct_messages:      '/messages/100', // message ：0 表示悄悄话，1 表示戳一下，2 表示升级通知，3 表示代发通知，4 表示系统消息。100表示不分类，都查询。其余参数跟
        new_message:          '/messages/handle/new',
        upload:               '/statuses/update',
        repost:               '/statuses/update',
        comment:              '/statuses/update',
        reply:                '/statuses/update',
//        friends_timeline:     '/1.1/statuses/friends_timeline',
//        user_timeline:     '/1.1/statuses/user_timeline',
        search: '/search_statuses',
        user_search: '/search_user',

        gender_map: {0:'n', 1:'m', 2:'f'},

        ErrorCodes: {
            '-1': '服务器错误',
            '0': '未知原因',
            '1': '用户名或者密码为空',
            '2': '用户名或者密码错误',
            '3': '访问的URL不正确',
            '4': 'id指定的记录信息不存在。',
            '5': '重复发送',
            '6': '包含敏感非法关键字，禁止发表',
            '7': '包含敏感信息进入后台审核',
            '8': '认证帐号被关小黑屋，被禁言，不能够发表信息了。',
            '9': '表示发送悄悄话失败',
            '10': '没有操作权限（比如删除只能删除自己发的，或者自己收藏的，或者自己收到的信息）',
            '11': '指定的用户不存在',
            '12': '注册的用户已经存在',
            '13': '表单值是空值，或者没有合法的颜色值，没有修改。修改失败。',
            '14': '上传文件异常，请检查是否符合要求',
            '15': '更新用户信息失败。',
            '16': '删除失败，删除收藏夹分类时，分类的名字是必须的。',
            '17': '删除失败，删除收藏夹分类时,分类不存在',
            '18': '传递过来的参数为空或者异常',
            '19': '重复收藏',
            '20': '只能给跟随自己的人发送信息',
            '21': '用户名、昵称或者密码不合法，用户名、昵称或者密码必须是4-12位，只支持字母、数字、下划线',
            '22': '两次输入的秘密不正确',
            '23': 'Email格式不正确。',
            '24': '这个的帐号已被占用',
            '25': '发送太频繁，帐号暂时被封',
            '26': '服务器繁忙或者你访问的频率太高，超出了规定的限制',
            '27': '对不起，你的ip被官方封掉了，请联系我们的工作人员，进行相关处理',
            '28': '对不起，用户昵称中包含非法关键字。',
            '29': '对不起，所在地包含非法关键字。',
            '30': '对不起，个人兴趣包含非法关键字。',
            '31': '对不起，签名（个人简介）包含非法关键字。',
            '32': '对不起，昵称已经被占用',
            '33': 'Http请求方法不正确'
        }
    }),

    processAt: function(str) { //@***
        str = str.replace(/^@([\w\-\u4e00-\u9fa5|\_]+)/g, '<a target="_blank" href="http://digu.com/search/friend/' +'$1" title="点击打开用户主页">@$1</a>');
        str = str.replace(/([^\w#])@([\w\-\u4e00-\u9fa5|\_]+)/g, '$1<a target="_blank" href="http://digu.com/search/friend/' +'$2" title="点击打开用户主页">@$2</a>');

        return str;
    },
    searchMatchReg: /(^|[^a-zA-Z0-9\/])(#)([\w\u4e00-\u9fa5|\_]+)/g,
    processSearch: function(str) {
        return str.replace(this.searchMatchReg, '$1<a title="Search $2$3" href="'
            + this.config.search_url + '%23$3" target="_blank">$2$3</a>');
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
    processEmotional: function(str) {
        return str.replace(/\[:(\d{2})\]|\{([\u4e00-\u9fa5,\uff1f]{2,})\}/g, this._replaceEmotional);
    },
    _replaceEmotional: function(m, g, g2){
        if(g2 && window.DIGU_EMOTIONS && DIGU_EMOTIONS[g2]){
            return '<img src="http://images.digu.com/web_res_v1/emotion/' + DIGU_EMOTIONS[g2] + '.gif" />';
        }else if(g && (g>0) && (g<33)){
            return '<img src="http://images.digu.com/web_res_v1/emotion/' + g + '.gif" />';
        }else{
            return m;
        }
    },

    rate_limit_status: function (data, callback, context) {
        callback.call(context, {error: _u.i18n("comm_no_api")});
    },

    reset_count: function (data, callback, context) {
        callback.call(context);
    },

    counts: function (data, callback, context) {
        callback.call(context);
    },

    comments_timeline: function (data, callback, context) {
        callback.call(context);
    },

    // url_encode: function (text) {
    //     return text;
    // },

    /* content[可选]：更新的Digu消息内容， 请确定必要时需要进行UrlEncode编码，另外，不超过140个中文或者英文字。
     */
    before_sendRequest: function (args) {
        if (args.url === this.config.update) { // repost, update, reply
            // status => content
            // sina_id => digu_id @回应 reply
            if (args.data.status) {
                args.data.content = args.data.status;
                delete args.data.status;
            }
            if (args.data.sina_id) {
                args.data.digu_id = args.data.sina_id;
                delete args.data.sina_id;
            }
        } else if (args.url === this.config.friends || args.url === this.config.followers) {
            // cursor. 选填参数. 单页只能包含100个粉丝列表，为了获取更多则cursor默认从-1开始，
            // 通过增加或减少cursor来获取更多的，如果没有下一页，则next_cursor返回0
            args.data.page = args.data.cursor == '-1' ? 1 : args.data.cursor;
            delete args.data.cursor;
            if (!args.data.page){
                args.data.page = 1;
            }
            if (args.data.user_id){
                //args.data.friendUserId = args.data.user_id;
                args.data.friendUserIdOrName = args.data.user_id;
            }
//          if(args.data.screen_name){
//              //args.data.friendUsername = args.data.screen_name;
//              args.data.friendUserIdOrName = args.data.screen_name;
//          }
            delete args.data.user_id;
            delete args.data.screen_name;
        } else if (args.url === this.config.new_message) {
            // id => receiveUserId , text => content , message=0: 必须 0 表示悄悄话 1 表示戳一下
            args.data.content = args.data.text;
            args.data.receiveUserId = args.data.id;
            args.data.message = 0;
            delete args.data.text;
            delete args.data.id;
        } else if (args.url === this.config.friendships_create ||
              args.url === this.config.friendships_destroy) {
            // id => userIdOrName
            args.data.userIdOrName = args.data.id;
            // method change to get
            args.type = 'get';
            delete args.data.source;
            delete args.data.id;
        } else if (args.url === this.config.user_timeline) {
            if (args.data.id) {
                // args.data.userIdOrName = args.data.id;
                // id is name
                args.data.name = args.data.id;
                delete args.data.id;
            } else if (args.data.screen_name){
                args.data.userIdOrName = args.data.screen_name;
                delete args.data.screen_name;
            }
        } else if (args.url === this.config.verify_credentials) {
            args.data.isAllInfo = true;
            delete args.data.source;
        }

        if (args.data.userIdOrName) {
            args.data.userIdOrName = this.url_encode(args.data.userIdOrName);
        }
    },

    /* content[可选]：更新的Digu消息内容， 请确定必要时需要进行UrlEncode编码，另外，不超过140个中文或者英文字。
     * imageX[可选]：发送图片。如果要发送图片，这个不能为空，并且，Form类型为multipart data。
     * 如 enctype="multipart data"，且，input的type为file类型。最多上传3张图片，每张图片大小不能超过1M。
     * 如果上传一张，这个X就是数字0，即input的名字是image0，如果上传两张，input的名字分别是image0 image1，以此类推，最多3张。
     * 格式只支持".png"，".jpg"，".jpeg"，".gif"，".bmp"。
     * uploadImg[上传图片必须]： 隐含授权码的字段。如果用户想上传图片，需要需要传递此参数，参数值为：xiexiezhichi
     */
    format_upload_params: function (user, data, pic) {
        data.uploadImg = 'xiexiezhichi';
        data.content = data.status;
        delete data.status;
        pic.keyname = 'image0';
    },

    format_result: function(data, play_load, args) {
        // digu {"wrong":"no data"}
        if (data.wrong === 'no data') {
            data = [];
        }
        if (args.url === this.config.friendships_create) {
            // new api: http://code.google.com/p/digu-api/wiki/User
            // result : 操作结果 返回结果为11时表示用户不存存
            // 当type=1时，返回结果为：
            //  0表示你申请者被该用户屏蔽，不能与他成为好友关系；
            //  -1表示 跟随失败；-2表示跟随的人数超过了1000，系统不允许再跟随其他人；
            //  -3表示被跟随的人设置了隐私保护，
            //  提交申请失败；
            //    1表示跟随成功；
            //    2表示已经跟随；
            //    3表示被跟随的用户设置了隐私保护，已经提交了跟随申请。
            // 当type=2、3、4、5、6时，返回结果为0表示操作失败，1表示操作成功。
            if (data.result === 0) {
                data.message = '你被该用户屏蔽，不能与他成为好友关系';
                data.success = true;
            } else if (data.result === 1) {
                data = true;
            } else if (data.result === 2) {
                data.message = '已经跟随';
                data.success = true;
            } else if (data.result === 3) {
                data.message = '用户设置了隐私保护，已经提交了跟随申请';
                data.success = true;
            } else if (data.result === -1) {
                data.success = false;
            } else if (data.result === -2) {
                data.message = '你跟随的人数超过了1000';
                data.success = false;
            } else if (data.result === -3) {
                data.message = '他设置了隐私保护，无法跟随';
                data.success = false;
            }
            return data;
        }
        if ($.isArray(data)) {
            for(var i in data) {
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

    format_result_item: function(data, play_load, args) {
        if (play_load === 'status' && data.id) {
            data.favorited = data.favorited === 'true';
            if(data.picPath && data.picPath.length > 0) {
                // http://img2.digu.com/100x75/u/1290361951998_9a36990561cf56f66c2333ee836d0441.jpg
                // http://pic.digu.com:80/file/12/93/99/27/201011/d144f3f76aaebf5df71c0003ca0767e9_100x75.JPEG
                data.thumbnail_pic = data.picPath[0];
                data.bmiddle_pic = data.thumbnail_pic.replace(/([\/_])100x75/, function(m, $1) {
                    return $1 + '640x480';
                });
                data.original_pic = data.thumbnail_pic.replace(/[\/_]100x75/, '');
            }
            delete data.picPath;
            var tpl = 'http://t.digu.com/detail/';
            if(data.in_reply_to_status_id !== '0' && data.in_reply_to_status_id !== '') {
                // 查看相关对话的url
                data.related_dialogue_url = 'http://t.digu.com/relatedDialogue/' + data.id;
            }
            data.t_url = tpl + data.id;
            this.format_result_item(data.user, 'user', args);
        } else if (play_load === 'user' && data && data.id) {
            data.id = data.name || data.id;
            // data.t_url = data.url || ('http://t.digu.com/' + (data.name || data.id));
            // data.url change
            data.t_url = 'http://t.digu.com/' + (data.name || data.id);
            data.gender = this.config.gender_map[data.gender];
            // 将小头像从 _24x24 => _48x48
            if (data.profile_image_url) {
                data.profile_image_url = data.profile_image_url.replace(/([\/_])24x24/, function(m, $1) {
                    return $1 + '48x48';
                });
            }
        } else if (play_load === 'comment') {
            this.format_result_item(data.user, 'user', args);
        } else if (play_load === 'message') {
            this.format_result_item(data.sender, 'user', args);
            this.format_result_item(data.recipient, 'user', args);
        }
        if (data.text) {
            data.text = htmldecode(data.text);
        }
        return data;
    }

});


//identi.ca
var StatusNetAPI = Object.inherits({}, TwitterAPI, {

    // 覆盖不同的参数
    config: Object.inherits({}, TwitterAPI.config, {
        host: 'http://identi.ca/api',
        user_home_url: 'http://identi.ca/',
        status_prev_url: 'http://identi.ca/notice/',
        search_url: 'http://identi.ca/tag/',
        source: 'FaWave', // Basic Auth 会显示这个，不过显示不了链接
        oauth_key: 'c71100649f6c6cfb4eebbacca18de8f6',
        oauth_secret: 'f3ef411594e624f7eda7e1c0ae6b9029',
        repost_pre: 'RT',
        support_double_char: false,
        support_comment: false,
        support_do_comment: false,
        support_repost: false,
        support_comment_repost: false,
        support_upload: false,
        support_repost_timeline: false,
        support_sent_direct_messages: false,
        support_auto_shorten_url: false,
        support_user_search: false, //暂时屏蔽
        support_blocking: false,
        oauth_callback: 'oob',
        // search: '/search_statuses',
        repost: '/statuses/update',
        retweet: '/statuses/retweet/{{id}}',
        favorites_create: '/favorites/create/{{id}}',
        friends_timeline: '/statuses/home_timeline',
        search: '/search.json?q='
    }),

    format_upload_params: function (user, data, pic) {
        pic.keyname = 'media';
    },

    url_encode: function (text) {
        return text;
    },

    format_result_item: function(data, play_load, args) {
        data = this.super_.format_result_item.apply(this, [data, play_load, args]);
        if (play_load === 'user' && data && data.id) {
            data.following = false;
            if(data.statusnet_profile_url) {
                data.t_url = data.statusnet_profile_url;
            } else {
                data.t_url = this.config.user_home_url + data.screen_name;
            }
        } else if (play_load === 'status' && data) {
            data.t_url = this.config.status_prev_url + data.id;
            if(!data.user) { // search data
                data.user = {
                    screen_name: data.from_user,
                    profile_image_url: data.profile_image_url,
                    id: data.from_user_id
                };
                delete data.profile_image_url;
                delete data.from_user;
                delete data.from_user_id;
            }
            if (data.attachments) {
                if (data.attachments.length) {
                    for (var i = 0, l = data.attachments.length; i < l; i++) {
                        var attachment = data.attachments[i];
                        if (attachment.mimetype && attachment.mimetype.indexOf('image') >= 0) {
                            data.thumbnail_pic = attachment.url;
                            data.bmiddle_pic = data.thumbnail_pic;
                            data.original_pic = data.thumbnail_pic;
                        }
                    }
                } else if (data.attachments.ori_pic) {
                    data.thumbnail_pic = data.attachments.small_pic.url;
                    data.bmiddle_pic = data.attachments.middle_pic.url;
                    data.original_pic = data.attachments.ori_pic.url;
                    delete data.attachments;
                }
            }
            // repeat_count => repost_count
            // reply_count => comments_count
            if (!data.repost_count) {
                data.repost_count = data.repeat_count || 0;
            }
            if (!data.comments_count) {
                data.comments_count = data.reply_count || 0;
            }
        }
        return data;
    }
});


// http://wiki.dev.`.com/wiki/API
var RenrenAPI = Object.inherits({}, sinaApi, {
    config: Object.inherits({}, sinaApi.config, {
        host: 'http://api.renren.com/restserver.do',
        oauth_host: 'https://graph.renren.com',
        user_home_url: 'http://www.renren.com/',
        source: '4f3e0d2c2ccc4ccf8c30767b08da9253',
        oauth_key: '4f3e0d2c2ccc4ccf8c30767b08da9253',
        oauth_secret: 'be199423964443a583780ec10b8381fb',
        call_id: 0,
        result_format: '',
        //userinfo_has_counts: false,
        support_counts: false,
        support_cursor_only: false,  // 只支持游标方式翻页
        support_friends_only: true, // 只支持friends
        support_repost: true,
        support_comment_repost: true,
        support_repost_timeline: false,
        support_direct_messages: false,
        support_sent_direct_messages: false,
        support_comment: false,
        support_do_comment: true,
        support_mentions: false,
        support_favorites: false,
        support_auto_shorten_url: false,
        support_max_id: false, // page 翻页
        user_timeline_need_friendship: false,
        use_method_param: true, // only one api path
        support_blocking: false,
        support_search: false,
        support_user_search: false, // 支持搜人
        user_search: 'friends.search',

        direct_messages: '/me/inbox',
        verify_credentials: 'users.getLoggedInUser', //'users.getLoggedInUser => uid => users.getProfileInfo',
        user_profile: 'users.getProfileInfo',
        user_profile_fields: ['base_info', 'status', 'visitors_count', 'blogs_count', 'albums_count',
                              'friends_count', 'guestbook_count', 'status_count'].join(','),
        friends_timeline: 'feed.get',
        // http://wiki.dev.renren.com/wiki/Type%E5%88%97%E8%A1%A8
        friends_timeline_type: '10,20,21,30,32,50,51,52',
        destroy: '/{{id}}_delete',
        user_timeline: 'feed.get',//'status.gets',
        comments: 'status.getComment',
        comments_need_status: true, // 评论列表需要结合status才能获取
        update: 'status.set',
        upload: 'photos.upload',
        friends: 'friends.getFriends',
        followers: 'friends.getFriends',
        users: 'users.getInfo',
        photos: 'photos.get',
        comment: 'status.addComment',
        reply: 'status.addComment',
        repost: 'status.forward', //
        repost_need_status: true,
        favorites_create: 'like.like',
        favorites_destroy: 'like.unlike',
        favorite_need_status: true,
        support_favorite_count: true, // 是否显示被收藏次数
        new_message: '/{{id}}/notes',

        oauth_authorize:      '/oauth/authorize',
        oauth_callback: FAWAVE_OAUTH_CALLBACK_URL,
        oauth_access_token:   '/oauth/token',
        oauth_scope: [
            'read_user_feed',
            'read_user_message',
            'read_user_photo', 'read_user_status', 'read_user_comment',
            'read_user_share',
            'publish_feed', 'publish_share',
            'send_request',
            'send_message', 'photo_upload',
            'status_update', 'publish_comment',
            'operate_like'
        ].join(' ')
    }),

    url_encode: function (text) {
        return text;
    },

    apply_auth: function (url, args, user) {

    },

    get_access_token: function (user, callback, context) {
        var params = {
            url: this.config.oauth_access_token,
            type: 'get',
            user: user,
            play_load: 'string',
            apiHost: this.config.oauth_host,
            data: {
                client_id: this.config.oauth_key,
                redirect_uri: this.config.oauth_callback,
                client_secret: this.config.oauth_secret,
                code: user.oauth_pin,
                grant_type: 'authorization_code'
            },
            need_source: false
        };
        this._sendRequest(params, function (token_str, text_status, error_code) {
            var token = null;
            if (text_status !== 'error') {
                token = JSON.parse(token_str);
                if (!token.access_token) {
                    token = null;
                    error_code = token_str;
                    text_status = 'error';
                } else {
                    user.oauth_token_key = token.access_token;
                    user.oauth_expires_in = token.expires_in;
                    user.oauth_scope = token.scope;
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
            scope: this.config.oauth_scope,
            response_type: 'code'
        };
        var login_url = this.format_authorization_url(params);
        callback.call(context, login_url, 'success', 200);
    },

    // http://wiki.dev.renren.com/wiki/Calculate_signature
    signature: function (params, user) {
        params.access_token = user.oauth_token_key;
        params.api_key = this.config.oauth_key;
        params.v = '1.0';
        var kvs = [];
        for (var k in params) {
            kvs.push([k, params[k]]);
        }
        kvs.sort(function (a, b) {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            if (a[1] < b[1]) return  -1;
            if (a[1] > b[1]) return 1;
            return 0;
        });
        var sig = "";
        for (var p = 0; p < kvs.length; ++p) {
            var value = kvs[p][1];
            if (value == null) continue;
            sig += kvs[p][0] + '=' + value;
        }
        sig = hex_md5(sig + this.config.oauth_secret);
        params.sig = sig;
    },

    before_sendRequest: function (args, user) {
        delete args.data.source;
        delete args.data.since_id;
        if (args.play_load === 'string') {
            return;
        }
        args.data.method = args.url;
        var status_type = 'status';
        var data_status = null;
        if (args.data.status && args.data.status.id) {
            data_status = args.data.status;
            status_type = data_status.status_type;
            if (status_type === 'status') {
                args.data.status_id = args.data.id;
                args.data.owner_id = data_status.user.id;
            } else if (status_type === 'photo') { // photo
                args.data.pid = args.data.id;
                args.data.uid = data_status.user.id;
            } else if (status_type === 'share') {
                args.data.share_id = args.data.id;
                args.data.user_id = data_status.user.id;
            }
            delete args.data.id;
            delete args.data.status;
        }
        if (args.url === this.config.user_timeline) {
            args.data.uid = args.data.id;
            delete args.data.id;
            delete args.data.screen_name;
            args.data.type = this.config.friends_timeline_type;
        } else if (args.url === this.config.friends_timeline) {
            args.data.type = this.config.friends_timeline_type;
        } else if (args.url === this.config.comments) {
            if(status_type === 'photo') {
                args.data.method = 'photos.getComments';
            } else if(status_type === 'share') {
                args.data.method = 'share.getComments';
            }
            args.data.order = 1; // 获取留言的排序规则，0表示升序(最旧到新)，1表示降序(最新到旧)，默认为0
        } else if (args.url === this.config.comment) {
            if (args.data.reply_user_id) {
                args.data.rid = args.data.reply_user_id;
                delete args.data.reply_user_id;
                delete args.data.cid;
            }
            args.data.content = args.data.comment;
            if (status_type === 'photo') {
                args.data.method = 'photos.addComment';
            }  else if(status_type === 'share') {
                args.data.method = 'share.addComment';
                if(args.data.rid) {
                    args.data.to_user_id = args.data.rid;
                    delete args.data.rid;
                }
            }
            if (status_type !== 'share') {
                delete args.data.user_id;
            }
            delete args.data.comment;
        } else if(args.url === this.config.friends) {
            delete args.data.user_id;
            delete args.data.screen_name;
            var cursor = parseInt(args.data.cursor);
            delete args.data.cursor;
            if(cursor > 0) {
                args.data.page = cursor;
            }
        } else if (args.url === this.config.repost) {
            // http://wiki.dev.renren.com/wiki/Status.forward
            if (args.data.retweeted_status.status_type === 'status') {
                args.data.forward_id = args.data.id;
                delete args.data.id;
                args.data.forward_owner = args.data.retweeted_status.user.id;
                args.data.status += '//';
            } else {
                // 分享图片 http://wiki.dev.renren.com/wiki/Share.publish
                args.data.method = 'share.share';
                // http://wiki.dev.renren.com/wiki/Share.share
                args.data.type = args.data.retweeted_status.status_type === 'share' ? 20 : 2;
                args.data.ugc_id = args.data.retweeted_status.id;
                args.data.user_id = args.data.retweeted_status.user.id;
                args.data.comment = args.data.status;
                delete args.data.status;
            }
            delete args.data.retweeted_status;
        } else if (args.url === this.config.favorites_create ||
            args.url === this.config.favorites_destroy) {
            args.data = {
                method: args.url,
                url: 'http://www.renren.com/g?ownerid=' +
                    (args.data.owner_id || args.data.uid) +
                    '&resourceid=' + (args.data.status_id || args.data.pid) + '&type=' + status_type
            };
            // http://www.renren.com/g?ownerid=243366502&resourceid=3639744083&type=photo%EF%BC%9B
        } else if (args.url === this.config.user_search) {
            args.data.name = args.data.q;
            delete args.data.q;
        }

        args.type = 'post';
        args.data.format = 'json';
        args.url = '';
        var old_status = args.data.status;
        if (args.data.status) {
            // 必须先将字符串变成utf8编码进行签名计算, sb人人
            args.data.status = Base64._utf8_encode(args.data.status);
        }
        var old_content = args.data.content;
        if (args.data.content) {
            // 必须先将字符串变成utf8编码进行签名计算, sb人人
            args.data.content = Base64._utf8_encode(args.data.content);
        }
        var old_comment = args.data.comment;
        if (args.data.comment) {
            // 必须先将字符串变成utf8编码进行签名计算, sb人人
            args.data.comment = Base64._utf8_encode(args.data.comment);
        }
        this.signature(args.data, user);
        if (old_status) {
            // 将之前编码的字符串还原回来, fxxx
            args.data.status = old_status;
        }
        if (old_content) {
            // 将之前编码的字符串还原回来, fxxx
            args.data.content = old_content;
        }
        if (old_comment) {
            // 将之前编码的字符串还原回来, fxxx
            args.data.comment = old_comment;
        }
    },

    format_upload_params: function(user, data, pic) {
        delete data.source;
        data.method = this.config.upload;
        data.caption = data.status;
        delete data.status;
        data.format = 'json';
        var old_caption = data.caption;
        if (data.caption) {
            // 必须先将字符串变成utf8编码进行签名计算, sb人人
            data.caption = Base64._utf8_encode(data.caption);
        }
        this.signature(data, user);
        if (old_caption) {
            // 将之前编码的字符串还原回来, fxxx
            data.caption = old_caption;
        }
        pic.keyname = 'upload';
    },

    _at_match_rex: /@([●\w\-\_\u2E80-\u3000\u303F-\u9FFF]+)\(([\d]+)(\s?)\)/g,
    processAt: function (str) {
      // @xxx(123) @发微(385478335 )
      return str.replace(this._at_match_rex,
        '<a class="getUserTimelineBtn" href="" data-screen_name="$1" data-id="$2" rhref="' +
          this.config.user_home_url + 'g/$2" title="' +
          _u.i18n("btn_show_user_title") +'">@$1</a>$3');
    },

    _emotion_rex: typeof RENREN_FACES === 'object' ?
        new RegExp('\\((' + Object.keys(RENREN_FACES).join('|') + ')\\)', 'g') : null,

    processEmotional: function (str) {
        if (!this._emotion_rex) {
            return str;
        }
        return str.replace(this._emotion_rex, function (m, g1) {
            if (window.RENREN_FACES && g1) {
                var emotion = RENREN_FACES[g1];
                if (emotion) {
                    var tpl = '<img title="{{title}}" src="' + '{{emotion}}" />';
                    return tpl.format({title: g1, emotion: emotion});
                }
            }
            return m;
        });
    },

    format_result: function(data, play_load, args) {
        if (data && (data.result === 1 ||
            (args.data.method === 'share.share' && data.id) ||
            (args.data.method === 'status.forward' && data.id))) {
            return true;
        }
        if (args.data.method === 'share.getComments' && data && data.comments) {
            data = data.comments;
        } else if (args.data.method === 'friends.search' && data.friends) {
            var users = data.friends || [];
            data = [];
            // user_search
            // {id:243163664, isFriend:0,…}
            // id: 243163664
            // info: "暨南大学,松原市"
            // isFriend: 0
            // name: "ABC"
            // tinyurl: "http://hdn.xnimg.cn/photos/hdn421/20100821/1235/tiny_wTt6_94501e019118.jpg"
            for (var i = 0, l = users.length; i < l; i++) {
                var user = users[i];
                var info = user.info;
                if (info) {
                    info = info.split(',');
                    info = {
                        province: info[0],
                        city: info[1]
                    }
                }
                data.push({
                    id: user.id,
                    hometown_location: info,
                    name: user.name,
                    tinyurl: user.tinyurl,
                    isFriend: user.isFriend
                });
            }
        }
        return this.super_.format_result.call(this, data, play_load, args);
    },

    format_result_item: function (data, play_load, args) {
        if (play_load === 'user' && data && (data.uid || data.id)) {
            // http://www.renren.com/profile.do?id=263668818
            var user = {
                id: data.actor_id || data.uid || data.id,
                name: data.name
            };
            user.following = data.isFriend;
            delete data.uid;
            delete data.actor_id;
            delete data.name;
            user.t_url = 'http://www.renren.com/profile.do?id=' + user.id;
            user.profile_image_url = data.tinyurl || data.headurl;
            delete data.tinyurl;
            delete data.headurl;
            user.screen_name = user.name;
            user.description = data.network_name;
            delete data.network_name;
            user.gender = 'n';
            if (data.sex !== undefined) {
                user.gender = data.sex === 1 ? 'm' : 'f';
                delete data.sex;
            }
            if (data.base_info) {
                user.gender = data.base_info.gender == '1' ? 'm' : 'f';
                if (data.base_info.hometown) {
                    user.province = data.base_info.hometown.province;
                    user.city = data.base_info.hometown.city;
                }
            }
            delete data.base_info;
            if (data.hometown_location) {
                user.province = data.hometown_location.province;
                user.city = data.hometown_location.city;
            }
            delete data.hometown_location;
            user.followers_count = data.visitors_count;
            user.friends_count = data.friends_count;
            user.statuses_count = data.status_count;
            return user;
        } else if(play_load === 'status' || play_load === 'message') {
            // http://wiki.dev.renren.com/wiki/Feed.get
            data.id = data.status_id || data.source_id; // source_id 表示新鲜事内容主体的id，例如日志id、相册id和分享id等等
            delete data.post_id;
            delete data.status_id;
            if (data.message) {
                data.text = data.message;
            } else {
                var title = data.title || '';
                if (title) {
                    title += ' ';
                }
                data.text = title + (data.description || '');
            }
            data.user = this.format_result_item(data, 'user', args);

            data.t_url = data.href;
            data.status_type = 'status';
            if (data.feed_type === 30) {
                data.status_type = 'photo';
            } else if (data.feed_type === 32) {
                data.status_type = 'share';
                if (data.message) {
                    data.text = data.message;
                }
                // http://share.renren.com/share/263668818/13090856136
                data.t_url = 'http://share.renren.com/share/' + data.user.id + '/' + data.id;
            } else if (data.feed_type === 21) {
                // 分享blog
                data.status_type = 'share';
            } else if (data.feed_type === 51) {
                // share link
                data.status_type = 'share';
                var url = data.href;
                if (data.attachment && data.attachment[0]) {
                    // 过滤 ... 缩短的链接
                    if (data.attachment[0].href && data.attachment[0].href.indexOf('...') < 0) {
                        url = data.attachment[0].href
                    }
                }
                data.text = data.title + ' ' + url;
            }

            if (data.comments) {
                data.comments_count = data.comments.count || 0;
            }
            if (data.likes) {
                data.favorite_count = data.likes.total_count + data.likes.user_like;
                data.favorited = data.likes.user_like === 1;
            }
            if (data.attachment && data.attachment.length > 0) {
                for (var i = 0, l = data.attachment.length; i < l; i++) {
                    var attachment = data.attachment[i];
                    var pic_owner_id = attachment.owner_id;
                    if (attachment.media_type === 'photo') {
                        if (data.user.id === pic_owner_id && data.status_type !== 'share') {
                            data.thumbnail_pic = attachment.src;
                            data.bmiddle_pic = data.original_pic = attachment.raw_src || attachment.src;
                            data.pic_id = attachment.media_id;
                            data.pic_owner_id = pic_owner_id;
                            // data.t_url = attachment.href;
                            data.text = attachment.content;
                            // 如果是@用户，会出现html
                            // content: "<a href='http://www.renren.com/g/263668818' namecard='263668818' target='_blank'>@袁锋</a> 用户支持"
                            data.text = data.text.replace(/<a\shref=.+?namecard=['"](\d+)['"][^>]+>(@[^>]+)<\/a>/ig, '$2($1)');
                            // url http://photo.renren.com/photo/263668818/photo-4750759172
                            data.t_url = 'http://photo.renren.com/photo/' + data.user.id + '/photo-' + data.pic_id;
                            data.id = data.pic_id;
                        } else {
                            data.retweeted_status = data.retweeted_status || {};
                            if (!data.retweeted_status.original_pic) {
                                data.retweeted_status.id = data.retweeted_status.id || attachment.media_id;
                                data.retweeted_status.pic_id = attachment.media_id;
                                data.retweeted_status.pic_owner_id = pic_owner_id;
                                data.retweeted_status.thumbnail_pic = attachment.src;
                                data.retweeted_status.bmiddle_pic = data.retweeted_status.original_pic =
                                    attachment.raw_src || attachment.src;
                                data.retweeted_status.actor_id = pic_owner_id;
                                data.retweeted_status.name = data.retweeted_status.name || attachment.owner_name;
                                data.retweeted_status.t_url = attachment.href;
                                data.retweeted_status.text = data.retweeted_status.text || attachment.content ||
                                    data.description || data.title;
                                // share trace.node = [{id:1, name: n1}, ...]
                                // 替换 '转自xxx:' = > '转自@xxx(id):'
                                var node = (data.trace && data.trace.node) || [];
                                node.push({ id: pic_owner_id, name: data.retweeted_status.name });
                                for (var ni = 0, nl = node.length; ni < nl; ni++) {
                                    var nitem = node[ni];
                                    var ignoreText = '(转自|转)' + nitem.name + ':';
                                    data.text = data.text.replace(new RegExp(ignoreText, 'ig'),
                                        '$1@' + nitem.name + '(' + nitem.id + '):');
                                }
                            }
                        }
                    } else if (attachment.media_type === 'status') {
                        // repost
                        data.retweeted_status = data.retweeted_status || {};
                        data.retweeted_status.id = attachment.media_id;
                        data.retweeted_status.text = attachment.content;
                        data.retweeted_status.actor_id = pic_owner_id;
                        data.retweeted_status.name = attachment.owner_name;
                        data.retweeted_status.status_type = 'status';
                        // 替换 '转自xxx:' = > '转自@xxx(id):'
                        var ignoreText = '(转自|转)' + attachment.owner_name + ':';
                        data.text = data.text.replace(new RegExp(ignoreText, 'ig'),
                            '$1@' + attachment.owner_name + '(' + pic_owner_id + '):');
                    } else if (attachment.media_type === 'blog') {
                        // repost
                        data.retweeted_status = data.retweeted_status || {};
                        data.retweeted_status.id = attachment.media_id;
                        data.retweeted_status.text = data.title + ': ' + data.description + ' ' + data.href;
                        data.retweeted_status.actor_id = pic_owner_id;
                        data.retweeted_status.name = attachment.owner_name;
                    }
                }
                delete data.attachment;
                if (data.retweeted_status) {
                    data.retweeted_status.user = this.format_result_item(data.retweeted_status, 'user', args);
                    if (!data.retweeted_status.created_at) {
                        data.retweeted_status.created_at = data.update_time;
                    }
                    if (!data.retweeted_status.t_url) {
                        // http://status.renren.com/status/385478335/2374670284
                        data.retweeted_status.t_url = 'http://status.renren.com/status/' +
                            data.retweeted_status.user.id + '/' + data.retweeted_status.id;
                    }
                }
            }
            if (data.source) {
                data.source = '<a href="{{href}}" target="_blank">{{text}}</a>'.format(data.source);
            }
            if (!data.t_url) {
                // http://status.renren.com/status/385478335/2374670284
                data.t_url = 'http://status.renren.com/status/' + data.user.id + '/' + data.id;
            }
            data.created_at = data.update_time || data.time;
            delete data.update_time;
            delete data.time;
            delete data.message;
            delete data.title;
            delete data.prefix;
        } else if (play_load === 'comment') {
            data.id = data.comment_id;
            data.created_at = data.update_time || data.time;
            if (!data.text) {
                data.text = data.content;
            }
            delete data.comment_id;
            delete data.update_time;
            delete data.time;
            data.user = this.format_result_item(data, 'user', args);
        }
        return data;
    },

    // user, callback, data, context
    verify_credentials: function(user, callback, data, context) {
        this.super_.verify_credentials.call(this, user, function(result, code_text, code) {
            var params = {
                url: this.config.user_profile,
                play_load: 'user',
                data: {user: user, uid: result.id, fields: this.config.user_profile_fields}
            };
            this._sendRequest(params, callback, context);
        }, data, this);
    },

    _fill_pics: function(user, items, callback, context) {
        var items_map = {}, user_id_pic_map = {};
        items = items || [];
        for(var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var pid = item.pic_id;
            if(pid) {
                var list = items_map[pid] || [];
                list.push(item);
                items_map[pid] = list;
                var pids = user_id_pic_map[item.pic_owner_id] || [];
                pids.push(pid);
                user_id_pic_map[item.pic_owner_id] = pids;
            }
            if(item.retweeted_status && item.retweeted_status.pic_id) {
                item = item.retweeted_status;
                pid = item.pic_id;
                var list = items_map[pid] || [];
                list.push(item);
                items_map[pid] = list;
                var pids = user_id_pic_map[item.pic_owner_id] || [];
                pids.push(pid);
                user_id_pic_map[item.pic_owner_id] = pids;
            }
        }
        if(Object.keys(items_map).length === 0) {
            return callback.call(context, items);
        }
        var count = Object.keys(user_id_pic_map).length;
        for(var user_id in user_id_pic_map) {
            var pids = user_id_pic_map[user_id];
            var params = {
                url: this.config.photos,
                play_load: 'photo',
                data: {
                    user: user,
                    uid: user_id,
                    pids: pids.join(',')
                }
            };
            this._sendRequest(params, function(photos) {
                if(photos) {
                    for(var i = 0, len = photos.length; i < len; i++) {
                        var photo = photos[i];
                        var list = items_map[photo.pid];
                        for(var j = 0, jlen = list.length; j < jlen; j++) {
                            var status = list[j];
                            status.id = photo.pid;
                            status.bmiddle_pic = photo.url_large;
                            status.original_pic = photo.url_large;
                            if(photo.caption) {
                                status.text = photo.caption;
                            }
                            status.created_at = photo.update_time || photo.time;
                            // http://photo.renren.com/photo/385478335/photo-4746901797
                            status.t_url = 'http://photo.renren.com/photo/' + photo.uid + '/photo-' + photo.pid;
                        }
                    }
                }
                count--;
                if(count === 0) {
                    callback.call(context, items);
                }
            }, this);
        }
    },

    _fill_users: function(user, items, callback, context) {
        // 批量获取用户信息
        if(items && items.length > 0 && items[0].uid) {
            var items_map = {};
            for(var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var uid = item.uid;
                var list = items_map[uid] || [];
                list.push(item);
                items_map[uid] = list;
                if(item.retweeted_status) {
                    item = item.retweeted_status;
                    uid = item.uid;
                    list = items_map[uid] || [];
                    list.push(item);
                    items_map[uid] = list;
                }
            }
            var params = {
                url: this.config.users,
                play_load: 'user',
                data: {
                    user: user,
                    uids: Object.keys(items_map).join(','),
                    fields: 'uid,name,sex,star,zidou,vip,birthday,email_hash,tinyurl,headurl,mainurl,hometown_location,work_history,university_history'
                }
            };
            this._sendRequest(params, function(users) {
                if(users) {
                    for(var i = 0, len = users.length; i < len; i++) {
                        var user = users[i];
                        var list = items_map[user.id];
                        for(var j = 0, jlen = list.length; j < jlen; j++) {
                            list[j].user = user;
                        }
                    }
                }
                callback.call(context, items);
            }, this);
        } else {
            callback.call(context, items);
        }
    },

    _fill_datas: function(user, items, code_text, code, callback, context) {
        var both = this.combo(function(users_args, pics_args) {
            callback.call(context, items, code_text, code);
        });
        var users_callback = both.add(), pics_callback = both.add();
        this._fill_users(user, items, users_callback);
        this._fill_pics(user, items, pics_callback);
    },

    // user_timeline: function(data, callback, context) {
    //     var user = data.user;
    //     delete data.uid;
    //     this.super_.user_timeline.call(this, data, function(items, code_text, code) {
    //         this._fill_datas(user, items, code_text, code, callback, context);
    //     }, this);
    // },

    // friends_timeline: function(data, callback, context) {
    //     var user = data.user;
    //     this.super_.friends_timeline.call(this, data, function(items, code_text, code) {
    //         this._fill_datas(user, items, code_text, code, callback, context);
    //     }, this);
    // }
});


