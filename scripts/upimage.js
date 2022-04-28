/*!
 * fawave - scripts/upimage.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>, qleelulu <qleelulu@gmail.com>
 * MIT Licensed
 */

function initUpImageEvents() {
  // initEvents();
  
  $(document).delegate('.windowCloseBtn', 'click', function () {
    window.close();
    return false;
  })
  .delegate('#imageFile', 'change', function () {
    selectFile(this);
  })
  .delegate('#imageUrl', 'change', function () {
    selectUrl(this);
  })
  ;
}

function init() {
  // 图片滤镜
  window.imageFilterBuilder = new ImageFilterBuilder();
  imageFilterBuilder.filterResult = function (dataurl) {
    $("#imgPreview img")[0].src = dataurl;
  };

  // 判断是否截图
  var params = decodeForm(window.location.search);
  initSelectSendAccounts();
  initTxtContentEven();
  var $txtContent = $("#txtContent");
  $txtContent.focus();
  at_user_autocomplete('#txtContent');

  // 文件拖动
  $("#imageFile")[0].addEventListener('dragenter', function () {
    $("#uploadForm .dragFile").addClass('drag_on');
  }, false);
  $("#imageFile")[0].addEventListener('dragleave', function () {
    $("#uploadForm .dragFile").removeClass('drag_on');
  }, false);
  $("#imageFile")[0].addEventListener('drop', function () {
    $("#uploadForm .dragFile").removeClass('drag_on');
  }, false);
  document.body.addEventListener('dragover', function (e) {
    if ((e.srcElement && e.srcElement.id !== 'imageFile')) {
      e.preventDefault();
    }
  }, false);
  // 设置自动关闭选项的上次状态
  var checked = Settings.get().sent_success_auto_close;
  $('#cb_success_close').change(function () {
    var settings = Settings.get();
    settings.sent_success_auto_close = $(this).attr('checked') ? true : false;
    Settings.save();
  }).attr('checked', checked);
  
  $txtContent[0].onpaste = null;
  window.document.onpaste = function (e) {
    var f = null;
    var items = e.clipboardData && e.clipboardData.items;
    items = items || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        f = items[i].getAsFile();
        break;
      }
    }
    if (f) {
      selectFile({files: [f]});
    }
  };
    
  if (params.tabId) {
    //$('#uploadForm').hide();
    chrome.tabs.get(parseInt(params.tabId, 10), function (tab) {
      // 设置标题和缩短网址
      var title = tab.title || '';
      var loc_url = tab.url;
      var settings = Settings.get();
      $("#txtContent").val(formatText(settings.lookingTemplate, {title: title, url: loc_url})).focus();
      countInputText();
      _shortenUrl(loc_url, settings, function (shorturl) { 
        if (shorturl) {
          var $txt = $("#txtContent");
          $txt.val($txt.val().replace(loc_url, shorturl)).focus();
        }
      });
      // 截图
      chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, function (dataurl) {
        $("#imgPreview").html('<img class="pic" src="' + dataurl + '" />');
      });
    });
  } else if (params.image_url) {
    // 有图片
    var settings = Settings.get();
    countInputText();
    var source_url = params.image_url;
    $("#imgPreview").html('<img class="pic" src="' + source_url + '" />');
    if (params.image_source_link) {
      // 图片是通过缩短url还原得到的
      $("#imgPreview img").attr('sourcelink', params.image_source_link);
    }
    if (params.image_need_source_link) {
      // 上传的时候，是否需要原始链接
      $("#imgPreview img").attr('need_source_link', params.image_need_source_link);
    }
    $('#imageUrl').val(source_url);
    if (source_url.indexOf('126.fm') >= 0) {
      // 163的图片需要先还原
      ShortenUrl.expand(source_url, function (data) {
        var longurl = data.url || data;
        if (longurl) {
          $('#imageUrl').val(longurl.replace('#3', ''));
          $("#imgPreview img").attr('sourcelink', source_url);
        }
      });
    } else {
      _shortenUrl(source_url, settings, function (shorturl) {
        if (shorturl) {
          $('#imgPreview img').attr('short_url', shorturl);
        }
      });
    }
  }
}

function _start_updates(stat) {
  if (stat.uploadCount === 0 && stat.unsupport_uploads && stat.unsupport_uploads.length > 0) {
    var unsupport_uploads = stat.unsupport_uploads;
    delete stat.unsupport_uploads;
    _get_image_url(stat, function (image_url) {
      if (image_url) {
        stat.select_image_url = image_url;
      }
      for (var i = 0, len = unsupport_uploads.length; i < len; i++) {
        if (image_url) {
          unsupport_uploads[i][0] += ' ' + image_url;
        }
        _updateWrap.apply(null, unsupport_uploads[i]);
      }
    }, function (ev) {
      for (var i = 0, len = unsupport_uploads.length; i < len; i++) {
        var args = unsupport_uploads[i];
        onprogress(ev, args[1], args[2]);
      }
    });
  }
}

function _finish_callback(user, stat, selLi, result, textStatus, error_code) {
  stat.sendedCount++;
  stat.uploadCount--;
  if (result === true || (result && (result.id || (result.data && result.data.id))) || textStatus === 'success') {
    stat.successCount++;
    $("#accountsForSend li[uniquekey='" + user.uniqueKey + "']").removeClass('sel');
    $("#u_uploadinfo_" + user.uniqueKey).find('.progressInfo').append(' (<span>' + _u.i18n("comm_success") + '</span>)');
    if (result) {
      var image_url = result.original_pic;
      if (!image_url && result.data) {
        image_url = result.data.original_pic;
      }
      if (image_url) {
        stat.image_urls.push(image_url);
      }
    }
  } else {
    var message = ' (<span style="color:red">' + _u.i18n("comm_fail");
    if (result && result.error) {
      message += ': ' + result.error;
    }
    message += '</span>)';
    $("#u_uploadinfo_" + user.uniqueKey).addClass('error').find('.progressInfo').append(message);
  }
  _start_updates(stat);
  if (stat.successCount >= stat.userCount) {
    // 全部发送成功
    _showMsg(_u.i18n("msg_send_success"));
    var $remember_send_data = $('#remember_send_data');
    if (!$remember_send_data.prop('checked')) {
      selLi.addClass('sel');
      var ifw = $("#imageFileWrap");
      ifw.html(ifw.html());
      $("#txtContent").val('');
      localStorage.setObject(UNSEND_TWEET_KEY, '');
      $("#btnSend").attr('disabled', true);
      $("#imgPreview").html('');
      $("#imageUrl").val('');
      $("#progressBar span").html("");
      $('#longtext').val('');
      if ($('#cb_success_close').attr('checked')) {
        // 1.5秒后关闭
        setTimeout(function () {
          window.close();
        }, 1500);
      }
    } else {
      // 不选中
      $remember_send_data.prop('checked', false);
    }
  }
  if (stat.sendedCount >= stat.userCount) { 
    // 全部发送完成
    selLi = null;
    $("#progressBar")[0].style.width = "0%";
    enabledUpload();
    if (stat.successCount > 0) { // 有发送成功的
      // setTimeout(callCheckNewMsg, 1000);
      var failCount = stat.userCount - stat.successCount;
      if (stat.userCount > 1 && failCount > 0) { // 多个用户的
        _showMsg(_u.i18n("msg_send_complete").format({successCount: stat.successCount, errorCount: failCount}));
      }
      if (failCount > 0 && stat.select_image_url) {
        // 有未成功的，则将图片保留下来，以便下次发送
        var $txtContent = $("#txtContent");
        $txtContent.val($txtContent.val() + ' ' + stat.select_image_url);
      }
    }
  }
}

var TP_USER_UPLOAD_INFO = '<li id="u_uploadinfo_{{uniqueKey}}">\
  <img src="{{profile_image_url}}">{{screen_name}}<img src="/images/blogs/{{blogType}}_16.png" class="blogType">: \
  <span class="barWrap"><strong class="bar" style="width: 10%;"><span></span></strong></span>\
  <span class="progressInfo"></span></li>';

function sendMsg() { 
  // 覆盖popup.js的同名方法
  var c_user = getUser();
  if (!c_user) {
    _showMsg(_u.i18n("msg_need_add_account"));
    return;
  }
  var msg = $.trim($("#txtContent").val());
  if (!msg) {
    _showMsg(_u.i18n("msg_need_content"));
    return;
  }
  var file = $("#imageFile").length > 0 ? $("#imageFile")[0].files[0] : null;
  // 如果使用了滤镜功能，全部都通过预览图获取图片数据
  if (imageFilterBuilder.filtered && imageFilterBuilder.filteredName && imageFilterBuilder.filteredName !== 'none') {
    file = null;
  }
  var image_url = null; // 是否通过图片url发送
  if (!file) {
    image_url = $('#imageUrl').val();
    // 如果使用了滤镜功能，全部都通过预览图获取图片数据
    if (imageFilterBuilder.filtered && imageFilterBuilder.filteredName && imageFilterBuilder.filteredName !== 'none') {
      image_url = null;
    }
    if (image_url) {
      file = getImageBlob(image_url);
    } else {
      var dataUrl = $('#imgPreview img').attr('src');
      if (dataUrl) {
        file = dataUrlToBlob(dataUrl);
      } else {
        // 判断是否长微博
        var longtext = $('#longtext').val();
        if (longtext) {
          file = dataUrlToBlob(LongTextPage.get_data_url());
        }
      }
    }
  }
  
  // 检测是否含有文件，如果没有图片又没有上传过文件，则提示
  if (!file && $('#imageFileWrap').attr('uploaded') !== '1') {
    _showMsg(_u.i18n("msg_need_file_or_pic"));
    return;
  }

  var users = [];
  var selLi = $("#accountsForSend .sel");
  if (selLi.length) {
    selLi.each(function () {
      var uniqueKey = $(this).attr('uniqueKey');
      var _user = getUserByUniqueKey(uniqueKey, 'send');
      if (_user) {
        users.push(_user);
      }
    });
  } else if (!$("#accountsForSend li").length) {
    users.push(c_user);
  } else {
    _showMsg(_u.i18n("msg_need_select_account"));
    return;
  }

  var upInfo = $("#uploadinfo").html('');
  var stat = {uploaded: {}, image_urls: []};
  stat.userCount = users.length;
  stat.sendedCount = 0;
  stat.successCount = 0;
  stat.uploadCount = 0;
  if (file) {
    stat.pic = file;
  }
//    var matchs = tapi.findSearchText(c_user, msg);
  stat.unsupport_uploads = []; // 不支持发送图片的，则等待支持发送图片的获取到图片后，再发送
  // 增加图片链接
  image_url = $('#imgPreview img').attr('short_url') || $('#imageUrl').val(); // $('#imgPreview img').attr('src');
  // 判断图片是否从url得到的
  var source_link = $("#imgPreview img").attr('sourcelink');
  var need_source_link = $("#imgPreview img").attr('need_source_link') === '1';
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    var config = tapi.get_config(user);
    // 判断文件是否过大
    if (file && file.size > config.max_image_size) {
      // rpe.loaded / rpe.total
      upInfo.append(TP_USER_UPLOAD_INFO.format(user));
      onprogress({loaded: 0, total: file.size}, user, stat);
      var max_size = parseInt(config.max_image_size / 1024 / 1024, 10);
      _finish_callback(user, stat, selLi, 
        {error: _u.i18n("msg_pic_too_large").format({max_size: max_size})}, 'error', 500);
      continue;
    }
    var status = msg;
    var pic = {file: file};
    upInfo.append(TP_USER_UPLOAD_INFO.format(user));
    if ((config.support_upload && !user.apiProxy) && pic.file) {
      stat.uploadCount++;
      if (source_link) {
        // 清空原来的图片连接
        if (!need_source_link) {
          status = status.replace(source_link, '');
          if (!status) {
            status = source_link;
          }
        }
      }
      _uploadWrap(status, user, pic, stat, selLi);
    } else { // only support update
      if (image_url) {
        if (source_link) {
          if (status.indexOf(source_link) < 0) {
            // 没有link，则添加
            status += ' ' + source_link;
          }
        } else {
          // 内容已经包含url了，就无需再传了
          status += ' ' + image_url;
        }
        _updateWrap(status, user, stat, selLi);
      } else {
        // 没有图片连接，则等待其他上传完得到图片后再发送
        onprogress({loaded: 0, total: 100}, user, stat);
        stat.unsupport_uploads.push([status, user, stat, selLi]);
      }
    }
  }
  _start_updates(stat);
}

function _updateWrap(status, user, stat, selLi) {
  onprogress({loaded: 50, total: 100}, user, stat);
  tapi.update({user: user, status: status}, function (result_data, status_code, error_code) {
    onprogress({loaded: 100, total: 100}, user, stat);
    _finish_callback(user, stat, selLi, result_data, status_code, error_code);
  });
}

function _uploadWrap(status, user, pic, stat, selLi) {
  tapi.upload(user, {status: status}, pic, 
    function () {
      disabledUpload();
    }, 
    function (ev) {
      onprogress(ev, user, stat);
    }, 
    function (data, textStatus, error_code) {
      _finish_callback(user, stat, selLi, data, textStatus, error_code);
    }
  );
}

var FILECHECK = {
  maxFileSize: 100 * 1024 * 1024,
  maxImageSize: 5 * 1024 * 1024,
  fileTypes: '__image/gif__image/jpeg__image/jpg__image/png__'
};

function checkImage(file) {
  var check = true;
  if (file) {
    if (file.size > FILECHECK.maxImageSize) {
      var max_size = parseInt(FILECHECK.maxImageSize / 1024 / 1024, 10);
      _showMsg(_u.i18n("msg_pic_too_large").format({max_size: max_size}));
      check = false;
    }
    if (file.type && FILECHECK.fileTypes.indexOf('__' + file.type + '__') < 0) {
      _showMsg(_u.i18n("msg_pic_type_error"));
      check = false;
    }
  } else {
    check = false;
  }
  return check;
}

function handleFile(file, handle_image) {
  if (file) {
    if (file.size > FILECHECK.maxFileSize) {
      var max_size = parseInt(FILECHECK.maxFileSize / 1024 / 1024, 10);
      _showMsg(_u.i18n("msg_file_too_large").format({max_size: max_size}));
      return true;
    }
    if (!handle_image && file.type && FILECHECK.fileTypes.indexOf('__' + file.type + '__') >= 0) {
      return false;
    }
    var settings = Settings.get();
    disabledUpload();
    var filename = file.fileName || file.name;
    Nodebox.upload({}, file, function (err, result) {
      enabledUpload();
      resetFileUpload();
      $("#progressBar")[0].style.width = "0%";
      $("#progressBar span").html("");
      if (err) {
        return _showMsg(err.message);
      }
      var url = result.url;
      var $txt = $('#txtContent');
      var text = $txt.val() || '';
      if (text) {
        text += ' ';
      }
      $txt.val(text + filename + ' ' + url).focus();
      $('#imageFileWrap').attr('uploaded', '1');
      _shortenUrl(url, settings, function (shorturl) {
        if (shorturl) {
          $txt.val($txt.val().replace(url, shorturl));
        }
      });
    }, function onprogress(rpe) {
      var precent = parseInt((rpe.loaded / rpe.total) * 100, 10);
      $("#progressBar")[0].style.width = precent + "%";
      $("#progressBar span").html(precent + "%");
    });
    return true;
  }
  return false;
}

function onprogress(rpe, user, stat) {
  if (!user) {
    return;
  }
  stat.uploaded[user.uniqueKey] = rpe.loaded;
  //$("#progressBar")[0].style.width = ((rpe.loaded * 200 / rpe.total) >> 0) + "px";
  var precent = parseInt(rpe.loaded / rpe.total * 100, 10);
  $("#u_uploadinfo_" + user.uniqueKey).find(".bar").css('width', precent + "%")
    .end().find(".progressInfo").html(display_size(rpe.loaded) + " / " + display_size(rpe.total));
  var allLoaded = 0;
  for (var key in stat.uploaded) {
    allLoaded += stat.uploaded[key];
  }
  var allPrecent = parseInt((allLoaded / (rpe.total * stat.userCount)) * 100, 10);
  $("#progressBar")[0].style.width = allPrecent + "%";
  $("#progressBar span").html(allPrecent + "%");
}

function selectFile(fileEle, file_only) {
  $("#uploadForm .dragFile").removeClass('drag_on');
  var file = fileEle.files[0];
  $("#progressBar")[0].style.width = "0%";
  $("#progressBar span").html("");
  if (file) {
    if (handleFile(file, file_only)) {
      // 已经被处理
      return;
    }
    $("#imgPreview").html('');
    $('#imageUrl').val('');
    var check = checkImage(file);
    if (check) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imgPreview").html('<span>file size: ' + display_size(file.size) + '</span><br/><img class="pic" src="' + e.target.result + '" />');
        showImageFilters();
      };
      reader.readAsDataURL(file);
    }
  } else {
    $("#imgPreview").html('');
    $('#imageUrl').val('');
  }
}

function selectUrl(ele) {
  var url = $(ele).val();
  $("#imgPreview").html('');
  resetFileUpload();
  $('#imageUrl').val(url);
  $("#progressBar")[0].style.width = "0%";
  $("#progressBar span").html("");
  if (url) {
    $("#imgPreview").html('<img class="pic" src="' + url + '" />');
    showImageFilters();
  }
}

function showImageFilters() {
  imageFilterBuilder.listFilters($("#imgPreview img")[0], $("#imgFilterList")[0], $("#imgFilterRange")[0]);
}

function disabledUpload() {
  $("#btnSend").attr('disabled', true);
  $("#imageFile").attr('disabled', true);
  $("#imageUrl").attr('disabled', true);
}

function enabledUpload() {
  $("#btnSend").removeAttr('disabled');
  $("#imageFile").removeAttr('disabled');
  $("#imageUrl").removeAttr('disabled');
}

function resetFileUpload() {
  var $parent = $('#imageFile').parent();
  var clone = $('#imageFile').clone();
  $('#imageFile').remove();
  $parent.append(clone);
}

function initOnLoad() {
  window.theViewName = 'upimage';
  document.title = _u.i18n('comm_pic') + ' - ' + _u.i18n('defaultTitle');
  var settings = Settings.get();
  var wh_css = 'body{font-family:"' + settings.font + '";font-size:' + settings.fontSite + 'px;}';
  $("#styleCustom").html(wh_css);

  initUpImageEvents();
  init();
}

document.addEventListener('DOMContentLoaded', initOnLoad);
