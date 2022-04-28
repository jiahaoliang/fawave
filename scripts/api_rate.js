
$(function () {
    document.title = _u.i18n('comm_show_rate_limit_stat') + ' -- ' + _u.i18n('defaultTitle');

    $('.tpl-wrapper').each(function (i) {
        var $this = $(this);
        var key = $this.text();
        $this.text(_u.i18n(key)).show();
    });

    var tr_tp = '<tr id="user_{{uniqueKey}}"><td><img class="icon" src="{{profile_image_url}}" />{{screen_name}}</td>\
  <td><img src="images/blogs/{{blogType}}_16.png"/>{{blogType}}</td>\
  <td><img src="images/loader.gif"/></td>\
  <td></td><td></td></tr>';
    //防止闭包变量共享
    function handlerRateCheck(user_in) {
        var user = user_in;
        var data = { user: user };
        tapi.rate_limit_status(data, function (data, textStatus, errorCode) {
            if (data && data.hourly_limit) {
                $("#user_" + user.uniqueKey + " td:eq(2)").html(data.remaining_hits + ' / ' + data.hourly_limit);
                if (data.ip_limit) {
                    $("#user_" + user.uniqueKey + " td:eq(3)").html(data.remaining_ip_hits + ' / ' + data.ip_limit);
                }
                $("#user_" + user.uniqueKey + " td:eq(4)").html(new Date(data.reset_time).format("yyyy-MM-dd hh:mm:ss"));
            } else {
                $("#user_" + user.uniqueKey + " td:eq(2)").html('<span class="error">' + data.error + '</span>');
            }
        });
    }
    function getRateLimits() {
        var userList = getUserList();
        var tbody = $("#rateLimitTable tbody");
        tbody.html('');
        for (var i in userList) {
            var user = userList[i];
            tbody.append(tr_tp.format(user));
            handlerRateCheck(user);
        }
    }

    getRateLimits();

    $('#refreshBtn').click(function (e) {
        e.preventDefault();
        getRateLimits();
    });


    chrome.extension.sendRequest({ method: 'activelog', active: 'api_rate_limit' });
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-19689660-1']);
    _gaq.push(['_trackPageview']);

    function initGA() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    }

    //initGA();
});