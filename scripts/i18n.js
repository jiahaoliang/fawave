/*!
 * fawave - scripts/i18n.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

document.addEventListener('DOMContentLoaded', function () {

  var ids = [ 
    // popup.html
    'comm_emotional', 'comm_pic', 'comm_clear', 'comm_search',
    'comm_search_user', 'comm_longtext', 'comm_new_tweet',
    'comm_TabName_friends_timeline', 'comm_TabName_mentions', 'comm_TabName_comments_mentions',
    'comm_TabName_comments_timeline', 'comm_TabName_direct_messages', 'comm_TabName_favorites',
    'comm_TabName_followers', 'comm_TabName_user_timeline',
    'abb_send_direct_message_to_user', 'comm_my', 'comm_follow', 'comm_fans',
    'comm_emotional', 'comm_send', 'comm_close', 'sett_msg_donate', 'extName',
    // options.html
    'sett_TabName_common_set', 'sett_TabName_appearance_set', 'sett_TabName_user_set',
    'sett_TabName_advanced_set', 'sett_TabName_about', 'sett_btn_add_new_account',
    'sett_btn_update_accounts', 'sett_jTip_update_accounts',
    'sett_tip_add_account', 'sett_des_account_blog_type', 'sett_des_account_appkey',
    'sett_des_account_appkey_diy', 'sett_des_account_appkey', 'sett_des_account_appkey_secret',
    'sett_des_account_proxy_api', 'sett_jTip_account_proxy_api', 'sett_des_account_auth_type',
    'sett_des_account_proxy_api_key', 'sett_jTip_account_proxy_api_key', 'sett_des_account_auth_type',
    'sett_des_account_api_secret', 'sett_jTip_account_custom_secret', 'sett_des_account_auth_type',
    'sett_jTip_account_auth_type', 'sett_des_account_pin', 'sett_btn_get_account_pin',
    'sett_des_account_name', 'sett_des_account_password', 'sett_btn_get_account_save',
    'sett_btn_get_account_cancel', 'sett_jTip_manage_accounts', 'sett_title_account_manage',
    'sett_itemName_g_refresh_time', 'comm_TabName_friends_timeline', 'comm_second',
    'comm_TabName_mentions', 'comm_TabName_comments_timeline', 'comm_TabName_direct_messages',
    'sett_jTip_g_refresh_time', 'comm_show_rate_limit_stat', 'sett_des_g_refresh_time_hits',
    'sett_itemName_set_badge', 'comm_TabName_friends_timeline', 'comm_TabName_mentions',
    'comm_TabName_comments_timeline', 'comm_TabName_direct_messages', 'sett_jTip_set_badge',
    'sett_itemName_show_in_page', 'comm_TabName_friends_timeline', 'comm_TabName_mentions',
    'sett_jTip_show_in_page', 'sett_itemName_sound_alert', 'sett_jTip_sound_alert',
    'sett_itemName_sound_file', 'sett_itemName_destop_alert', 'sett_jTip_destop_alert',
    'sett_itemName_destop_alert_timeout', 'comm_second', 'sett_itemName_show_network_error',
    'sett_jTip_show_network_error', 'sett_itemName_sync_to_page', 'sett_itemDes_sync_to_page',
    'sett_jTip_sync_to_page', 'sett_itemName_send_select', 'sett_send_select_remember',
    'sett_send_select_current', 'sett_send_select_all', 'sett_jTip_send_select',
    'sett_itemName_remember_view_status', 'sett_jTip_remember_view_status',
    'sett_itemName_context_menu', 'sett_jTip_context_menu', 'sett_itemName_quick_send_key',
    'sett_jTip_quick_send_key', 'sett_des_quick_send_key', 'sett_itemName_translate_target',
    'sett_btn_clean_local_storage', 'sett_itemName_default_language', 'sett_itemName_font',
    'sett_itemName_WH', 'comm_height', 'sett_itemName_WH_height_limit', 'comm_width',
    'sett_jTip_WH_width_limit', 'sett_itemName_theme', 'sett_themeName_bubble',
    'sett_themeName_simple', 'sett_btn_save_all', 'sett_title_official',
    'sett_title_author', 'sett_import', 'sett_export', 'sett_itemName_geo',
    'sett_itemName_use_ip_geo', 'sett_itemName_use_browser_geo', 'sett_show_my_geo',
    'sett_jTip_geo', 'sett_itemName_smooth_scroller', 'comm_enabled', 'sett_smooth_scroller_tween',
    'sett_smooth_scroller_ease', 'sett_itemName_shared_template', 'sett_jTip_shared_template',
    'sett_itemName_auto_short_url', 'sett_des_auto_short_url', 'sett_des_auto_short_url_words',
    'sett_des_shorten_url_service', 'sett_itemName_enable_image_service', 'sett_des_image_service_words',
    'sett_des_image_service', 'sett_itemName_instapaper', 'sett_jTip_instapaper', 'sett_des_account_name',
    'sett_des_account_password', 'comm_setting', 'comm_del_user', 'sett_itemName_readitlater',
    'sett_des_account_name', 'sett_jTip_readitlater', 'sett_des_account_password',
    'comm_setting', 'comm_del_user', 'sett_itemName_vdisk', 'sett_jTip_vdisk', 'sett_des_account_name',
    // upimage.html
    'comm_send_success_close_window', 'btn_select_pic_title', 'comm_enter_image_url',
    // longtext.html
    'comm_preview_longtext', 'comm_font_size', 'comm_font_bold', 'comm_font_family',
  ];
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var msg = chrome.i18n.getMessage(id);
    $('span#' + id).html(msg);
    $('.__MSG_' + id).html(msg);
  }

  var attrs = [
    {
      id: 'btnAddEmotional',
      name: 'title',
      message: 'btn_emotional_title'
    },
    {
      id: 'btnUploadPic',
      name: 'title',
      message: 'btn_pic_title'
    },
    {
      id: 'urlShortenBtn',
      name: 'title',
      message: 'comm_url_shorten'
    },
    {
      id: 'btnSend',
      name: 'value',
      message: 'comm_send'
    },
    {
      id: 'btnSend',
      name: 'title',
      message: 'comm_send_tip'
    },
    {
      id: 'btnShowSearch',
      name: 'title',
      message: 'btn_search_title'
    },
    {
      id: 'btnSearch',
      name: 'title',
      message: 'btn_search_title'
    },
    {
      id: 'btnShowSearchUser',
      name: 'title',
      message: 'btn_search_user_title'
    },
    {
      id: 'btnSearchUser',
      name: 'title',
      message: 'btn_search_user_title'
    },
    {
      id: 'btnLongText',
      name: 'title',
      message: 'btn_longtext_title'
    },
    {
      id: 'btnQuickUpImg',
      name: 'title',
      message: 'btn_pic_title'
    },
    {
      id: 'doingWithCapture',
      name: 'title',
      message: 'btn_share_title_with_capture'
    },
    {
      id: 'doing',
      name: 'title',
      message: 'btn_share_title'
    },
    {
      id: 'btnForceRefresh',
      name: 'title',
      message: 'btn_refresh_title'
    },
    {
      id: 'btnNewWinPopup',
      name: 'title',
      message: 'btn_new_win_title'
    },
    {
      id: 'gototop',
      name: 'title',
      message: 'comm_go_to_top'
    },
    {
      id: 'btnFaceBoxClose',
      name: 'title',
      message: 'comm_close'
    },
    {
      id: 'btnAddReplyEmotional',
      name: 'title',
      message: 'btn_emotional_title'
    },
    {
      id: 'replySubmit',
      name: 'title',
      message: 'comm_send_tip'
    },
    {
      id: 'btnSend',
      name: 'value',
      message: 'comm_send'
    },
    {
      id: 'btnSend',
      name: 'title',
      message: 'comm_send_tip'
    },
    {
      id: 'btnPrevLongText',
      name: 'prev_text',
      message: 'comm_preview_longtext'
    },
    {
      id: 'btnPrevLongText',
      name: 'edit_text',
      message: 'comm_edit_longtext'
    },
  ];

  for (var j = 0; j < attrs.length; j++) {
    var attr = attrs[j];
    $('#' + attr.id).attr(attr.name, chrome.i18n.getMessage(attr.message));
  }

});