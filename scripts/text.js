/*!
 * fawave - scripts/text.js
 *
 * 发送微博头部区域逻辑，包含初始化输入框，用户账号选择等
 * 
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 */


function toggleSelectSendAccount(ele) {
  var _t = $(ele);
  var is_tsina = (_t.attr('blogType') || 'tsina') === 'tsina';
  if (_t.hasClass('sel')) {
    _t.removeClass('sel');
  } else {
    var settings = Settings.get();
    if (false && settings.__allow_select_all !== true) {
      if (is_tsina) {
        _t.siblings().each(function () {
          var $this = $(this);
          if ($this.attr('blogType') !== 'tsina') {
            $this.removeClass('sel');
          }
        });
      } else {
        _t.siblings().each(function () {
          var $this = $(this);
          if ($this.attr('blogType') === 'tsina') {
            $this.removeClass('sel');
          }
        });
      }
    }
    _t.addClass('sel');
  }
}

function toggleSelectAllSendAccount() {
  var $selected = $("#accountsForSend .sel");
  if ($selected.length === 0) {
    $selected = $("#accountsForSend li[uniqueKey=" + getUser().uniqueKey + "]");
  }
  var $sinas = $('#accountsForSend li[blogType="tsina"]');
  var $others = $('#accountsForSend li[blogType!="tsina"]');
  var is_tsina = $selected.attr('blogType') === 'tsina';
  if (is_tsina) {
    if ($selected.length < $sinas.length) {
      return $sinas.addClass('sel') && $others.removeClass('sel');
    }
    if ($others.length > 0) {
      return $sinas.removeClass('sel') && $others.addClass('sel');
    }
  }
  if ($selected.length < $others.length) {
    return $sinas.removeClass('sel') && $others.addClass('sel');
  }
  $("#accountsForSend li").removeClass('sel');
  var c_user = getUser();
  $("#accountsForSend li[uniqueKey=" + c_user.uniqueKey + "]").addClass('sel');
}

function shineSelectedSendAccounts(sels) {
  if (!sels) {
    sels = $("#accountsForSend li.sel");
  }
  sels.css('-webkit-transition', 'none').removeClass('sel');
  function _highlightSels() {
    sels.css('-webkit-transition', 'all 0.8s ease').addClass('sel');
  }
  setTimeout(_highlightSels, 150);
}

// 初始化用户选择视图
function initSelectSendAccounts() {
  var settings = Settings.get();
  var afs = $("#accountsForSend");
  var c_user = getUser();
  if (afs.data('inited')) {
    if (settings.sendAccountsDefaultSelected === 'current' && afs.find('li.sel').length < 2) {
      afs.find('li').removeClass('sel');
      $("#accountsForSend li[uniqueKey='" + c_user.uniqueKey + "']").addClass('sel');
    }
    shineSelectedSendAccounts(afs.find('li.sel'));
    return;
  }
  var userList = getUserList('send');
  if (userList.length < 2) { 
    return; 
  } //多个用户才显示
  var li_tpl = '<li class="{{sel}} toggleSelectSendAccountBtn" uniqueKey="{{uniqueKey}}" blogType="{{blogType}}"> \
    <img src="{{profile_image_url}}" /> \
    {{screen_name}} \
    <img src="/images/blogs/{{blogType}}_16.png" class="blogType" /></li>';
  var li = [];
  var has_sina = false, has_other = false;
  for (var i = 0, len = userList.length; i < len; i++) {
    var user = userList[i];
    user.sel = '';
    var is_sina = user.blogType === 'tsina';
    if (!has_sina && is_sina) {
      has_sina = true;
    }
    if (!has_other && !is_sina) {
      has_other = true;
    }
    switch (settings.sendAccountsDefaultSelected) {
    case 'all':
      user.sel = 'sel';
      break;
    case 'current':
      if (user.uniqueKey === c_user.uniqueKey) {
        user.sel = 'sel';
      }
      break;
    case 'remember':
      var lastSend = getLastSendAccounts();
      if (lastSend && lastSend.indexOf('_' + user.uniqueKey + '_') >= 0) {
        user.sel = 'sel';
      }
      break;
    default:
      break;
    }
    li.push(li_tpl.format(user));
  }
  if (has_sina && has_other) {
    // 只有同时有新浪微博和其他类型，才显示保留数据的选项
    var $keep_data_btn = $('<span id="remember_send_data_ctr"><input type="checkbox" \
      id="remember_send_data" /><label for="remember_send_data">' + _u.i18n("abb_keep_send_data") + '</label></span>');
    var $sendBtn = $('#btnSend');
    $sendBtn.before($keep_data_btn.css({right: ($sendBtn.width() + 30) + 'px'}));
  }
  afs.html('TO(<a class="all toggleSelectAllSendAccountBtn" href="">' + _u.i18n("abb_all") + '</a>): ' + li.join(''));
  afs.data('inited', 'true');
  shineSelectedSendAccounts();

  // 注册按钮事件
  $(document).delegate('.toggleSelectSendAccountBtn', 'click', function () {
    toggleSelectSendAccount(this);
    return false;
  })
  .delegate('.toggleSelectAllSendAccountBtn', 'click', function () {
    toggleSelectAllSendAccount();
    return false;
  });
}

function _get_clipboard_file(e, callback) {
  var f = null, items = e.clipboardData && e.clipboardData.items;
  items = items || [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].kind === 'file') {
      f = items[i].getAsFile();
      break;
    }
  }
  if (f) {
    var reader = new FileReader();
    reader.onload = function (event) {
      callback(f, event.target.result);
    };
    reader.readAsDataURL(f);
  } else {
    callback();
  }
}

function _get_image_url(stat, callback, onprogress, context) {
  // 都没有url，则只能发普通微博了
  var image_url = null;
  for (var i = 0, len = stat.image_urls.length; i < len; i++) {
    // 优先获取sinaimg
    if (stat.image_urls[i].indexOf('sinaimg') > 0) {
      image_url = stat.image_urls[i];
      break;
    }
  }
  if (!image_url) {
    image_url = stat.image_urls[0];
  }
  if (!image_url && stat.pic) {
    if (!onprogress) {
      var $loading_bar = $('#upImgPreview .loading_bar');
      if ($loading_bar.length > 0) {
        onprogress = function (rpe) {
          // progress
          var html = display_size(rpe.loaded) + "/" + display_size(rpe.total);
          var width = parseInt((rpe.loaded / rpe.total) * $loading_bar.width(), 10);
          $loading_bar.find('div').css({'border-left-width': width + 'px'}).find('span').html(html);
        };
      }
    }
    Nodebox.upload({}, stat.pic, function (error, info) {
      if (info && (info.link || info.url)) {
        image_url = info.link || info.url;
      }
      callback.call(context, image_url);
    }, onprogress, context);
  } else {
    callback.call(context, image_url);
  }
}

function _init_image_preview(image_src, size, preview_id, btn_id, top_padding, left_padding) {
  $("#" + preview_id + " .img").html('<img class="pic" src="' + image_src + '" />');
  left_padding = left_padding || -30;
  top_padding = top_padding || 20;
  var offset = $('#' + btn_id).offset();
  $("#" + preview_id).data('uploading', false).css({
    left: offset.left + left_padding, 
    top: offset.top + top_padding
  }).show()
  .find('.loading_bar div').css({'border-left-width': '0px'})
  .find('span').html(display_size(size));
}

// return text, left_length, max_length
function _countText(text_id) {
  var $text = $("#" + text_id);
  var value = $text.val();
  var max_length = +($text.data('max_text_length') || 140);
  var len = max_length - ($text.data('support_double_char') ? value.len() : value.length);
  return [value, len, max_length];
}

//统计字数
function countInputText() {
  var values = _countText('txtContent', 'wordCount');
  if (values[1] === values[2]) {
    $("#btnSend").attr('disabled', 'disabled');
  } else {
    $("#btnSend").removeAttr('disabled');
  }
  var text = values[0], wlength = text.len(); //, length = text.length;
  $('#wordCount_double').html(140 - wlength);
  $('#wordCount').html(values[1]);
}

function countReplyText() {
  var values = _countText('replyTextarea'), len = values[1], html = null;
  if (window.imgForUpload_reply) {
    // 有图片，则自动增加20字符
    len -= 20;
  }
  if (len > 0) {
    html = _u.i18n("msg_word_count").format({len: len});
  } else {
    html = '(<em style="color:red;">' + _u.i18n("msg_word_overstep").format({len: len}) + '</em>)';
  }
  $('#replyInputCount').html(html);
}

function cleanTxtContent() {
  $("#txtContent").val('').focus();
  countInputText();
}

/**
 * 初始化发微博输入文本框事件
 */
function initTxtContentEven() {
  var unsendTweet = localStorage.getObject(UNSEND_TWEET_KEY);
  var $txtContent = $("#txtContent");
  if (unsendTweet) {
    $txtContent.val(unsendTweet);
  }

  $txtContent[0].oninput = $txtContent[0].onfocus = countInputText;
  
  //黏贴图片
  $txtContent[0].onpaste = function (e) {
    _get_clipboard_file(e, function (file, image_src) {
      if (file) {
        window.imgForUpload = file;
        window.imgForUpload.fileName = 'fawave.png';
        _init_image_preview(image_src, file.size, 'upImgPreview', 'btnUploadPic');
      }
    });
  };

  var sendContent = function () {
    var c = $.trim($("#txtContent").val());
    if (c) {
      sendMsg(c);
    } else {
      showMsg(_u.i18n("msg_need_content"));
    }
  };

  $txtContent.keydown(function (event) {
    if (((event.ctrlKey || event.metaKey) && event.keyCode === 13) || (event.altKey && event.which === 83)) {
      sendContent();
      return false;
    }
  });

  $("#btnSend").click(sendContent);
}

function saveTextContents() {
  var c = $("#txtContent").val();
  var $reply_text = $("#replyTextarea");
  if (!c || !$reply_text.is(':hidden')) {
    // 没有输入或者是对话框模式，则隐藏文本输入
    ActionCache.set('showMsgInput', null);
  }
  localStorage.setObject(UNSEND_TWEET_KEY, c || '');
  localStorage.setObject(UNSEND_REPLY_KEY, $("#replyTextarea").val() || '');
  if (Settings.get().sendAccountsDefaultSelected === 'remember') {
    if ($("#accountsForSend").data('inited')) {
      var keys = '';
      $("#accountsForSend li.sel").each(function () {
        keys += $(this).attr('uniquekey') + '_';
      });
      keys = keys ? '_' + keys : keys;
      localStorage.setObject(LAST_SELECTED_SEND_ACCOUNTS, keys);
    }
  }
}