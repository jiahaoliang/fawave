// @author qleelulu@gmail.com

var TWEETS = {};

function getUserCountsInfo(user) {
  if (user.statuses_count === undefined) {
    return '';
  }
  return _u.i18n("comm_follow") + '：' + user.friends_count + '\r\n' +
    _u.i18n("comm_fans") + '：' + user.followers_count + '\r\n' +
    _u.i18n("comm_tweet") + '：' + user.statuses_count + '';
}

// 生成Tipbox用户信息(鼠标移到用户头像时显示的用户信息)
function buildTipboxUserInfo(user, show_fullname) {
  var context = {
    provinces: fawave.provinces,
    user: user,
    show_fullname: show_fullname
  };
  return Shotenjin.render(TEMPLATE_TIPBOX_USER_INFO, context);
}

var _BUTTON_TPLS = {
  showMapBtn: '<a class="geobtn" href="" data-profile_image_url="{{user.profile_image_url}}" data-coordinates1="{{geo.coordinates[0]}}" data-coordinates2="{{geo.coordinates[1]}}" title="' + _u.i18n("btn_geo_title") + '"><img src="images/mapspin2a.png"/></a>',
  delTweetBtn: '<a class="deltweet" href="" data-id="{{id}}" title="' + _u.i18n("btn_del_tweet_title") + '">' + _u.i18n("abb_delete") + '</a>',
  replyBtn: '<a class="replytweet" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" title="' + _u.i18n("btn_mention_title") + '">@</a>',
  oretweetBtn: '<a class="oretweet ort" href="" data-screen_name="{{user.screen_name}}" data-retweeted_status_id="{{retweeted_status_id}}" data-id="{{id}}" title="' + _u.i18n("btn_rt_title") + '"></a>',
  retweetBtn: '<a class="rtweet" href="" data-rt="0" data-rtrt="0" title="' + _u.i18n("btn_old_rt_title") + '">RT</a>',
  repostBtn: '<a class="reposttweet" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" data-retweeted_status_screen_name="{{retweeted_status_screen_name}}" data-retweeted_status_id="{{retweeted_status_id}}" title="' + _u.i18n("btn_repost_title") + '">' + _u.i18n("abb_repost") + '</a>',
  repostCounts: '<span class="repostCounts">({{repost_count}})</span>',
  commentBtn: '<a class="commenttweet" href="" data-screen_name="{{user.screen_name}}" data-uid="{{user.id}}" data-id="{{id}}" title="' + _u.i18n("btn_comment_title") + '">' + _u.i18n("abb_comment") + '</a>',
  commentCounts: '<span class="commentCounts">({{comments_btn}})</span>',
  delCommentBtn: '<a class="delcommenttweet" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" title="' + _u.i18n("btn_del_comment_title") + '">' + _u.i18n("abb_delete") + '</a>',
  new_msgBtn: '<a class="doNewMessageBtn" href="" data-screen_name="{{user.screen_name}}" data-uid="{{user.id}}" title="' + _u.i18n("btn_direct_message_title") + '">' + _u.i18n("abb_send_direct_message") + '</a>',
  delDirectMsgBtn: '<a class="delDirectMsgBtn" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" title="' + _u.i18n("btn_del_direct_message_title") + '">' + _u.i18n("abb_delete") + '</a>',
  addFavoritesMsgBtn: '<a class="addFavoritesBtn" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" title="' + _u.i18n("btn_add_favorites_title") + '"><img width="11px" src="/images/favorites_2.gif"/></a>',
  delFavoritesMsgBtn: '<a class="delFavoritesBtn" href="" data-screen_name="{{user.screen_name}}" data-id="{{id}}" title="' + _u.i18n("btn_del_favorites_title") + '"><img width="11px" src="/images/favorites.gif"/></a>',
  likeBtn: '<a class="likeTweetBtn" href="{{t_url}}" data-screen_name="{{user.screen_name}}" \
    data-id="{{id}}" title="' + _u.i18n("btn_like_title") + '">' + _u.i18n("abb_like") + 
    '</a><span class="likeCounts">({{attitudes_count}})</span>',

  // rt
  rtShowMapBtn: '<a class="geobtn" href="" data-profile_image_url="{{retweeted_status.user.profile_image_url}}" data-coordinates1="{{retweeted_status.geo.coordinates[0]}}" data-coordinates2="{{retweeted_status.geo.coordinates[1]}}" title="' + 
    _u.i18n("btn_geo_title") + '"><img src="images/mapspin2a.png"/></a>',
  rtRepostBtn: '<a class="reposttweet" href="" data-screen_name="{{retweeted_status.user.screen_name}}" data-id="{{retweeted_status.id}}" title="' + 
    _u.i18n("btn_repost_title") + '">' + _u.i18n("abb_repost") + '</a>',
  rtRetweetBtn: '<a class="rtweet" href="" data-rt="1" data-rtrt="0" title="' + _u.i18n("btn_old_rt_title") + '">RT</a>',
  rtOretweetBtn: '<a class="oretweet ort" href="" data-screen_name="{{retweeted_status.user.screen_name}}" data-id="{{retweeted_status.id}}" title="' + 
    _u.i18n("btn_rt_title") + '"></a>',
  rtCommentBtn: '<a class="commenttweet" href="" data-screen_name="{{retweeted_status.user.screen_name}}" data-uid="{{retweeted_status.user.id}}" data-id="{{retweeted_status.id}}" title="' + 
    _u.i18n("btn_comment_title") + '">' + _u.i18n("abb_comment") + '</a>',
  rtCommentCounts: '<span class="commentCounts">({{rt_comments_count}})</span>',
  rtReplyBtn: '<a class="replytweet" href="" data-screen_name="{{retweeted_status.user.screen_name}}" data-id="{{retweeted_status.id}}" title="' + 
    _u.i18n("btn_mention_title") + '">@</a>',
  rtAddFavoritesMsgBtn: '<a class="addFavoritesBtn" href="" data-screen_name="{{retweeted_status.user.screen_name}}" data-id="{{retweeted_status.id}}" title="' + 
    _u.i18n("btn_add_favorites_title") + '"><img width="11px" src="/images/favorites_2.gif"/></a>',
  rtRepostCounts: '<span class="repostCounts">({{retweeted_status.repost_count}})</span>',

  rtLikeBtn: '<a class="likeTweetBtn" href="{{retweeted_status.t_url}}" data-screen_name="{{retweeted_status.user.screen_name}}" \
    data-id="{{retweeted_status.id}}" title="' + _u.i18n("btn_like_title") + '">' + _u.i18n("abb_like") + 
    '</a><span class="likeCounts">({{retweeted_status.attitudes_count}})</span>',
  
  // rt rt
  rtrtShowMapBtn: '<a class="geobtn" href="" data-profile_image_url="{{retweeted_status.retweeted_status.user.profile_image_url}}" data-coordinates1="{{retweeted_status.retweeted_status.geo.coordinates[0]}}" data-coordinates2="{{retweeted_status.retweeted_status.geo.coordinates[1]}}" title="' + 
    _u.i18n("btn_geo_title") + '"><img src="images/mapspin2a.png"/></a>',
  rtrtOretweetBtn: '',
  rtrtRetweetBtn: '<a class="rtweet" href="" data-rt="0" data-rtrt="1" title="' + _u.i18n("btn_old_rt_title") + '">RT</a>',
  rtrtRepostBtn: '<a class="reposttweet" href="" data-screen_name="{{retweeted_status.retweeted_status.user.screen_name}}" data-id="{{retweeted_status.retweeted_status.id}}" title="' + 
    _u.i18n("btn_repost_title") + '">' + _u.i18n("abb_repost") + '</a>',
  rtrtCommentBtn: '<a class="commenttweet" href="" data-screen_name="{{retweeted_status.retweeted_status.user.screen_name}}" data-uid="{{retweeted_status.retweeted_status.user.id}}" data-id="{{retweeted_status.retweeted_status.id}}" title="' + 
    _u.i18n("btn_comment_title") + '">' + _u.i18n("abb_comment") + '</a>',
  rtrtCommentCounts: '<span class="commentCounts">({{rtrt_comments_count}})</span>',
  rtrtReplyBtn: '<a class="replytweet" href="" data-screen_name="{{retweeted_status.retweeted_status.user.screen_name}}" data-id="{{retweeted_status.retweeted_status.id}}" title="' + 
    _u.i18n("btn_mention_title") + '">@</a>',
  rtrtAddFavoritesMsgBtn: '<a class="addFavoritesBtn" href="" data-screen_name="{{retweeted_status.retweeted_status.user.screen_name}}" data-id="{{retweeted_status.retweeted_status.id}}" title="' + 
    _u.i18n("btn_add_favorites_title") + '"><img width="11px" src="/images/favorites_2.gif"/></a>',
  rtrtRepostCounts: '<span class="repostCounts">({{retweeted_status.retweeted_status.repost_count}})</span>',

  rtrtLikeBtn: '<a class="likeTweetBtn" href="{{retweeted_status.retweeted_status.t_url}}" data-screen_name="{{retweeted_status.retweeted_status.user.screen_name}}" \
    data-id="{{retweeted_status.retweeted_status.id}}" title="' + _u.i18n("btn_like_title") + '">' + _u.i18n("abb_like") + 
    '</a><span class="likeCounts">({{retweeted_status.retweeted_status.attitudes_count}})</span>',
};

function buildStatusHtml(statuses, t, c_user) {
  var htmls = [];
  if (!statuses || statuses.length === 0) { 
    return htmls; 
  }
  if (!c_user) {
    c_user = getUser();
  }
  var TEMPLATE_RT_RT = null;
  var theme = Settings.get().theme;
  var rt_replace_pre = null;
  var rt_rt_replace_pre = null;
  if (theme === 'pip_io' || theme === 'work') {
    rt_replace_pre = '<!-- {{retweeted_status_out}} -->';
    rt_rt_replace_pre = '<!-- {{retweeted_retweeted_status_out}} -->';
  } else {
    rt_replace_pre = '<!-- {{retweeted_status_in}} -->';
    rt_rt_replace_pre = '<!-- {{retweeted_retweeted_status_in}} -->';
  }
    
  var config = tapi.get_config(c_user);
  var support_do_comment = config.support_do_comment;
  var support_do_favorite = config.support_do_favorite;
  var show_fullname = config.show_fullname;
  var need_set_readed = false; // 必须设置为已读
  if (t === 'user_timeline' || t === 'favorites') {
    need_set_readed = true;
  }
  var BUTTON_TPLS = $.extend({}, _BUTTON_TPLS);

  // 不支持收藏
  if (!support_do_favorite) {
    BUTTON_TPLS.addFavoritesMsgBtn = BUTTON_TPLS.delFavoritesMsgBtn = '';
  }
  // 不支持repost(转发)
  if (!config.support_repost) {
    BUTTON_TPLS.repostCounts = BUTTON_TPLS.rtRepostCounts = 
      BUTTON_TPLS.rtrtRepostCounts = BUTTON_TPLS.repostBtn = 
      BUTTON_TPLS.rtRepostBtn = BUTTON_TPLS.rtrtRepostBtn = '';
  }
  if (!config.support_counts) {
    BUTTON_TPLS.repostCounts = BUTTON_TPLS.rtRepostCounts = 
      BUTTON_TPLS.rtrtRepostCounts = '';
  }
  // 不支持删除私信
  if (!config.support_destroy_msg) {
    BUTTON_TPLS.delDirectMsgBtn = '';
  }
  // 不支持私信
  if (!config.support_direct_messages) {
    BUTTON_TPLS.delDirectMsgBtn = '';
    BUTTON_TPLS.new_msgBtn = '';
  }
  // 不支持评论
  if (!support_do_comment) {
    BUTTON_TPLS.commentBtn = BUTTON_TPLS.commentCounts = 
      BUTTON_TPLS.rtCommentCounts = BUTTON_TPLS.rtCommentBtn = '';
  }

  // 是否支持赞
  if (!config.support_like) {
    BUTTON_TPLS.likeBtn = BUTTON_TPLS.rtLikeBtn = BUTTON_TPLS.rtrtLikeBtn = '';
  }
    
  // 支持转发列表
  var tpl;
  if (config.support_repost && config.support_repost_timeline) {
    tpl = '<span class="repostCounts">(<a href="" class="showRepostTimelineBtn" title="' + 
      _u.i18n("comm_show_repost_timeline") + 
      '" timeline_type="repost" data-id="{{id}}">{{repost_count}}</a>)</span>';
    BUTTON_TPLS.repostCounts = tpl;
    BUTTON_TPLS.rtRepostCounts = tpl.replace(/\{\{repost_count\}\}/g, '{{retweeted_status.repost_count}}')
      .replace(/\{\{id\}\}/g, '{{retweeted_status.id}}');
    BUTTON_TPLS.rtrtRepostCounts = tpl.replace(/\{\{repost_count\}\}/g, 
      '{{retweeted_status.retweeted_status.repost_count}}')
      .replace(/\{\{id\}\}/g, '{{retweeted_status.retweeted_status.id}}');
  }
  var messageReplyToBtn = '';
  var support_instapaper = !!Settings.get().instapaper_user;
  var support_readitlater = !!Settings.get().readitlater_user;
  switch (t) {
  case 'friends_timeline':
  case 'favorites':
  case 'mentions':
  case 'user_timeline':
    BUTTON_TPLS.delDirectMsgBtn = BUTTON_TPLS.delCommentBtn = '';
    break;
  case 'comments_mentions':
  case 'comments_timeline':
    BUTTON_TPLS.likeBtn = 
    BUTTON_TPLS.repostBtn = BUTTON_TPLS.repostCounts = 
    BUTTON_TPLS.commentCounts = BUTTON_TPLS.delTweetBtn = 
    BUTTON_TPLS.delDirectMsgBtn = BUTTON_TPLS.addFavoritesMsgBtn = 
    BUTTON_TPLS.delFavoritesMsgBtn = '';
    BUTTON_TPLS.commentBtn = '<a class="commenttweet replycomment" href="" \
      data-screen_name="{{status.user.screen_name}}" data-uid="{{status.user.id}}" data-id="{{status.id}}" \
      data-replyname="{{user.screen_name}}" data-replyuid="{{user.id}}" data-replyid="{{id}}" \
      title="' + _u.i18n("btn_reply_comment_title") + '">' + _u.i18n("abb_reply") + '</a>';
    break;
  case 'comments_by_me':
    BUTTON_TPLS.delDirectMsgBtn = BUTTON_TPLS.addFavoritesMsgBtn = 
    BUTTON_TPLS.delFavoritesMsgBtn = '';
    break;
  case 'direct_messages':
    BUTTON_TPLS.likeBtn = 
    BUTTON_TPLS.repostBtn = BUTTON_TPLS.oretweetBtn = 
    BUTTON_TPLS.repostCounts = BUTTON_TPLS.commentBtn = 
    BUTTON_TPLS.commentCounts = BUTTON_TPLS.delCommentBtn = 
    BUTTON_TPLS.delTweetBtn = BUTTON_TPLS.addFavoritesMsgBtn = 
    BUTTON_TPLS.retweetBtn = BUTTON_TPLS.replyBtn = 
    BUTTON_TPLS.delFavoritesMsgBtn = '';
    BUTTON_TPLS.new_msgBtn = BUTTON_TPLS.new_msgBtn.replace('>' + 
      _u.i18n("abb_send_direct_message") + '<', '>' + _u.i18n("abb_reply") + '<');
    messageReplyToBtn = '回复给 <a class="newMessage" href="javascript:void(0);" ' + 
      ' onclick="doNewMessage(this,\'{{recipient.screen_name}}\',\'{{recipient.id}}\');" title="' + 
      _u.i18n("btn_direct_message_title") + '">{{recipient.screen_name}}</a>';
    support_instapaper = support_readitlater = false;
    break;
  default:
    break;
  }
  if (c_user.blogType !== 'twitter' && c_user.blogType !== 'identi_ca' && 
      c_user.blogType !== 'douban_v2' && c_user.blogType !== 'laiwang') {
    BUTTON_TPLS.rtOretweetBtn = BUTTON_TPLS.oretweetBtn = '';
  }
  switch (c_user.blogType) {
  case 'digu':
    if (t === 'mentions') {
      BUTTON_TPLS.replyBtn = BUTTON_TPLS.replyBtn.replace('>@<', '>' + _u.i18n("abb_reply") + '<');
    }
    break;
  case 'renjian':
  case 'fanfou':
    BUTTON_TPLS.repostCounts = BUTTON_TPLS.rtRepostCounts = 
    BUTTON_TPLS.rtrtRepostCounts = '';
    break;
  case 'douban':
    BUTTON_TPLS.replyBtn = BUTTON_TPLS.rtReplyBtn = BUTTON_TPLS.rtrtReplyBtn = '';
    break;
  case 'renren':
    BUTTON_TPLS.delCommentBtn = BUTTON_TPLS.delTweetBtn =
      BUTTON_TPLS.replyBtn = BUTTON_TPLS.rtReplyBtn = BUTTON_TPLS.rtrtReplyBtn = '';
    break;
  case 'facebook':
    BUTTON_TPLS.replyBtn = BUTTON_TPLS.rtReplyBtn = 
    BUTTON_TPLS.rtrtReplyBtn = BUTTON_TPLS.new_msgBtn = BUTTON_TPLS.commentCounts = '';
    break;
  default:
    break;
  }
  var comments_count_tpl = '<a href="" class="showCommentsBtn" timeline_type="comment" title="' +
    _u.i18n("btn_show_comments_title") + '" data-id="{{id}}">{{comments_count}}</a>';
  var support_follow = c_user.blogType !== 'douban' && c_user.blogType !== 'renren';
  var isFavorited = t === 'favorites';
  for (var i = 0, len = statuses.length; i < len; i++) {
    var status = statuses[i];
    TWEETS[String(status.id)] = status;
    status.repost_count = status.repost_count || status.reposts_count;
    status.repost_count = status.repost_count === undefined ? '-' : status.repost_count;
    status.user = status.user || status.sender;
    /*
       * status.retweeted_status 转发
       * status.status 评论
       */
    if  (c_user.blogType == 'twitter' && status.retweeted_status) { 
      replaceMedia(status.retweeted_status);
    }
    if (c_user.blogType == 'twitter') {
      replaceMedia(status);
      if (status.quoted_status !== undefined) {
        replaceMedia(status.quoted_status);
      }
    }
    var rt_status = status.retweeted_status = status.retweeted_status || status.status|| status.quoted_status;
    if (status.comments_count === undefined) {
      status.comments_count = '0';
    }
    var comments_btn = comments_count_tpl.format(status);
    status.comments_btn = comments_btn;
    status.rt_comments_count = status.rtrt_comments_count = '-';
    var rtrt_status = null;
    if (rt_status && rt_status.user) {
      if (rt_status.repost_count === undefined) {
        rt_status.repost_count = '0';
      }
      if (rt_status.comments_count === undefined) {
        rt_status.comments_count = '0';
      }
      status.retweeted_status_screen_name = rt_status.user.screen_name;
      status.retweeted_status_id = rt_status.id;
      TWEETS[String(rt_status.id)] = rt_status;
      status.rt_comments_count = comments_count_tpl.format(rt_status);
      rtrt_status = rt_status.retweeted_status = rt_status.retweeted_status || rt_status.status;
      if (rtrt_status) {
        rtrt_status.user = rtrt_status.user || {};
      }
      if (rtrt_status && rtrt_status.user.id) {
        TWEETS[String(rtrt_status.id)] = rtrt_status;
        if (rtrt_status.repost_count === undefined) {
          rtrt_status.repost_count = '0';
        }
        if (rtrt_status.comments_count === undefined) {
          rtrt_status.comments_count = '0';
        }
        status.rtrt_comments_count = comments_count_tpl.format(rtrt_status);
      }
    } else {
      status.retweeted_status_id = status.retweeted_status_screen_name = '';
    }
    var buttons = {};
    for (var key in BUTTON_TPLS) {
      tpl = BUTTON_TPLS[key];
      var map_status = status;
      if (key.substring(0, 4) === 'rtrt') {
        map_status = status.retweeted_status ? status.retweeted_status.retweeted_status: null;
        if (!map_status) {
          tpl = '';
        }
      } else if (key.substring(0, 2) === 'rt') {
        map_status = status.retweeted_status;
        if (!map_status) {
          tpl = '';
        }
      }
      if (tpl && key.endswith('MapBtn') &&
          (!map_status.geo || !map_status.geo.coordinates || map_status.geo.coordinates[0] === '0.0')) {
        tpl = '';
      }
      if (tpl) {
        tpl = tpl.format(status);
      }
      buttons[key] = tpl;
    }
    if (status.favorited || isFavorited) {
      buttons.addFavoritesMsgBtn = '';
    } else {
      buttons.delFavoritesMsgBtn = '';
    }
    if (String(c_user.id) === String(status.user.id)) {
      status.myTweet = true;
      buttons.new_msgBtn = '';
      buttons.rtOretweetBtn = buttons.oretweetBtn = '';
    } else {
      buttons.delTweetBtn = '';
    }
    // 不支持评论
    if (status.hide_comments === true) {
      buttons.commentBtn = buttons.commentCounts =
        buttons.rtCommentCounts = buttons.rtCommentBtn = '';
    }
    if (rt_status && rt_status.retweeted) {
      buttons.rtOretweetBtn = '<a class="oretweet ort orted" href="" title="' + 
        _u.i18n("btn_rted_title") + '"></a>';
    }
    if (status.retweeted) {
      buttons.oretweetBtn = '<a class="oretweet ort orted" href="" title="' + 
        _u.i18n("btn_rted_title") + '"></a>';
    }
    var status_type = status.status_type || t;
    if (need_set_readed) {
      status.readed = true;
    }
    var context = {
      provinces: fawave.provinces,
      tType: status_type,
      getUserCountsInfo: getUserCountsInfo,
      buildTipboxUserInfo: buildTipboxUserInfo,
      processMsg: tapi.processMsg,
      user: status.user,
      account: c_user,
      tweet: status,
      is_rt_rt: false,
      support_follow: support_follow,
      show_fullname: show_fullname,
      support_instapaper: support_instapaper,
      support_readitlater: support_readitlater,
      btn: buttons
    };
    if (c_user.blogType == "twitter" && status.retweeted_status && !status.quoted_status) {
      context.user = status.retweeted_status.user
      context.tweet = status.retweeted_status
      rt_status = null
    }
    if (messageReplyToBtn && status.recipient && 
      String(status.recipient.id) !== String(c_user.id)) {
      buttons.messageReplyToBtn = messageReplyToBtn.format(status);
    }
    try {
      var html = Shotenjin.render(TEMPLATE, context);
      if (rt_status) {
        html = html.replace(rt_replace_pre, Shotenjin.render(TEMPLATE_RT, context));
        if (rtrt_status) {
          if (!TEMPLATE_RT_RT) {
            TEMPLATE_RT_RT = TEMPLATE_RT.replace(/tweet\.retweeted_status/g, 'tweet.retweeted_status.retweeted_status')
              .replace(/btn\.rt/g, 'btn.rtrt');
          }
          context.is_rt_rt = true;
          context.retweeted_status_user = rt_status.user;
          html = html.replace(rt_rt_replace_pre, Shotenjin.render(TEMPLATE_RT_RT, context));
        }
      }
      htmls.push(html);
    } catch (err) {
      // throw err;
      log(err);
    }
    status.readed = true;
  }
  return htmls;

  function replaceMedia(current_status) {
    if (current_status.extended_entities !== undefined && current_status.extended_entities.media !== undefined) {
      media_pic_urls = [];
      media_urls = [];
      for (index in current_status.extended_entities.media) {
        media_pic_urls.push(current_status.extended_entities.media[index].media_url);
        media_urls.push(current_status.extended_entities.media[index].url);
      }
      current_status.thumbnail_pic = media_pic_urls;
      current_status.bmiddle_pic = media_pic_urls;
      current_status.original_pic = media_urls;
    }
  }
}

function buildUsersHtml(users, t, c_user) {
  var htmls = [];
  if (!users || users.length === 0) { 
    return htmls; 
  }
  if (!c_user) {
    c_user = getUser();
  }
  var config = tapi.get_config(c_user);
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var context = {
      provinces: fawave.provinces,
      tType: t,
      getUserCountsInfo: getUserCountsInfo,
      buildTipboxUserInfo: buildTipboxUserInfo,
      processMsg: tapi.processMsg,
      user: user,
      account: c_user,
      show_fullname: config.show_fullname,
      support_blocking: config.support_blocking,
      support_follow: !user.blocking && c_user.blogType !== 'douban' && c_user.blogType !== 'renren'
    };
    try {
      htmls.push(Shotenjin.render(TEMPLATE_FANS, context));
    } catch (err) {
      log(err);
    }
  }
  return htmls;
}

// 生成用户信息
function buildUserInfo(user) {
  var c_user = getUser();
  var config = tapi.get_config(c_user);
  var context = {
    provinces: fawave.provinces,
    getUserCountsInfo: getUserCountsInfo,
    user: user,
    show_fullname: config.show_fullname,
    support_blocking: config.support_blocking,
    support_follow: !user.blocking && c_user.blogType !== 'douban' && c_user.blogType !== 'renren'
  };
  return Shotenjin.render(TEMPLATE_USER_INFO, context);
}

//生成粉丝信息
function buildFansLi(user, t) {
  var context = {
    t: t,
    provinces: fawave.provinces,
    getUserCountsInfo: getUserCountsInfo,
    user: user
  };
  return Shotenjin.render(TEMPLATE_FANS, context);
}

/**
 * 生成评论列表 / 转发列表
 * timeline_type: repost, comment
 */
function buildComment(comment, status_id, status_user_screen_name, status_user_id, timeline_type) {
  var c_user = getUser();
  var config = tapi.get_config(c_user);
  var comment_id = comment.id;
  TWEETS[String(comment_id)] = comment;
  var comment_user_screen_name = comment.user.screen_name;
  var comment_user_id = comment.user.id;
  var datetime = new Date(comment.created_at).format("yyyy-MM-dd hh:mm:ss");
  var comment_btn = '';
  if (timeline_type === 'comment') {
    if (comment.status && comment.status.id) {
      status_id = comment.status.id;
      if (comment.status.user) {
        status_user_screen_name = comment.status.user.screen_name;
        status_user_id = comment.status.user.id;
      }
    }
    comment_btn = ('<a class="replyComment commenttweet" href="" \
      data-screen_name="{{status_user_screen_name}}" data-uid="{{status_user_id}}" data-id="{{status_id}}" \
      data-replyname="{{comment_user_screen_name}}" data-replyuid="{{comment_user_id}}" data-replyid="{{comment_id}}" \
      title="' + _u.i18n("btn_reply_comment_title") + '">' +
      _u.i18n("abb_reply") + '</a>').format({
        status_id: status_id,
        status_user_screen_name: status_user_screen_name,
        status_user_id: status_user_id,
        comment_id: comment_id,
        comment_user_screen_name: comment_user_screen_name,
        comment_user_id: comment_user_id
      });
  } else { // repost
    var status = comment;
    status_id = status.id;
    TWEETS[String(status_id)] = status;
    status_user_id = status.user.id;
    status_user_screen_name = status.user.screen_name;
    // 直接回复给转发者的微博
    comment_id = ''; 
    comment_user_id = '';
    comment_user_screen_name = '';
    var retweeted_status_screen_name = '';
    var retweeted_status_id = '';
    if (status.retweeted_status && status.retweeted_status.user) {
      retweeted_status_screen_name = status.retweeted_status.user.screen_name;
      retweeted_status_id = status.retweeted_status.id;
    }
    status.retweeted_status_screen_name = retweeted_status_screen_name;
    status.retweeted_status_id = retweeted_status_id;
    var repost_btn = ('<a class="replyComment reposttweet" href="javascript:void(0);" \
      onclick="javascript:doRepost(this,\'{{user.screen_name}}\',\'{{id}}\',\'{{retweeted_status_screen_name}}\',\'{{retweeted_status_id}}\');" \
      title="' + _u.i18n("btn_repost_title") + '">' +
      _u.i18n("abb_repost") + '</a>').format(status);
    comment_btn = ('<a class="replyComment commenttweet" href="" \
      data-screen_name="{{user.screen_name}}" data-uid="{{user.id}}" data-id="{{id}}" \
      title="' + _u.i18n("btn_comment_title") + '">&nbsp;&nbsp;' +
      _u.i18n("abb_comment") + '</a>').format(status);
    comment_btn += repost_btn;
    datetime = '<a href="' + status.t_url + '">' + datetime + '</a> ' + _u.i18n('comm_post_by') +
      ' ' + status.source + ' ' + _u.i18n('comm_repost');
  }
  if (comment.user.verified) {
    comment.user.verified = '<img title="' + _u.i18n("comm_verified") +
      '" src="/images/verified' +
      (comment.user.verified_type && comment.user.verified_type > 0 ? '_blue.png' : '.gif') +
      '" />';
  } else {
    comment.user.verified = '';
  }
  if (config.show_fullname && comment.user.name) {
    comment.user.othername = '(' + comment.user.name + ')';
  } else {
    comment.user.othername = '';
  }
  var reply_user = ('<a class="getUserTimelineBtn" data-screen_name="{{screen_name}}" data-id="{{id}}" rhref="{{t_url}}" title="' +
    _u.i18n("btn_show_user_title") + '">@{{screen_name}}{{othername}}{{verified}}</a>').format(comment.user);
  return '<li><span class="commentContent">' +
    reply_user + ': ' + tapi.processMsg(c_user, comment) +
    '</span><span class="msgInfo">(' + datetime + ')</span>' +
    comment_btn + '</li>';
}
