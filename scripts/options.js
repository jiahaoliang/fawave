// @author qleelulu@gmail.com and fengmk2@gmail.com

var KEYCODE_MAP = {
  8: "BackSpace", 9:"Tab", 12:"Clear", 13:"Enter", 16:"Shift", 17:"Ctrl", 18:"Alt", 19:"Pause",
  20:"Caps Lock", 27:"Escape", 32:"Space", 33:"Prior", 34:"Next", 35:"End", 36:"Home",
  37:"Left", 38:"Up", 39:"Right", 40:"Down", 41:"Select", 42:"Print", 43:"Execute",
  45:"Insert", 46:"Delete", 47:"Help", 48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5",
  54:"6", 55:"7", 56:"8", 57:"9", 65:"A", 66:"B", 67:"C", 68:"D", 69:"E", 70:"F", 71:"G",
  72:"H", 73:"I", 74:"J", 75:"K", 76:"L", 77:"M", 78:"N", 79:"O", 80:"P", 81:"Q", 82:"R",
  83:"S", 84:"T", 85:"U", 86:"V", 87:"W", 88:"X", 89:"Y", 90:"Z", 96:"KP_0", 97:"KP_1",
  98:"KP_2", 99:"KP_3", 100:"KP_4", 101:"KP_5", 102:"KP_6", 103:"KP_7", 104:"KP_8", 105:"KP_9",
  106:"KP_Multiply", 107:"KP_Add", 108:"KP_Separator", 109:"KP_Subtract", 110:"KP_Decimal",
  111:"KP_Divide", 112:"F1", 113:"F2", 114:"F3", 115:"F4", 116:"F5", 117:"F6", 118:"F7",
  119:"F8", 120:"F9", 121:"F10", 122:"F11", 123:"F12", 124:"F13", 125:"F14", 126:"F15",
  127:"F16", 128:"F17", 129:"F18", 130:"F19", 131:"F20", 132:"F21", 133:"F22", 134:"F23",
  135:"F24", 136:"Num_Lock", 137:"Scroll_Lock", 187:"acute", 188:"comma", 189:"minus",
  190:"period", 192:"numbersign", 210:"plusminus", 211:"211", 212:"copyright", 213:"guillemotleft",
  214:"masculine", 215:"AE", 216:"cent", 217:"questiondown", 218:"onequarter", 220:"less",
  221:"plus", 227:"multiply", 228:"Acircumflex", 229:"Ecircumflex", 230:"Icircumflex",
  231:"Ocircumflex", 232:"Ucircumflex", 233:"Ntilde", 234:"Yacute", 235:"Ooblique", 236:"Aring",
  237:"Ccedilla", 238:"THORN", 239:"ETH", 240:"diaeresis", 241:"Agrave", 242:"Egrave", 243:"Igrave",
  244:"Ograve", 245:"Ugrave", 246:"Adiaeresis", 247:"Ediaeresis", 248:"Idiaeresis",
  249:"Odiaeresis", 250:"Udiaeresis", 251:"ssharp", 252:"asciicircum", 253:"sterling",
  254:"Mode_switch"
};

var SUPPORT_AUTH_TYPES = {
  'weibo': ['oauth'],
  'tsina': ['oauth'],
  'tqq': ['oauth'],
  'fanfou': ['oauth'],
  //'renren': ['oauth'],
  'leihou': ['baseauth'],
  'twitter': ['oauth', 'baseauth'],
  'douban_v2': ['oauth'],
  'googleplus': ['oauth'],
  'facebook': ['oauth'],
  'plurk': ['baseauth'],
  'tianya': ['oauth'],
  //'tumblr': ['oauth']
};

var AUTH_TYPE_NAME = {
  'baseauth': 'Basic Auth',
  'oauth': _u.i18n("comm_oauth_name"),
  'xauth': _u.i18n("comm_xauth_name")
};

var TWEEN_TYPES = [
  'Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ',
  'Elastic', 'Back', 'Bounce'
];

function donateRoll() {
  $.get('http://api.yongwo.de/json/fawave_donaters.json', function (data) {
    if (data && data.users && data.users.length > 0) {
      data.users.sort(function (a, b) {
        return (parseInt(b.m, 10) || 0) - (parseInt(a.m, 10) || 10);
      });
      var _h = '';
      $(data.users).each(function () {
        _h += '<li><a target="_blank" href="{{homepage}}" title="{{username}}, {{m}}RMB"><img src="{{face}}" /></a></li>'.format(this);
      });
      $("#donateUsers").html(_h);
      var $a = $('#all_donate_users_link');
      $a.html('??????' + data.users.length + '???, ' + $a.html());

      var _wrap = $('#donateUsers');//??????????????????
      var _interval = 2000;//????????????????????????
      var _moving;//?????????????????????
      _wrap.hover(function () {
        clearInterval(_moving);//??????????????????????????????,????????????
      }, function () {
        _moving = setInterval(function () {
          var _field = _wrap.find('li:first');//???????????????????????????????????????,li:first??????????????????
          var _h = _field.width();//????????????????????????(?????????????????????,??????????????????????????????,??????????????????????????????)
          _field.animate({ marginLeft: - _h + 'px' }, 600, function () {//????????????margin???,???????????????
            _field.css('marginLeft','').appendTo(_wrap);//?????????,????????????margin?????????,??????????????????,??????????????????
          });
        }, _interval);
        //???????????????????????????_interval
      }).trigger('mouseleave');//???????????????,????????????mouseleave,???????????????
    }
  });
}

$(function () {
    donateRoll();

    initTab();

    showDndAccountList(true);

    init();

    initExportImport();

    // ???????????????
    var version;
    $.get(chrome.extension.getURL('manifest.json'), function(info){
        $("#header .logo h1").append('<br/><span style="color:#D51920">V' + info.version + '</span>');
    }, 'json');

    $("#refresh-account").click(function(){
        refreshAccountInfo();
    });

    // ????????????????????????
    $(document).on('click', '.refreshAccountAuth_btn', function () {
      var uniqueKey = $(this).data('uniquekey');
      refreshAccountAuth(uniqueKey);
    })
    .on('click', '.delAccount_btn', function () {
      var uniqueKey = $(this).data('uniquekey');
      delAccount(uniqueKey);
    })
    .on('click', '.changeAccountStatusBtn', function () {
      var uniqueKey = $(this).data('uniquekey');
      var type = $(this).data('type');
      changeAccountStatus(uniqueKey, type);
    })
    .on('change', '#account-blogType', function () {
      onSelBlogTypeChange();
    })
    ;

    $("#show-new-account").click(function(){
      $("#save-account").val(_u.i18n("comm_add"));
      $("#account-name").val('');
      $("#account-pwd").val('');
      $("#edit-account-key").val('');
      $("#account-pin, #account-request-token-key, #account-request-token-secret").val('');
      onSelBlogTypeChange();
      $("#edit-account-info").hide();
      $("#new-account").show();
      $("#user-custom-wrap").hide();
    });

    $("#cancel-save-account, #cancel-save-user-custom").click(function() {
        $("#new-account, #user-custom-wrap, #edit-account-info").hide();
    });

    $("#save-account").click(function () {
        saveAccount();
    });

    //The js call that obtain the auth code.
    $("#get-account-pin").click(function () {
        $('#account-request-token-key').val('');
        $('#account-request-token-secret').val('');
        saveAccount();
        $(this).fadeOut(500).delay(5000).fadeIn(500);
    });

    $("#show-edit-account").click(function(){
        var uniqueKey = $("#account-list").val();
        $("#edit-account-key").val(uniqueKey);
        $("#edit-account-info").show().find('h3').html($(this).text()).end().find('.ainfo').html($("#account-list :selected").text());
        showEditAccount(uniqueKey);
    });

    $("#gRefreshTimeWrap input").change(function () {
        calculateGlobalRefreshTimeHits();
    });

    $("#cleanLocalStorage").click(function () {
        if (confirm(_u.i18n("confirm_clean_local_storage"))) {
            cleanLocalStorageData();
        }
    });

    $("#save-all").click(function(){
        saveAll();
    });

    var settings = Settings.get();
    // ????????????????????????????????????
    $('#remember_view_status_cb').attr('checked', settings.remember_view_status);

    // ??????????????????????????????????????????
    $("#account-authType").change(function () {
        if ($(this).val() === 'oauth') {
            $('.account-oauth').show();
            $('.account-baseauth').hide('');
        } else {
            $('.account-oauth').hide();
            $('.account-baseauth').show('');
            // ?????????????????????
            $('#account-pin').val('');
            $('#account-request-token-key').val('');
            $('#account-request-token-secret').val('');
        }
    });

    //??????url????????? #user_set ?????????????????????????????????tab
    if (window.location.hash) {
        $("#navigation li[target_id=" + window.location.hash + "] a").click();
    }

    // ??????????????????
    var tanslate_options = '';
    for (var k in Languages) {
        tanslate_options += '<option value="{{value}}">{{name}}</option>'.format({name: k, value: Languages[k]});
    }
    var settings = Settings.get();
    $('#translate_target').html(tanslate_options).val(settings.translate_target);

    // ??????????????????
    var shorturls_options = '';
    for (var k in ShortenUrl.services) {
        shorturls_options += '<option value="{{value}}">{{name}}</option>'.format({name: k, value: k});
    }
    var settings = Settings.get();
    $('#shorten_url_service').html(shorturls_options).val(settings.shorten_url_service);

    // ??????????????????
    var image_service_options = '';
    for (var k in ImageService.services) {
        var service = ImageService.services[k];
        if (service.upload) {
            image_service_options += '<option value="{{value}}">{{name}}</option>'.format({name: service.host, value: k});
        }
    }
    var settings = Settings.get();
    $('#image_service').html(image_service_options).val(settings.image_service);
    if (settings.enable_image_service) {
        $('#enableImageService').attr('checked', true);
    } else {
        $('#enableImageService').removeAttr('checked');
    }

    if(settings.show_network_error) {
        $('#show_network_error').attr('checked', true);
    } else {
        $('#show_network_error').removeAttr('checked');
    }

    // ??????instapaper, read it later, vdisk ??????
    var settings = Settings.get();
    var readlater_services = ['instapaper', 'readitlater', 'vdisk'];
    for(var i = 0, len = readlater_services.length; i < len; i++) {
        var service_name = readlater_services[i];
        var service_user = settings[service_name + '_user'];
        if (service_user) {
            $('#' + service_name + '_username').val(service_user.username);
            $('#' + service_name + '_password').val(service_user.password);
            $('#delete_' + service_name + '_account_btn').show();
        }
        $('#set_' + service_name + '_account_btn').attr('service', service_name).click(function() {
            var service_type = $(this).attr('service');
            var username = $.trim($('#' + service_type + '_username').val());
            if(!username) {
                $('#' + service_type + '_username').focus().select();
                return;
            }
            var password = $('#' + service_type + '_password').val();
            if(!password) {
                $('#' + service_type + '_password').focus();
                return;
            }
            var user = {username: username, password: password};
            var services = {
                instapaper: Instapaper,
                readitlater: ReadItLater,
                vdisk: VDiskAPI
            };
            var service = services[service_type];
            var save_user = function (st, user) {
                var settings = Settings.get();
                settings[st + '_user'] = user;
                Settings.save();
                _showMsg(_u.i18n("msg_save_success"));
                $('#delete_' + st + '_account_btn').show();
            };
            if (service_type === 'vdisk') {
                if ($('#vdisk_use_sinat').attr('checked')) {
                    user.app_type = 'sinat';
                }
                service.get_token(user, function(err, result) {
                    if(err) {
                        _showMsg(err.message || _u.i18n("msg_wrong_name_or_pwd"));
                    } else {
                        save_user(service_type, user);
                    }
                });
            } else {
                service.authenticate(user, function(result){
                    if(result) {
                        save_user(service_type, user);
                    } else {
                        _showMsg(_u.i18n("msg_wrong_name_or_pwd"));
                    }
                });
            }
        });
        $('#delete_' + service_name + '_account_btn').attr('service', service_name).click(function() {
            var service_type = $(this).attr('service');
            var settings = Settings.get();
            settings[service_type + '_user'] = null;
            Settings.save();
            $('#' + service_type + '_username').val('');
            $('#' + service_type + '_password').val('');
            $(this).hide();
        });
    }
});

//??????????????????????????????????????????????????????
function calculateGlobalRefreshTimeHits() {
    var total = 0, refTime = 0, refTimeInp = null, timelimes = T_LIST.all;
    for(var i in timelimes){
        refTimeInp = $("#gRefreshTime_" + timelimes[i]);
        refTime = Number(refTimeInp.val());
        if(isNaN(refTime)){
            refTime = Settings.defaults.globalRefreshTime[timelimes[i]];
        }else if(refTime<30){
            refTime = 30;
        }
        refTimeInp.val(refTime);
        total += Math.round(60*60/refTime);
    }
    $("#gRefreshTimeHits").html(total);
}

//???????????????????????????????????????????????????????????????
function calculateUserRefreshTimeHits(user) {
  var total = 0, refTime = 0, refTimeInp = null, timelines = T_LIST[user.blogType];
  for (var i in timelines){
    var type = timelines[i];
    if (user.refreshTime && user.refreshTime[type]) {
      refTime = user.refreshTime[type];
    } else {
      refTime = 0;
    }
    if (refTime === 0) {
      refTime = Settings.get().globalRefreshTime[type] || 120;
    }
    total += Math.round(60 * 60 / refTime);
  }
  return total;
}

//????????????????????????????????????????????????????????????????????????????????????
function checkUserRefreshTimeHitsAndSave(inp) {
    inp = $(inp);
    var refTime = 0, total = 0, _li = inp.closest('li');

    var uniqueKey = _li.attr('uniqueKey');
    var userList = getUserList('all');
    var user = null;
    $.each(userList, function(i, item) {
        if (item.uniqueKey === uniqueKey){
            user = item;
            return false;
        }
    });
    if(!user){
        return;
    }
    user.refreshTime = user.refreshTime || {};

    _li.find('.inpRefTime').each(function(){
        refTime = Number($(this).val());
        if(isNaN(refTime)){
            refTime = 0;
        }else if(refTime!==0 && refTime<30){
            refTime = 30;
        }
        $(this).val(refTime);
        user.refreshTime[$(this).attr('t')] = refTime;
        if (refTime === 0) {
            refTime = Settings.get().globalRefreshTime[$(this).attr('t')];
        }
        total += Math.round(60*60/refTime);
    });
    _li.find('.refHits').html(total);
    saveUserList(userList);
    var b_view = getBackgroundView();
    if (b_view) {
        b_view.RefreshManager.restart();
    }
    _showMsg(_u.i18n("msg_interval_update_success"));
}

var curthas = checkUserRefreshTimeHitsAndSave;

function showDndAccountList(bindDnd) {
  var userList = getUserList('all');
  var userCount = 0;
  var needRefresh = false;
  if (userList) {
    var op = '';
    //var tpl = '<option value="{{uniqueKey}}">({{statName}}) ({{blogTypeName}}) {{screen_name}}</option>';
    var tpl = '<li id="dnd_a_{{uniqueKey}}" class="{{uniqueKey}} {{stat}} clearFix" uniqueKey="{{uniqueKey}}" stat="{{stat}}">' +
      '<div class="face_img drag">' +
      '   <a class="face" href="javascript:"><img src="{{profile_image_url}}"></a>' +
      '   <img src="/images/blogs/{{blogType}}_16.png" class="blogType">' +
      '</div>' +
      '<div class="detail">' +
      '   <div class="item"><span class="userName">{{screen_name}}</span>({{blogTypeName}})' +
      '       <div class="stat"><span class="statName">{{statName}}</span><span class="nav-arrow">&nbsp;</span>' +
      '           <div><ul><li class="changeAccountStatusBtn enabled" data-uniqueKey="{{uniqueKey}}" data-type="enabled">'+ _u.i18n("comm_enabled") +'</li>' +
      '               <li class="changeAccountStatusBtn onlysend" data-uniqueKey="{{uniqueKey}}" data-type="onlysend">'+ _u.i18n("comm_send_only") +'</li>' +
      '               <li class="changeAccountStatusBtn disabled" data-uniqueKey="{{uniqueKey}}" data-type="disabled">'+ _u.i18n("comm_disabled") +'</li></ul>' +
      '           </div>' +
      '       </div>' +
      '       <span class="edit">' +
      '   <button class="button_white button_small delAccount_btn" data-uniqueKey="{{uniqueKey}}"><img src="images/delete.png">'+ _u.i18n("comm_del_user") + '</button>' +
      '   <button class="button_white button_small refreshAccountAuth_btn" data-uniqueKey="{{uniqueKey}}"><img src="images/refresh.png">'+ _u.i18n("comm_refresh_user_auth") + '</button>' +
      ' </span>' +
      '   </div>' +
      '   <div class="item item2">' +
      '       <span><span>'+ _u.i18n("sett_refresh_interval") +':  </span><span class="userRefreshTimeWrap">{{refTimeHtml}}</span></span>' +
      '   </div>' +
      '</div>' +
      '</li>';
    for (var j = 0, jlen = userList.length; j < jlen; j++) {
      userCount++;
      var user = userList[j];
      if (!user.uniqueKey){ //?????????????????????
        needRefresh = true;
      } else {
        user.blogTypeName = T_NAMES[user.blogType];
        user.statName = user.disabled ? _u.i18n("comm_disabled") : (user.only_for_send ? _u.i18n("comm_send_only") : _u.i18n("comm_enabled"));
        user.stat = user.disabled ? 'disabled' : (user.only_for_send ? 'onlysend' : 'enabled');

        //??????????????????????????????
        var refTime = 0, timelines = T_LIST[user.blogType], c_html = '';
        for (var i = 0, len = timelines.length; i < len; i++) {
          var timelineType = timelines[i];
          if (c_html) {
            c_html += ', ';
          }
          c_html += tabDes[timelineType];
          c_html += '('+ (Settings.get().globalRefreshTime[timelineType] || 120) +')';
          if (user.refreshTime && user.refreshTime[timelineType]) {
            refTime = user.refreshTime[timelineType];
          } else{
            refTime = 0;
          }
          c_html += '<input type="text" t="' + timelineType + '" value="' + refTime +'" class="inpRefTime" onchange="curthas(this)" />' + _u.i18n("comm_second");
        }
        c_html += ' (<span class="refHits">' + calculateUserRefreshTimeHits(user) + '</span>'+ _u.i18n("comm_request") +'/'+ _u.i18n("comm_per_hour") +')';
        user.refTimeHtml = c_html;

        op += tpl.format(user);
      }
    }
    $("#dnd-account-list li .drag").unbind();
    $("#dnd-account-list").html(op);
    if (bindDnd) {
      $("#dnd-account-list").dragsort({
        dragSelector: ".drag", dragBetween: false, dragEnd: saveDndSortList,
        placeHolderTemplate: "<li class='placeHolder'><div></div></li>"
      });
    }
  }
  if (needRefresh || userCount <= 0) {
    $("#tab_user_set").click();
  }
  if (needRefresh) {
    $("#needRefresh").show();
  }

  // ??????????????????
  var blogtype_options = '';
  var settings = Settings.get();
  var k;
  for (k in SUPPORT_AUTH_TYPES) {
    if (!T_NAMES[k]) {
      continue;
    }
    blogtype_options += '<option value="{{value}}">{{name}}</option>'.format({ name: T_NAMES[k], value: k });
  }
  $('#account-blogType').html(blogtype_options);
  showSupportAuthTypes($('#account-blogType').val());

  // ??????????????????appkey ??????
  var appkey_options = '';
  for (k in TSINA_APPKEYS) {
    if (k !== 'fawave') {
      continue;
    }
    appkey_options += '<option value="{{value}}">{{name}}</option>'.format({ name: TSINA_APPKEYS[k][0], value: k });
  }
  $('#account-appkey').html(appkey_options);
}

//??????????????????????????????????????????
function saveDndSortList() {
    var new_list = [];
    var userlist = getUserList('all');
    $("#dnd-account-list li").each(function () {
        var uniqueKey = $(this).attr('uniqueKey');
        $.each(userlist, function (index, user){
            if (user.uniqueKey === uniqueKey) {
                new_list.push(user);
                return false;
            }
        });
    });
    saveUserList(new_list);
    _showMsg('?????????????????????');
}

// ???????????????????????????
function changeAccountStatus(uniqueKey, stat) {
  var _li = $("#dnd_a_" + uniqueKey);
  if (_li.attr('stat') === stat) {
    return;
  }
  // ???????????????????????????
  var userList = getUserList('all');
  var user = null;
  $.each(userList, function (i, item) {
    if (item.uniqueKey === uniqueKey){
      user = item;
      return false;
    }
  });
  var b_view = getBackgroundView();
  if (user) {
    switch (stat) {
    case 'enabled':
      user.disabled = false;
      user.only_for_send = false;
      break;
    case 'disabled':
      user.disabled = true;
      user.only_for_send = false;
      break;
    case 'onlysend':
      //???????????????????????????????????????????????????
      user.disabled = false;
      user.only_for_send = true;
      break;
    }
    saveUserList(userList);
    var c_user = getUser();
    if (c_user && c_user.uniqueKey.toLowerCase() === uniqueKey.toLowerCase()) {
      if (b_view) {
        b_view.setUser('');
        b_view.onChangeUser();
      }
    }
  }

  if (b_view) {
    b_view.RefreshManager.restart();
  }
  var statName = user.disabled ? _u.i18n("comm_disabled") : (user.only_for_send ? _u.i18n("comm_send_only") : _u.i18n("comm_enabled"));
  _showMsg(_u.i18n("msg_stat_change_success").format({ username: user.screen_name, stat: statName }));
  _li.removeClass(_li.attr('stat')).addClass(stat).attr('stat', stat);
  _li.find('.detail .stat .statName').html(statName);
}

function showMyGeo() {
    var geoPosition = $("#isGeoEnabled").data('position');
    if (geoPosition) {
        popupBox.showMap('icons/icon48.png', geoPosition.latitude, geoPosition.longitude, geoPosition);
    } else {
        _showMsg(_u.i18n("msg_no_geo_info"));
    }
}

function init() {
    var settings = Settings.get();

    //?????????????????????????????????
    for (var i in T_LIST.all) {
        $("#gRefreshTime_" + T_LIST.all[i]).val(settings.globalRefreshTime[T_LIST.all[i]]);
    }
    calculateGlobalRefreshTimeHits();

    if(!settings.isSharedUrlAutoShort){
        $("#autoShortUrl").attr("checked", false);
    }

    //????????????
    $("#isSmoothScroller").attr("checked", settings.isSmoothScroller ? true : false);
    var tween_options = '';
    for (var i in TWEEN_TYPES) {
        tween_options += '<option value="{{name}}">{{name}}</option>'.format({ name: TWEEN_TYPES[i] });
    }
    $("#tween_type").html(tween_options).val(settings.smoothTweenType);
    $("#ease_type").val(settings.smoothSeaeType);
    $("#tween_type, #ease_type").change(function () {
        SmoothScrollerDemo.start();
    });

    //????????????
    if (settings.isGeoEnabled) {
        if (settings.isGeoEnabledUseIP) {
            $("#isGeoEnabledUseIP").attr("checked", true);
        } else {
            $('#isGeoEnabled').attr("checked", true);
        }
        $("#isGeoEnabled").data('position', settings.geoPosition);
        $("#btnShowMyGeo").show();
    }
    $("#isGeoEnabled").click(function () {
        if (!$(this).attr('checked')) { //????????????????????????
            $("#btnShowMyGeo").hide();
            return;
        }
        $("#isGeoEnabledUseIP").attr('checked', false);
        if (navigator.geolocation) {
            $("#save-all").attr('disabled',true);
            navigator.geolocation.getCurrentPosition(function (position) {
                //success
                var p = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                $('#isGeoEnabled').data('position', p);
                $("#save-all").removeAttr('disabled');
                $("#btnShowMyGeo").show();
            }, function (msg) {
                //error
                _showMsg(_u.i18n("msg_enabled_geo_false") + (typeof msg === 'string' ? msg : ""));
                $("#save-all").removeAttr('disabled');
                $("#isGeoEnabled").attr('checked', false);
            });
        } else {
            _showMsg(_u.i18n("msg_not_support_geo"));
        }
    });

    // ??????ip??????????????????
    $('#isGeoEnabledUseIP').click(function () {
        if (!$(this).attr('checked')) { //????????????????????????
            $("#btnShowMyGeo").hide();
            return;
        }
        $("#isGeoEnabled").attr('checked', false);
        // ????????????ip
        $("#save-all").attr('disabled',true);
        get_location(function (geo, error) {
            if (geo) {
                $('#isGeoEnabled').data('position', geo);
                $("#btnShowMyGeo").show();
            } else {
                _showMsg(_u.i18n("msg_enabled_geo_false") + ' ' + error);
                $("#isGeoEnabledUseIP").attr('checked', false);
            }
            $("#save-all").removeAttr('disabled');
        });
    });

    $("#autoShortUrlCount").val(settings.sharedUrlAutoShortWordCount);

    //????????????????????????????????????????????????
    $("#unread_sync_to_page").attr("checked", settings.isSyncReadedCount);

    //?????????????????????????????????
    $("#enable_contextmenu").attr("checked", settings.enableContextmenu);

    //????????????????????????????????????
    $("#send_accounts_default_select").val(settings.sendAccountsDefaultSelected);

    $("#tp_looking").val(settings.lookingTemplate); //??????????????????

    //?????????????????????????????????
    for (var i in T_LIST.all) {
        $("#set_badge_" + T_LIST.all[i]).attr("checked", settings.isSetBadgeText[T_LIST.all[i]]);
    }

    //?????????????????????????????????????????????
    for (var i in T_LIST.all) {
        $("#set_show_in_page_" + T_LIST.all[i]).attr("checked", settings.isShowInPage[T_LIST.all[i]]);
    }

    //???????????????????????????
    for (var i in T_LIST.all) {
        $("#sound_alert_" + T_LIST.all[i]).attr("checked", settings.isEnabledSound[T_LIST.all[i]]);
    }
    $("#inpSoundFile").val(settings.soundSrc);

    //???????????????????????????
    for (var i in T_LIST.all) {
        $("#destop_alert_" + T_LIST.all[i]).attr("checked", settings.isDesktopNotifications[T_LIST.all[i]]);
    }
    $("#inpDesktopNotificationsTimeout").val(settings.desktopNotificationsTimeout);

    //?????????????????????
    var theme = settings.theme;
    if (theme) {
      $("#selTheme").val(theme);
      $("#themePreview").attr("src", '/themes/'+ theme +'/theme.png');
    }
    $("#selTheme").change(function () {
      $("#themePreview").attr("src", '/themes/'+ $(this).val() +'/theme.png');
    });
    $('#themePreview').click(function () {
      popupBox.showImg($(this).attr('src'));
      return false;
    });

    //?????????????????????
    $("#selFont").val(settings.font).change(function () {
        $("#selFontText").val($(this).val());
    });
    $("#selFontText").val(settings.font);
    $("#selFontSize").val(settings.fontSite);

    // display language
    if (settings.default_language) {
        $('#selDefaultLanguage').val(settings.default_language);
    }

    //???????????????
    var w = settings.popupWidth, h = settings.popupHeight;
    $("#set_main_width").val(w);
    $("#set_main_height").val(h);

    initQuickSendHotKey();

    initJtip();
}

//?????????Tab??????
function initTab() {
    $("ul#navigation li a").click(function() {
        if ($(this).hasClass('ignore')) { return; }
        var old_t = $("ul#navigation li.selected").attr('target_id');
        $(old_t).hide();
        $("ul#navigation li").removeClass("selected");
        var new_t = $(this).parents();
        new_t.addClass("selected");
        $(new_t.attr('target_id')).show();
        if(new_t.attr('hide_save_btn')){
            $("#save-all").hide();
        }else{
            $("#save-all").show();
        }
        return false;
    });
}

// jTip
function initJtip() {
    $(".jTip").hover(function(){
        var _t = $(this);
        var offset = _t.offset();
        $("#JT_close_left").html(_t.attr('jTitle')||'???');
        $("#JT_copy").html(_t.find('.c').html().replace(/<script>.*<\/script>/ig, ''));
        var jWidth = _t.attr('jWidth') || '';
        $("#JT").css({top:offset.top-5, left:offset.left + 25, width:jWidth}).css({visibility:'visible', opacity:'0.98'});
    }, function(){
        $("#JT").css({opacity:0, visibility:'hidden'});
    });
}

//?????????????????????
function initExportImport() {
    //popupBox.showHtmlBox
    $("#showExportSettings").click(function(){
        var out = {UserList:getUserList('all'), Settings:Settings.get()};
        popupBox.showHtmlBox(_u.i18n('sett_export'),
          '<textarea style="width:350px;height:350px;" id="exportSettingsText" readonly>' + JSON.stringify(out) + '</textarea>');
        $('#exportSettingsText').on('mouseover', function () {
          this.select();
        });
    });

    $("#showImportSettings").click(function(){
        popupBox.showHtmlBox(_u.i18n('sett_import'),
          '<textarea id="txtImportSettings" style="width:350px;height:350px;"></textarea>' +
          '<br/><button id="btnImportSettings">' + _u.i18n('sett_import') + '</button>' );
        $('#btnImportSettings').on('click', importSettings);
    });
}

function importSettings(){
    var s = $("#txtImportSettings").val();
    try{
        s = JSON.parse(s);
    }catch(err){
        _showMsg('Import Error: ' + err);
        s = null;
    }
    if(s){
        if(s.UserList){
            var ulOld = getUserList('all');
            var ulNew = $.extend(ulOld, s.UserList);
            saveUserList(ulNew);
        }
        if(s.Settings){
            var oldSet = Settings.get();
            oldSet = $.extend(oldSet, s.Settings);
            Settings.save();
        }
        document.location.reload();
    }
}

//???????????????????????????
var TEMP_SET_KEYS = [];
function initQuickSendHotKey(){
    var keys = Settings.get().quickSendHotKey;
    keys = keys.split(',');
    var key_maps = '';
    for(var i in keys){
        var _i = keys[i];
        if(KEYCODE_MAP[_i]){
            _i = KEYCODE_MAP[_i];
        }
        if(key_maps){ key_maps += ' + '; }
        key_maps += _i;
    }
    $("#set_quick_send_key_inp").val(key_maps);
    $("#set_quick_send_key").val(keys);
    $("#set_quick_send_key_inp").focus(function(){
        $("#set_quick_send_key_tip").show();
        $(this).bind('keydown', function(e){
            if(e.keyCode == 8){ //??????????????????????????????
                $("#set_quick_send_key_inp").val('');
                return true;
            }
            //?????????????????????,?????????
            if (TEMP_SET_KEYS.length && e.keyCode == TEMP_SET_KEYS[TEMP_SET_KEYS.length-1]){
                return false;
            }
            var _t = $(this);
            if(!TEMP_SET_KEYS.length){ _t.val(''); }
            TEMP_SET_KEYS.push(e.keyCode);
            var key_name = e.keyCode;
            if(KEYCODE_MAP[e.keyCode]){
                key_name = KEYCODE_MAP[e.keyCode];
            }
            if(_t.val()){
                _t.val(_t.val() + ' + ');
            }
            _t.val(_t.val() + key_name);
            return false;
        });
        $(this).bind('keyup', function(e){
            if(TEMP_SET_KEYS.length){
                $("#set_quick_send_key").val(TEMP_SET_KEYS.toString());
            }
            TEMP_SET_KEYS = [];
        });
    }).blur(function(){
        $(this).unbind('keydown');
        $(this).unbind('keyup');
        if(TEMP_SET_KEYS.length){
            $("#set_quick_send_key").val(TEMP_SET_KEYS.toString());
        }
        TEMP_SET_KEYS = [];
        $("#set_quick_send_key_tip").hide();
    });
}

function _verify_credentials(user) {
    if (!user) {
        _showMsg(_u.i18n("msg_wrong_name_or_pwd"),false,true);
        $('#save-account').removeAttr('disabled');
        return;
    }
    tapi.verify_credentials(user, function (data, textStatus, errorCode) {
        $('#save-account').removeAttr('disabled');
        if (!data || !data.id || errorCode || textStatus === 'error') {
            if (errorCode === 400 ||errorCode === 401 || errorCode === 403) {
                _showMsg(_u.i18n("msg_wrong_name_or_pwd"));
            } else {
                var err_msg = '';
                if (data.error) {
                    err_msg = 'error: ' + data.error;
                }
                _showMsg(_u.i18n("msg_user_save_error") + err_msg);
            }
            var params = { blogtype: user.blogType, authtype: user.authType };
            if (errorCode) {
                params.error_code = errorCode;
            }
            if (data && data.error) {
                params.error = data.error;
            }
            chrome.extension.sendRequest({ method:'activelog', active: 'save_account_error', params: params });
        } else {
            var userList = getUserList('all');
            $.extend(user, data);
            user.uniqueKey = user.blogType + '_' + user.id;
            user.screen_name = user.screen_name || user.name;
            var temp_uniqueKey = $("#edit-account-key").val() || user.uniqueKey;
            // ??????????????????????????????
            var found = false;
            $.each(userList, function (i, item) {
                if (item.uniqueKey === temp_uniqueKey) {
                    userList[i] = user;
                    found = true;
                    return false;
                }
            });
            if (!found) {
                userList.push(user);
            }
            saveUserList(userList);
            var c_user = getUser();
            if (!c_user || c_user.uniqueKey === temp_uniqueKey) {
                setUser(user);
            }
            var btnVal = $("#save-account").val();
            showDndAccountList();

            $("#new-account").hide();
            $("#account-name").val('');
            $("#account-pwd").val('');
            $("#account-pin").val('');
            _showMsg(_u.i18n("msg_edit_user_success").format({
              edit: btnVal,
              username: data.screen_name
            }));

            var b_view = getBackgroundView();
            if (b_view && b_view.RefreshManager && b_view.RefreshManager.restart) {
                b_view.RefreshManager.restart(true);
            }
            // logging
            var args = {
              blogtype: user.blogType,
              authtype: user.authType,
              tid: user.uniqueKey
            };
            chrome.extension.sendRequest({
              method:'activelog',
              active: 'save_account_success',
              params: args
            });
        }
    });
}

//??????????????????
//???????????????????????????????????????????????????????????????????????????????????????????????????
// ?????????????????????????????????????????????
//   - uniqueKey: ??????????????????????????? blogType_userId , userId?????????????????????????????????id. ????????????????????????????????????????????????css class??????
//   - authType: ???????????????oauth, baseauth, xauth
//   - userName: baseAuth??????????????????
//   - password: baseAuth???????????????
//   - oauth_token_key: oauth?????????????????????key
//   - oauth_token_secret: oAuth??????????????????secret
//   - blogType: ???????????????tsina, t163, tsohu, twitter, digu
//   - apiProxy: api??????, ??????twitter??????
//   - disabled: ?????????????????????
function saveAccount(forcelogin) {
  var userName = $.trim($("#account-name").val());
  var pwd = $.trim($("#account-pwd").val());
  var blogType = $.trim($("#account-blogType").val()) || 'tsina'; //??????????????????????????????tsina
  var authType = $.trim($("#account-authType").val()); //??????????????????
  var appkey = 'fawave', appkey_secret = null;
//    if(!$('.account-appkey').is(':hidden')) {
//        appkey = $.trim($('#account-appkey').val()) || 'fawave';
//        if($('#account-appkey-diy').attr('checked')) {
//            var diy_key = $('#account-appkey-diy-key').val();
//            var diy_secret = $('#account-appkey-diy-secret').val();
//            if(diy_key && diy_secret) {
//                appkey = diy_key;
//                appkey_secret = diy_secret;
//            }
//        }
//    }
  // appkey = 'fawave';
  var pin = $.trim($('#account-pin').val()); // oauth pin???
  var apiProxy = $.trim($('#account-proxy-api').val());
  var apiKey = $.trim($('#account-proxy-api-key').val());
  var apiCustomSecret =$.trim($('#account-custom-secret').val());
  var user = {
    blogType: blogType,
    authType: authType
  };
  // ???????????????twitter????????????
  if (blogType === 'twitter' && apiProxy) {
      user.apiProxy = apiProxy;
  }
  if (blogType === 'twitter' && apiKey && apiCustomSecret) {
      user.twitter_oauth_token_key = apiKey;
      user.twitter_oauth_token_secret = apiCustomSecret;
  }
  // ??????????????????????????????key
  if (blogType === 'tsina' && appkey) {
    user.appkey = appkey;
    if (appkey_secret) {
      user.appkey_secret = appkey_secret;
    }
  }
  if ((authType === 'baseauth' || authType === 'xauth') && userName && pwd) {
    user.userName = userName;
    user.password = pwd;
    if (authType === 'xauth') {
      tapi.get_access_token(user, function (auth_user) {
        _verify_credentials(auth_user);
        delete auth_user.userName;
        delete auth_user.password;
      });
    } else {
      _verify_credentials(user);
    }
  } else if (authType === 'oauth') {
    var request_token_key = $('#account-request-token-key').val();
    var request_token_secret = $('#account-request-token-secret').val();
    if (pin && ((request_token_key && request_token_secret) ||
        blogType === 'laiwang' || blogType === 'tqq' ||
        blogType === 'weibo' || blogType === 'diandian' || blogType === 'douban_v2' ||
        blogType === 'googleplus' || blogType === 'facebook' || blogType === 'renren')) {
      user.oauth_pin = pin;
      // ??????request token
      user.oauth_token_key = request_token_key;
      user.oauth_token_secret = request_token_secret;
      $('#save-account').attr('disabled', true);
      tapi.get_access_token(user, function (auth_user) {
        _verify_credentials(auth_user);
      });
    } else { // ??????????????????
      tapi.get_authorization_url(user, function (login_url, text_status, error_code) {
        if (!login_url) {
          _showMsg('get_authorization_url error: ' + text_status + ' code: ' + error_code);
        } else {
          // ?????????????????? request token
          $('#account-request-token-key').val(user.oauth_token_key);
          $('#account-request-token-secret').val(user.oauth_token_secret);
          if (blogType === 'weibo' && forcelogin !== false) {
            // ?????? api 2.0 ??????????????????????????????????????????
            login_url += '&forcelogin=true';
          }
          chrome.tabs.create({url: login_url});
        }
      });
    }
  } else {
    _showMsg(_u.i18n("msg_need_username_and_pwd"));
  }
}

function onSelBlogTypeChange() {
    var blogType = $("#account-blogType").val();
    $("#account-blogType-img").attr('src', 'images/blogs/' + blogType + '_16.png');
    showSupportAuthTypes(blogType);
    $('.account-appkey').hide();
}

function showSupportAuthTypes(blogType, authType) {
    var types = SUPPORT_AUTH_TYPES[blogType];
    if(!types){
        _showMsg('??????"' + blogType + '"?????????????????????');
        return;
    }
    var selAT = $("#account-authType");
    selAT.html('');
    // ??????????????????
    var authtype_options = '';
    for (var i in types) {
        authtype_options += '<option value="{{value}}" {{selected}}>{{name}}</option>'.format({
            name: AUTH_TYPE_NAME[types[i]], value: types[i],
            selected: types[i] === authType ? 'selected="selected"' : ''
        });
    }
    selAT.html(authtype_options);
    selAT.change();
    if (blogType === 'twitter') {
        $('.account-proxy').show();
        $('.account-proxy-key').show();
        $('.account-api-secret').show();
    } else {
        $('.account-proxy').hide();
        $('.account-proxy-key').hide();
        $('.account-api-secret').hide();
    }
    $('.account-appkey').hide();
}

function showEditAccount(uniqueKey) {
    if(uniqueKey){
        var userList = getUserList('all');
        var user = null;
        $.each(userList, function(index, item) {
            if (item.uniqueKey === uniqueKey) {
                user = item;
                return false;
            }
        });
        if (user) {
            $("#user-custom-wrap").hide();
            $("#new-account").show();
            $("#account-blogType").val(user.blogType);
            showSupportAuthTypes(user.blogType, user.authType);
            $("#account-name").val(user.userName || '');
            $("#account-pwd").val(user.password || '');
            $("#account-proxy-api").val(user.apiProxy || '');
            $("#save-account").val(_u.i18n("comm_save"));
        }
    }
}

function delAccount(uniqueKey) {
    if (!confirm(_u.i18n("confirm_del_account"))) {
        return;
    }
    //$("#account-list option:selected").remove();
    $("#dnd_a_"+uniqueKey).remove();
    var userList = getUserList('all');
    var new_list = [];
    var delete_user = {};
    var b_view = getBackgroundView();
    for (var i in userList) {
        var user = userList[i];
        if (user.uniqueKey.toLowerCase() === uniqueKey.toLowerCase()) {
            delete_user = user;
            //TODO: ?????????????????????????????????
            for (var key in localStorage) {
                if (key.indexOf(uniqueKey) >-1 ){
                    if (key !== USER_LIST_KEY && key !== CURRENT_USER_KEY) {
                        localStorage.removeItem(key);
                    }
                }
            }
            var c_user = getUser();
            if (c_user && c_user.uniqueKey.toLowerCase() === uniqueKey.toLowerCase()) {
                if (b_view) {
                    b_view.setUser('');
                    b_view.onChangeUser();
                }
            }
        } else {
            new_list.push(user);
        }
    }
    saveUserList(new_list);
    if (b_view) {
        b_view.RefreshManager.restart();
    }
    _showMsg(_u.i18n("msg_del_account_success").format({
        blogname: T_NAMES[delete_user.blogType],
        username: delete_user.screen_name
    }));
}

function saveAll() {
    var settings = Settings.get();
    var bg = getBackgroundView();

    //????????????????????????????????????
    var gr = null, grv = null;
    for (var i in T_LIST.all) {
        gr = $("#gRefreshTime_" + T_LIST.all[i]);
        grv = Number(gr.val());
        if(isNaN(grv)){
            grv = Settings.defaults.globalRefreshTime[T_LIST.all[i]];
        }else if(grv < 30){ //??????30???
            grv = 30;
        }
        settings.globalRefreshTime[T_LIST.all[i]] = grv;
        gr.val(grv);
    }
    var b_view = getBackgroundView();
    if (b_view) {
        b_view.RefreshManager.restart(); //TODO: ????????????
    }

    settings.isSharedUrlAutoShort = !!$("#autoShortUrl").attr("checked");
    var asuwc = $("#autoShortUrlCount").val(); //??????????????????
    asuwc = Number(asuwc);
    if(!isNaN(asuwc) && asuwc>0){
        settings.sharedUrlAutoShortWordCount = asuwc;
    }else{
        settings.sharedUrlAutoShortWordCount = Settings.defaults.sharedUrlAutoShortWordCount;
    }

    //????????????????????????????????????
    settings.sendAccountsDefaultSelected = $("#send_accounts_default_select").val();

    //????????????
    settings.isSmoothScroller = $("#isSmoothScroller").attr("checked") ? true : false;
    settings.smoothTweenType = $("#tween_type").val();
    settings.smoothSeaeType = $("#ease_type").val();

    //????????????
    if($("#isGeoEnabled").attr("checked") || $("#isGeoEnabledUseIP").attr("checked")) {
        settings.isGeoEnabled = true;
        settings.geoPosition = $("#isGeoEnabled").data('position');
        if($("#isGeoEnabledUseIP").attr("checked")) {
            settings.isGeoEnabledUseIP = true;
        } else {
            settings.isGeoEnabledUseIP = false;
        }
    } else {
        settings.isGeoEnabled = false;
        settings.geoPosition = null;
    }

    settings.isSyncReadedCount = $("#unread_sync_to_page").attr("checked") ? true : false;

    //????????????
    settings.enableContextmenu = $("#enable_contextmenu").attr("checked") ? true : false;
    if(settings.enableContextmenu){
        bg.createSharedContextmenu();
    }else{
        bg.removeSharedContextmenu();
    }

    settings.lookingTemplate = $("#tp_looking").val(); //??????????????????

    if($("#set_quick_send_key_inp").val()){
        settings.quickSendHotKey = $("#set_quick_send_key").val(); //???????????????????????????
    }

    //??????????????????
    $("#set_badge_wrap :checkbox").each(function(){
        var $this = $(this);
        settings.isSetBadgeText[$this.attr('id').replace('set_badge_','')] = ($this.attr("checked") ? true : false);
    });

    //????????????????????????????????????
    $("#set_show_in_page_wrap :checkbox").each(function(){
        var $this = $(this);
        settings.isShowInPage[$this.attr('id').replace('set_show_in_page_','')] = ($this.attr("checked") ? true : false);
    });

    //????????????????????????
    $("#set_sound_alert_wrap :checkbox").each(function(){
        var $this = $(this);
        settings.isEnabledSound[$this.attr('id').replace('sound_alert_','')] = ($this.attr("checked") ? true : false);
    });
    var _soundFile = $.trim($("#inpSoundFile").val());
    if(_soundFile){
        settings.soundSrc = _soundFile;
        bg.AlertaAudioFile && (bg.AlertaAudioFile.src = _soundFile);
    }

    //???????????????????????????
    $("#set_destop_alert_wrap :checkbox").each(function(){
        var $this = $(this);
        settings.isDesktopNotifications[$this.attr('id').replace('destop_alert_','')] = ($this.attr("checked") ? true : false);
    });
    var nfTimeout = $("#inpDesktopNotificationsTimeout").val();
    nfTimeout = Number(nfTimeout);
    if(isNaN(nfTimeout) || nfTimeout < 3){
        nfTimeout = 3;
    }
    settings.desktopNotificationsTimeout = nfTimeout;

    //????????????
    var theme = $("#selTheme").val();
    settings.theme =  theme;

    //????????????
    var w = $("#set_main_width").val();
    var h = $("#set_main_height").val();
    w = Number(w);
    h = Number(h);
    if(isNaN(w) || w < 350){
        w = 350;
    }
    if(isNaN(h) || h < 350){
        h = 350;
    }
    settings.popupWidth = w;
    settings.popupHeight = h;
    $("#set_main_width").val(w);
    $("#set_main_height").val(h);

    //????????????
    var font = $("#selFontText").val();
    settings.font =  font;
    var fontSize = $("#selFontSize").val();
    settings.fontSite = fontSize;

    var display_language = $("#selDefaultLanguage").val();
    settings.default_language = display_language;
    var bg = getBackgroundView();
    bg.reload_i18n_messages(display_language);

    settings.translate_target = $('#translate_target').val();
    settings.shorten_url_service = $('#shorten_url_service').val();
    settings.image_service = $('#image_service').val();
    if($('#enableImageService').attr('checked')) {
        settings.enable_image_service = true;
    } else {
        settings.enable_image_service = false;
    }

    // ????????????????????????
    settings.remember_view_status = !!$('#remember_view_status_cb').attr('checked');

    // show_network_error
    settings.show_network_error = !!$('#show_network_error').attr('checked');

    Settings.save();
    _showMsg(_u.i18n("msg_save_success"), true);
}

//????????????
/*
 t: current time?????????????????????
 b: beginning value??????????????????
 c: change in value??????????????????
 d: duration?????????????????????
*/
var SmoothScrollerDemo = {
    T: '', //setTimeout??????
    movable_block: '',
    ease_type: 'easeOut',
    tween_type: 'Quad',
    status:{t:0, b:0, c:90, d:100},
    start: function(){
        clearTimeout(this.T);
        this.movable_block = $("#tween_demo span").css('margin-left', 0);
        this.ease_type = $("#ease_type").val();
        this.tween_type = $("#tween_type").val();
        this.status.t = 0;
        this.status.b = 0;
        this.run();
    },
    run: function(){
        var _t = SmoothScrollerDemo;
        var _left = Math.ceil(Tween[_t.tween_type][_t.ease_type](_t.status.t, _t.status.b, _t.status.c, _t.status.d));
        _t.movable_block.css('margin-left', _left);
        if(_t.status.t < _t.status.d){ _t.status.t++; setTimeout(_t.run, 10); }
    }
};

function refreshAccountAuth(uniqueKey) {
  var user = getUserByUniqueKey(uniqueKey);
  if (!user) {
    return;
  }
  $('#show-new-account').click();
  $('#account-blogType').val(user.blogType);
  onSelBlogTypeChange();
  // $('#get-account-pin').click();
  saveAccount(false);
}

//??????????????????
function refreshAccountInfo() {
    var stat = {errorCount: 0, successCount: 0};
    // ??????????????????
    stat.userList = getUserList('all');
    $("#refresh-account").attr("disabled", true);
    for(var i in stat.userList){
        refreshAccountWarp(stat.userList[i], stat);//???????????????????????????????????????????????????????????????????????????
    }
}

function refreshAccountWarp(user, stat) {
    tapi.verify_credentials(user, function(data, textStatus, errorCode){
        user.blogType = user.blogType || 'tsina'; //??????????????????
        user.authType = user.authType || 'baseauth'; //??????????????????
        var blogName = T_NAMES[user.blogType];
        if (errorCode){
            if (errorCode === 400) {
                _showMsg(_u.i18n("msg_update_accounts_info_false").format({blogname:blogName, username:user.screen_name}));
            } else {
                _showMsg(_u.i18n("msg_update_accounts_info_unknow_error").format({blogname:blogName, username:user.screen_name, errorcode:errorCode}));
            }
//            userList[user.uniqueKey] = user;
            stat.errorCount++;
        } else {
            $.extend(user, data); //????????????data???????????????
            user.uniqueKey = user.blogType + '_' + user.id;
//            stat.userList[i] = user;
//            userList[data.uniqueKey] = data;
            stat.successCount++;
            _showMsg(_u.i18n("msg_update_account_info_success").format({blogname:blogName, username:user.screen_name}), true);
        }
        if((stat.errorCount + stat.successCount) === stat.userList.length){
            // ????????????????????????
            saveUserList(stat.userList);
            var c_user = getUser();
            if(c_user){
                if(!c_user.uniqueKey){ //?????????????????????
                    c_user.uniqueKey = (c_user.blogType||'tsina') + '_' + c_user.id;
                }
                $.each(stat.userList, function(index, item){
                    if(c_user.uniqueKey.toLowerCase() === item.uniqueKey) {
                        c_user = item;
                        return false;
                    }
                });
//                c_user = userList[c_user.uniqueKey.toLowerCase()];
                setUser(c_user);
            }
            _showMsg(_u.i18n("msg_update_accounts_info_complete").format({successCount:stat.successCount, errorCount:stat.errorCount}));
            $("#refresh-account").removeAttr("disabled");
            if ($("#needRefresh").css('display') !== 'none') { //????????????????????????????????????????????????????????????????????????
                window.location.reload(); //TODO: ??????????????????????????????
            }else{
                showDndAccountList();
            }
        }
    });
}

//????????????????????????
function cleanLocalStorageData() {
    for (var key in localStorage) {
        if (key.indexOf('idi') >- 1) {
            if (key !== USER_LIST_KEY && key !== CURRENT_USER_KEY){
                localStorage.removeItem(key);
            }
        }
    }
    var b_view = getBackgroundView();
    if (b_view) {
        b_view.tweets = {};
        b_view.MAX_MSG_ID = {};
        b_view.checking={};
        b_view.paging={};
        b_view.RefreshManager.restart();
    }
}

// ??????oauth callback url??????????????????
// https://api.weibo.com/oauth2/default.html?code=c8525b70e8aa5c9ee4ce6c96e8621e75
// facebook:
// https://chrome.google.com/extensions/detail/aicelmgbddfgmpieedjiggifabdpcnln/?code=3362948c9a062a22ef18c6d5-1013655641|T7VuPCHU79f6saU7MiQwHGG_mVc
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading' &&
    (tab.url.indexOf(OAUTH_CALLBACK_URL) === 0 ||
    tab.url.indexOf(OAUTH_CALLBACK_URL2) === 0 ||
    tab.url.indexOf(WeiboAPI2.config.oauth_callback + '?code=') === 0 ||
    tab.url.indexOf(FAWAVE_OAUTH_CALLBACK_URL) === 0 ||
    tab.url.indexOf(GooglePlusAPI.config.oauth_callback) === 0 ||
    tab.url.indexOf(FacebookAPI.config.oauth_callback + '?code=') === 0 ||
    tab.url.indexOf(TQQAPI.config.oauth_callback + '?code=') === 0)) {

    var d = decodeForm(tab.url);
    var pin = d.oauth_verifier || d.code || 'impin';
    if (pin.indexOf('#') > 0) {
      pin = pin.substring(0, pin.indexOf('#'));
    }
    $('#account-pin').val(pin);
    // console.log(tab, tab.url, pin, d);
    $('#save-account').click();
    chrome.tabs.remove(tabId);
  }
});
