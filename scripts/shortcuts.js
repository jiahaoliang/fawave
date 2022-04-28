/*!
 * fawave - js/shortcuts.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Shortcuts defines: https://github.com/fengmk2/fawave_desktop/issues/3
 * 
 * Base on [Keypress](http://dmauro.github.com/Keypress/).
 * Support [vim basic shortcuts](http://shortcutkeys.org/software-shortcuts/linux/vim).
 * 
 */


/**
 * 
<cheatsheet>
<pre>
# Shortcuts Cheat Sheet

## Global
* i: show text input. Hide it when it opened.
* m: show shortcuts cheat sheet.
* esc: exit the input mode, close the opening dialog and preview popbox.
* f s: search status
* f u: search user

## Account

* < or >: change user
* shift + (1, 2, 3, 4, ..., 6): top 7 user from left to right
* shift + (0, 9, 8, 7): top 4 user from right to left, zero meaning last user

## Timeline View

* h: left tab
* l: right tab
* j: down, next status view
* k: up, prev status view
* ctrl + f: next timeline page
* ctrl + b: prev timeline page
* shift + g: go to the bottom
* g + g: go to the top
* shift + r: refresh current tab
* 1, 2, 3, 4, 5: change tab from left to right, top 5
* 0, 9, 8, 7: change tab from right to left, top 4, zero meaning the last tab

## Status

* s + c: show status comments
* s + r: show status reposts
* s + o + c: show original status comments
* s + o + r: show original status reposts
* s + p: show preview current status's photo, including repost.
* s + o + p: show origianl photo.
* s + u: show status user
* s + o + u: show origianl status user

## User

 * u + f: follow the user
 * u + u + f: unfollow the user
 * u + t: my user timeline

## Comment list Paging

* ctrl + n: next page
* ctrl + p: prev page

## Operations

* a + c: add comment for current status
* a + r: add repost for current status
* a + f: favorite current status
* a + n + f: unfavorite current status
* a + o + f: favorite origianl status
* a + n + o + f: unfavorite origianl status
* a + d: add direct message to current status' user

</pre>
</cheatsheet> 
 *
 */

$(function () {

  function getCurrentWrap() {
    // var timeline = $('.tabs .active').data('type');
    // var wrap = $('#' + timeline + '_timeline .list_warp');
    var timeline = $('.tabs .active').attr('href');
    var wrap = $(timeline + ' .list_warp');
    return wrap;
  }

  function findCurrentStatusView() {
    var wrap = getCurrentWrap();
    // var hoverItem = wrap.find('li.tweetItem:hover');
    var items = wrap.find('li.tweetItem');
    var scrollTop = wrap.scrollTop();
    var ele = null;
    var height = wrap.find('.userinfo_detail').height() || 0;
    items.each(function (i) {
      var e = $(this);
      height += e.height();
      if (scrollTop < height) {
        ele = e;
        return false;
      }
    });
    return {
      ele: ele || items,
      top: ele ? height - ele.height() : 0
    };
  }

  function prevStatus() {
    var current = findCurrentStatusView();
    var prev = current.ele.prev();
    if (prev.length) {
      prev.find('.edit').show();
      current.ele.find('.edit').removeAttr('style');
    } else {
      current.ele.find('.edit').show();
    }
    var height = prev.height();
    getCurrentWrap().scrollTop(current.top - height);
  }

  function nextStatus() {
    var current = findCurrentStatusView();
    current.ele.find('.edit').removeAttr('style');
    current.ele.next().find('.edit').show();
    var height = current.ele.height();
    getCurrentWrap().scrollTop(current.top + height);
  }

  function nextPage() {
    var wrap = getCurrentWrap();
    wrap.scrollTop(wrap.scrollTop() + wrap.height());
  }

  function prevPage() {
    var wrap = getCurrentWrap();
    wrap.scrollTop(wrap.scrollTop() - wrap.height());
  }

  function goBottom() {
    var wrap = getCurrentWrap();
    var scrollHeight = wrap.prop('scrollHeight') - wrap.height();
    wrap.scrollTop(scrollHeight);
  }

  function globalPreCondition() {
    return $('#submitWarp').css('height') === '0px' && $('#ye_dialog_window').is(':hidden') &&
      !$('.txtSearch:visible').is(':focus');
  }

  var binds = {
    // format: key: {
    //   [precondition]: precondition for key press take effect
    //   type: 'sequence_combo' or 'combo'
    //   selecter: '#css selecter',
    //   method: 'click',
    //   handler: handler function
    // }
    
    // Global
    'i': {
      // selecter: '#show_status_input',
      selecter: '#show_status_input, .toogleMsgInput_btn',
      method: 'click',
    },
    'm': {
      selecter: '#scs',
      method: 'click',
    },
    'escape': {
      precondition: function () {
        return true;
      },
      handler: function () {
        if ($('#submitWarp').css('height') !== '0px') {
          $('#show_status_input, .toogleMsgInput_btn').click();
        }
        if (!$('#ye_dialog_window').is(':hidden')) {
          $('#ye_dialog_close').click();
        }
        $('.comments').hide();
        $('#popup_box .pb_close').click();

        $('.searchWrap').hide();
      }
    },

    // Account
    'left': {
      selecter: '#accountListDock li.current:prev()',
      method: 'click'
    },
    'right': {
      selecter: '#accountListDock li.current:next()',
      method: 'click'
    },
    // top 10 account
    '!': {
      selecter: '#accountListDock li:eq(0) .changeUserBtn',
      method: 'click',
    },
    '@': {
      selecter: '#accountListDock li:eq(1) .changeUserBtn',
      method: 'click',
    },
    '#': {
      selecter: '#accountListDock li:eq(2) .changeUserBtn',
      method: 'click',
    },
    '$': {
      selecter: '#accountListDock li:eq(3) .changeUserBtn',
      method: 'click',
    },
    '%': {
      selecter: '#accountListDock li:eq(4) .changeUserBtn',
      method: 'click',
    },
    '^': {
      selecter: '#accountListDock li:eq(5) .changeUserBtn',
      method: 'click',
    },
    // shift 7
    '&': {
      selecter: '#accountListDock li:eq(-4) .changeUserBtn',
      method: 'click',
    },
    '*': {
      selecter: '#accountListDock li:eq(-3) .changeUserBtn',
      method: 'click',
    },
    '(': {
      selecter: '#accountListDock li:eq(-2) .changeUserBtn',
      method: 'click',
    },
    ')': {
      selecter: '#accountListDock li:eq(-1) .changeUserBtn',
      method: 'click',
    },

    // Timeline View
    'h': {
      selecter: '.tabs .active:prev(.timeline_tab)',
      method: 'click'
    },
    'j': {
      handler: nextStatus
    },
    'k': {
      handler: prevStatus
    },
    'l': {
      selecter: '.tabs .active:next(.timeline_tab)',
      method: 'click'
    },
    'shift r': {
      selecter: '.tabs .active',
      method: 'click'
    },
    'g g': {
      selecter: '#gototop',
      method: 'click',
      type: 'sequence_combo'
    },
    'shift g': {
      handler: goBottom,
      type: 'sequence_combo'
    },
    'ctrl f': {
      handler: nextPage
    },
    'ctrl b': {
      handler: prevPage
    },
    '1': {
      selecter: '.tabs .timeline_tab:visible:eq(0)',
      method: 'click',
    },
    '2': {
      selecter: '.tabs .timeline_tab:visible:eq(1)',
      method: 'click',
    },
    '3': {
      selecter: '.tabs .timeline_tab:visible:eq(2)',
      method: 'click',
    },
    '4': {
      selecter: '.tabs .timeline_tab:visible:eq(3)',
      method: 'click',
    },
    '5': {
      selecter: '.tabs .timeline_tab:visible:eq(4)',
      method: 'click',
    },

    '7': {
      selecter: '.tabs .timeline_tab:visible:eq(-4)',
      method: 'click',
    },
    '8': {
      selecter: '.tabs .timeline_tab:visible:eq(-3)',
      method: 'click',
    },
    '9': {
      selecter: '.tabs .timeline_tab:visible:eq(-2)',
      method: 'click',
    },
    '0': {
      selecter: '.tabs .timeline_tab:visible:eq(-1)',
      method: 'click',
    },

    // Status
    's c': {
      selecter: 'currentStatus() .commentCounts a:first',
      method: 'click',
      type: 'sequence_combo'
    },
    's o c': {
      selecter: 'currentStatus() .retweeted .commentCounts a',
      method: 'click',
      type: 'sequence_combo'
    },
    's r': {
      selecter: 'currentStatus() .repostCounts a:first',
      method: 'click',
      type: 'sequence_combo'
    },
    's o r': {
      selecter: 'currentStatus() .retweeted .repostCounts a',
      method: 'click',
      type: 'sequence_combo'
    },
    's p': {
      selecter: 'currentStatus() .thumbnail_pic:first',
      event: {type: 'mousedown', which: 1},
      type: 'sequence_combo'
    },
    's o p': {
      selecter: 'currentStatus() .thumbnail_pic:first',
      event: {type: 'mousedown', which: 3},
      type: 'sequence_combo'
    },
    's u': {
      selecter: 'currentStatus() .getUserTimelineBtn:first',
      method: 'click',
      type: 'sequence_combo'
    },
    's o u': {
      selecter: 'currentStatus() .retweeted .getUserTimelineBtn:first',
      method: 'click',
      type: 'sequence_combo'
    },

    // Search
    'f s': {
      selecter: '#btnShowSearch:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'f u': {
      selecter: '#btnShowSearchUser:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },

    // Operations
    'a c': {
      selecter: 'currentStatus() .commenttweet:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'a o c': {
      selecter: 'currentStatus() .commenttweet:eq(1)',
      method: 'click',
      type: 'sequence_combo'
    },
    'a r': {
      selecter: 'currentStatus() .reposttweet:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'a o r': {
      selecter: 'currentStatus() .reposttweet:eq(1)',
      method: 'click',
      type: 'sequence_combo'
    },
    'a f': {
      selecter: 'currentStatus() .li_wrap .add_favorite_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'a o f': {
      selecter: 'currentStatus() .retweeted .add_favorite_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'a n f': {
      selecter: 'currentStatus() .li_wrap .del_favorite_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'a n o f': {
      selecter: 'currentStatus() .retweeted .del_favorite_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    // 'a d': {
    //   selecter: 'currentStatus() .li_wrap .add_favorite_btn:first',
    //   method: 'click',
    //   type: 'sequence_combo'
    // },
    
    // Paging
    'ctrl n': {
      selecter: 'currentStatus() .comments:not(:hidden) .next_page:visible:first',
      method: 'click',
    },
    'ctrl p': {
      selecter: 'currentStatus() .comments:not(:hidden) .pre_page:visible:first',
      method: 'click',
    },

    // User
    'u f': {
      selecter: '.userinfo_detail .follow_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'u n f': {
      selecter: '.userinfo_detail .unfollow_btn:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
    'u t': {
      selecter: '.user .name_link:visible:first',
      method: 'click',
      type: 'sequence_combo'
    },
  };

  function trigger(ele, item) {
    if (item.event) {
      ele.trigger(item.event);
    } else {
      ele[item.method]();
    }
  }

  Object.keys(binds).forEach(function (keys) {
    var item = binds[keys];
    var m = item.type || 'combo';
    keypress[m](keys, function () {
      var precondition = item.precondition || globalPreCondition;
      if (!precondition()) {
        return;
      }

      if (item.handler) {
        item.handler();
        return false;
      }

      var selecter = item.selecter;
      // expression selecter will compile at the first time. 
      if (selecter.indexOf(':prev(') > 0) {
        var prevIndex = selecter.indexOf(':prev(');
        item.selecter1 = selecter.substring(0, prevIndex);
        item.selecter2 = selecter.substring(prevIndex + 6, selecter.lastIndexOf(')'));
        item.handler = function () {
          var e = $(this.selecter1).prevAll(this.selecter2 + ':visible:first');
          if (e.length === 0) {
            e = $(this.selecter1).siblings(this.selecter2 + ':visible:last');
          }
          trigger(e, this);
        };
        item.handler();
        return false;
      }
      if (selecter.indexOf(':next(') > 0) {
        var nextIndex = selecter.indexOf(':next(');
        item.selecter1 = selecter.substring(0, nextIndex);
        item.selecter2 = selecter.substring(nextIndex + 6, selecter.lastIndexOf(')'));
        item.handler = function () {
          var e = $(this.selecter1).nextAll(this.selecter2 + ':visible:first');
          if (e.length === 0) {
            e = $(this.selecter1).siblings(this.selecter2 + ':visible:first');
          }
          trigger(e, this);
        };
        item.handler();
        return false;
      }
      if (selecter.indexOf('currentStatus()') >= 0) {
        item.selecter = selecter.replace('currentStatus()', '');
        item.handler = function () {
          var current = findCurrentStatusView().ele;
          var e = current.find(this.selecter);
          trigger(e, this);
        };
        item.handler();
        return false;
      }

      trigger($(selecter), item);
      return false;
    });
  });

});
