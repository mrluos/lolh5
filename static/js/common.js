$(function () {
    $.fn.addAnimate = function (s_name, cbfun, _del) {
        var me = this;
        if (_del === '' || _del === undefined) {
            _del = true;
        }
        if (s_name) {
            s_name = s_name.replace('infinite', '');
            me.addClass("animated " + s_name);
            /*
             * 动画完成后删除传入的动画class.,这里注意的是css的Class名字要和动画的名字一致
             * 例如：
             *   s_name传入的类名字为 toBig,那么这个类里用到的animate也要用和这个名字，即@keyframes toBig
             * */
            me.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
                if (s_name.indexOf(e.animationName) != -1) {
                    me.unbind("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend");
                    if (_del) {
                        me.removeClass("animated " + s_name);
                    }
                    cbfun && cbfun(me, e);
                }
            });
        } else {
            cbfun && cbfun(me, null);
        }
    }
    /**
     *
     * @param _class
     * @param _del
     * @param _cbfun
     * @param _animateN 动画的名字，如果不传就使用_class
     */
    $.fn.addClassEx = function (_class, _del, _cbfun, _animateN) {
        var me = $(this),
            cbfun = _cbfun || function () {
                };
        _animateN = _animateN || '';
        if (_del === '' || _del === undefined) {
            _del = true;
        }
        me.addClass(_class);
        /*
         * 动画完成后删除传入的动画class.,这里注意的是css的Class名字要和动画的名字一致
         * 例如：
         *   _class传入的类名字为 toBig,那么这个类里用到的animate也要用和这个名字，即@keyframes toBig
         * */
        me.on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
            var tmp = _class;
            if (_animateN != '') {
                tmp = _animateN;
            }
            if (tmp.indexOf(e.animationName) != -1) {
                me.unbind("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend");
                if (_del) {
                    me.removeClass(_class);
                }
                cbfun(me, e);
            }
        });
    }
})
var comjs = {
    /**
     *
     * @param _list img 的图片资源
     * @param _cbfun 加载完成后的回调
     * @param notice_seletor 提示语的seletor
     */
    loadResources: function (_list, _cbfun) {
        _cbfun = _cbfun || function () {
            };
        if (_list.length == 0) {
            _cbfun();
            return;
        }
        var load = {
            len: 0,
            _html_loading: null,
            init: function (imglist, cbfun) {
                var This = this;
                $(".loading-block").remove();
                var _html_loading = $('<div class="loading-block"><p class="loading-icon"></p><p class="loading-progress">0%</p></div>');
                $("body").append(_html_loading);
                This._html_loading = _html_loading;
                This.len = imglist.length;
                var total = This.len, noti = $(".loading-progress"), pre_num = parseInt(100 / total, 10);
                noti.html(0 + '%');
                for (var i = 0; i < total; i++) {
                    $('<img src="' + imglist[i] + '">').bind("load", {'total': total}, function (e) {
                        var total = e.data.total * 1;
                        $(this).unbind("*");
                        $(this).remove();
                        This.len = This.len - 1;
                        if (This.len == 0) {
                            noti.html('100%');
                            This.call_cbfun(cbfun);
                            return;
                        }
                        noti.html((total - This.len ) * pre_num + '%');
                    }).bind("error", null, function (e) {
                        This.len -= 1;
                        if (This.len == 0) {
                            noti.html('100%');
                            This.call_cbfun(cbfun);
                        }
                    });
                }
            },
            call_cbfun: function (_fun) {
                //平滑过渡
                setTimeout(function () {
                    load._html_loading && load._html_loading.remove();
                    _fun()
                }, 500);
            }
        }
        load.init(_list, _cbfun);
    },
    poplayerClose: function (e_animate, cbfun) {
        var me = $(".comm_poplayer");
        $(".poplayer-loading").unbind("*").remove();
        if ('' == e_animate) {
            me.addAnimate(e_animate, function () {
                me.unbind("*");
                me.remove();
            })
        } else {
            me.unbind("*");
            me.remove();
        }
        if (cbfun)cbfun();
    },
    poplayer: function (content, _o, cbfun) {
        if (content == '' || content == undefined) {
            return;
        }
        $(".poplayer-loading").remove();
        $(".comm_poplayer").remove();
        var o_def = {
                'static': true, /*false时点击遮罩层关闭弹出层*/
                'cbfun': false, /*节点加入后的回调函数*/
                's_animate': 'bounceInDown', /*开始的的动画*/
                'e_animate': 'bounceOutup', /*结束的动画*/
                'bg_opacity': 0.8, /*遮罩层的透明度*/
                'offsetTop': -1,
            },
            o = $.extend(o_def, _o);
        this.poplayerClose();
        var _html = '', _loading = $('<div class="poplayer-loading"></div>');
        $("body").append(_loading);
        _loading.focus();
        _loading.css({"height": $(window).height(), "opacity": o.bg_opacity, "overflow": "hidden"});
        if ('object' == typeof content) {
            _html = $('<div class="comm_poplayer"><div class="poplayer-content"></div></div>');
            $("body").append(_html);
            $(".poplayer-content").append(content);
        } else {
            _html = $('<div class="comm_poplayer"><div class="poplayer-content">' + content + '</div></div>');
            $("body").append(_html);
        }
        var offset_top = o.offsetTop;
        if (offset_top == -1) {
            offset_top = ($(window).height() - _html.height() * 1) / 2;
        }
        _html.css({
            'left': ($(window).width() - _html.width() * 1) / 2 + 'px',
            'top': offset_top + 'px'
        })
        cbfun();
        _loading.on("click", {stu: o.static}, function (e) {
            if (e.data.stu == false) {
                $(".comm_poplayer").unbind("*");
                $(".comm_poplayer").remove();
            }
        })
    }

}

