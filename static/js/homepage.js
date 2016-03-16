var tools = {
    countDownTimer: function (_count, _eachCb, _endCb, timeNum) {
        _eachCb = _eachCb || function () {
            };
        _endCb = _endCb || function () {
            };
        timeNum = timeNum || 1000;
        var timer = setInterval(function () {
            _count -= 1;
            if (_count < 0) {
                clearTime();
                _endCb();
                return;
            }
            _eachCb(_count);
        }, timeNum);
        var clearTime = function () {
            clearTimeout(timer);
        }
        return {
            'clear': clearTime,
            'index': _count
        }
    },
    palaySound: function (_id) {
        return createjs.Sound.play(_id);
    },
    formatNum: function (_sec) {
        var str = '';
        if (_sec < 10) {
            str = '0' + _sec;
        } else {
            str = _sec;
        }
        return str;
    },
    formatTime: function (_sec) {
        var str = '', self = this;
        if (_sec < 60) {
            str = '00:' + self.formatNum(_sec);
        } else {
            var int_min = Math.floor(_sec / 60), int_hour = Math.floor(_sec / 3600);
            if (int_hour == 0) {
                str = self.formatNum(int_min) + ':' + self.formatNum((_sec - (int_min * 60)));
            } else {
                int_min = Math.floor((_sec - (int_hour * 3600)) / 60);
                var int_sec = _sec - (int_hour * 3600) - (int_min * 60);
                str = self.formatNum(int_hour) + ':' + self.formatNum(int_min) + ':' + self.formatNum(int_sec);
            }
        }
        return str;
    },
}
var Scenes = function (imgSrc) {
    var page = 1;
    var show = function (_cbfun) {
        _cbfun = _cbfun || function () {
            };
        return renderPage(_cbfun);
    }

    var destroy = function (_page) {
        switch (_page) {
            case 1:
                $(".homepage").remove();
                break;
            case 2:
                $(".bosspage").removeClass("boss1");
                break;
            case 3:
                $(".bosspage").removeClass("boss2");
                break;
        }
    }
    var next = function (_cbfun) {
        destroy(page);
        page = page + 1;
        show(_cbfun);
    };
    var renderPage = function (_cbfun) {
        switch (page) {
            case 1:
                //home
                $(".homepage").addClass("in");
                $(".homepage .hero-block").addClass("in");
                $(".h-img").css({
                    'background': 'url(' + imgSrc + ') no-repeat center center',
                    'background-size': 'cover'
                });
                $(".content-block").addClass("in");
                setTimeout(function () {
                    $(".banner").addClassEx("fireLogo", false, function (obj) {
                        //火焰动画完成后加载红包动画
                        var hblist = $(".hb-block").find("li"), time = 800;
                        hblist.each(function (k, item) {
                            $(item).addClass("in rotateIn" + k, false, function () {
                            }, 'rotateIn');
                        });
                    });
                }, 1300);
                //$(".bosspage").addClass("boss1");
                break
            case 2:
                //boos1
                $(".bosspage").addClass("boss1");
                $(".boss-container").addClass("in");
                //_cbfun();
                _cbfun();
                $(".boss-block").addAnimate("lightSpeedIn", function (e) {

                }, true);
                break
            case 3:
                //boos2
                $(".boss-container").addClass("in");
                $(".bosspage").addClass("boss2");
                $(".boss-block").show().addAnimate("zoomInDown", function () {
                    _cbfun();
                }, true);
                break
            case 4:
                //boos3
                $(".boss-container").addClass("in");
                $(".bosspage").addClass("boss3");
                $(".boss-block").show().addAnimate("flip", function () {
                    $(".bosspage .hero-block").addClass("in");
                    _cbfun();
                }, true);
                break
            default:
                //boos1
                break
        }
    }
    return {
        'show': show,
        'next': next,
        'page': page
    }
}
var Boss = function (_num, _data, _cbfun) {
    var data = _data, num = _num,
        isStart = false,
        timer = null,
        time = 60,
        attackHp = 0,
        bossEl = $(".boss-block"),
        hpEl = $(".hp-bar"),
        timeEl = $(".attack-time"),
        ts = tools;
    /*
     * 触发攻击,这里修改为摇一摇触发..
     * */
    //TODO..
	/*  bossEl.on("click", function () {
        attack();
    })*/
	var SHAKE_THRESHOLD = 800;
		var last_update = 0;
		var x, y, z, last_x, last_y, last_z;       
		function deviceMotionHandler(eventData) {        
		  var acceleration =eventData.accelerationIncludingGravity;
		  var curTime = new Date().getTime();       
		  if ((curTime - last_update)> 300) {                
			  var diffTime = curTime -last_update;
			  last_update = curTime;       
			  x = acceleration.x;
			  y = acceleration.y;
			  z = acceleration.z;       
			  var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;          
				  if (speed > SHAKE_THRESHOLD) {
						attack()
				  }
				  last_x = x;
				  last_y = y;
				  last_z = z;
			}
		}
		if (window.DeviceMotionEvent) {
		  window.addEventListener('devicemotion', deviceMotionHandler, false);
		} else {
		  document.getElementById("dmEvent").innerHTML = "Not supported on your device."
		}		
	
    var attack = function () {
        if (!isStart) {
            return;
        }
        /*
         * 提交造成的伤害
         * */
        attackPost(function (cbData) {
            //更新boss血量
            data.lessHp = cbData.hp;
            data.lessHp -= data.eachAttack;
            //记录造成的伤害
            if (data.lessHp <= 0) {
                timer.clear();
                attactEffect(function () {
                    attactFinsh();
                });

            } else {
                attactEffect();
            }
            attackHp += data.eachAttack

        });
    }
    /*
     * 提交打boss的数据
     * */
    var attackPost = function (_cbfun) {
        /*
         * 提交本次伤害值 data.eachAttack
         * 模拟服务器数据，返回boss的血量
         * */
        //TODO..
        _cbfun({'hp': (data.lessHp - data.eachAttack)});
    }
    var attactEffect = function (_cbfun) {
        _cbfun = _cbfun || function () {
            };
        //boss攻击效果
        ts.palaySound("sound_attack");
        bossEl.addClassEx("attack-boss", true, function (me, e) {
            _cbfun();
        });
        //boss血条变化
        hpEl.css({
            'width': (data.lessHp / data.hp) * 100 + "%"
        })
    }
    var playSound = function (_cbfun) {
        _cbfun = _cbfun || function () {
            };
        //var instance = ts.palaySound("sound_bos" + _num);
        //instance.on("complete", function () {
        //    _cbfun();
        //})
        ts.palaySound("sound_bos" + _num);
        setTimeout(function () {
            _cbfun();
        }, 250)
    }
    var attactFinsh = function () {
        var stu = false;
        isStart = false;
        //clearTimer();
        //判断失败成功
        if (data.lessHp <= 0 && time >= 0) {
            //success
            stu = true;
        } else {
            stu = false;
        }
        /*
         * 封装boss的返回值
         * */
        data.isSuccess = stu;
        //注入boss号
        data.num = num;
        //造成的伤害
        data.attackHp = attackHp;
        var bossDieCls = '';
        switch (num) {
            case 1:
                bossDieCls = "animated zoomOutDown";
                break
            case 2:
                bossDieCls = "animated rotateOutDownRight";
        }
        if (stu) {
            playSound(function () {
                if (bossDieCls != '') {
                    bossEl.addAnimate(bossDieCls, function (me) {
                        me.hide();
                        _cbfun(data);
                    }, true);
                } else {
                    _cbfun(data);
                }
            });
        } else {
            _cbfun(data);
        }

    }
    var countDownT = function (_num, _cbfun) {
        if (_num > 0) {
            comjs.poplayer('<span id ="id_countdownTime" class="countdown-timer">' + _num + '</span>', {'bg_opacity': 0.7}, function (e) {
                var id_countdownTime = $("#id_countdownTime");
                ts.countDownTimer(_num, function (index) {
                    ts.palaySound("sound_countdown");
                    id_countdownTime.addClassEx("toSmall", true, function (e) {
                    });
                    id_countdownTime.html(index);
                }, function () {
                    comjs.poplayerClose('', function () {
                        _cbfun();
                    });
                });
            })
        } else {
            comjs.poplayerClose('', function () {
                _cbfun();
            });
        }
    }
    var start = function (_countDown) {
        $(".hp-bar").css({"width": '100%'});
        timeEl.html(ts.formatTime(time));
        //开始倒计时
        countDownT(_countDown, function () {
            timer = ts.countDownTimer(time, function (index) {
                timeEl.html(ts.formatTime(index));
            }, function () {
                //完成后
                attactFinsh();
            })
            //startTimer();
            isStart = true;
        })
    }
    return {
        'start': start
    }

}
var LOLHOME = {
    scenesCls: null,
    loadRs: function (_cbfun) {
        var RsList = [
            {'id': 'hero', 'src': 'static/img/hero.png'},
            {'id': 'homebg', 'src': 'static/img/home_bg.jpg'},
            {'id': 'icon', 'src': 'static/img/icon.png'},
            {'id': 'bossbg', 'src': 'static/img/boss_bg.jpg'},
            {'id': 'boss', 'src': 'static/img/boss.png'},
        ], i;
        for (i = 0; i < 18; i++) {
            RsList.push({'id': 'firelogo_' + i, 'src': 'static/img/firelogo/Firelogo_' + i + '.png'});
        }
        for (i = 0; i < 9; i++) {
            RsList.push({'id': 'shouji_' + i, 'src': 'static/img/attack/shouji_' + i + '.png'});
        }
        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.on("complete", handleComplete, this);
        queue.on("fileload", handleProgress, this);
        //queue.loadFile();
        RsList.push({id: "sound_bos1", src: "static/sound/1.mp3"});
        RsList.push({id: "sound_bos2", src: "static/sound/2.mp3"});
        RsList.push({id: "sound_bos3", src: "static/sound/3.mp3"});
        RsList.push({id: "sound_start", src: "static/sound/start.mp3"});
        RsList.push({id: "sound_attack", src: "static/sound/arrowshoot.mp3"});
        RsList.push({id: "sound_countdown", src: "static/sound/countdown_1.mp3"});
        queue.loadManifest(RsList);
        function handleComplete() {
            _html_loading.remove();
            _cbfun();
        }

        var count = 0,
            _html_loading = $('.loading-block');
        //$("body").append(_html_loading);
        var noti = $(".loading-progress"), total = 1 + RsList.length, pre_num = parseInt(100 / total, 10);

        function handleProgress(e) {
            count += 1;
            noti.html(Math.floor((count / total) * 100) + '%');
        }
    },
    /*
     * ajax获取数据,成功后调用_cbfun
     * */
    getBossData: function (_cbfun) {
        //TODO...异步请求数据
        //模拟返回数据
        var ajax_cb_data = [];
        ajax_cb_data.push({'hp': 1500, 'eachAttack': 150, 'lessHp': 1500, 'id': 1});
        ajax_cb_data.push({'hp': 2500, 'eachAttack': 250, 'lessHp': 2500, 'id': 2});
        ajax_cb_data.push({'hp': 3500, 'eachAttack': 350, 'lessHp': 3500, 'id': 3});
        _cbfun(ajax_cb_data);
    },
    showhb: function (_level, _cbfun) {
        var title = '', world = '';
        switch (_level) {
            case 1:
                title = '第一关';
                break;
            case 2:
                title = '第二关';
                break;
            case 3:
                title = '第三关';
                world = '<span class="hb-notice">恭喜击败所有敌人，点击进入结算页面 </span>';
                break;
        }

        comjs.poplayer(' <div class="hb-block in mask"><ul style="height:' + $(window).height() + 'px">' + world + ' <li style="bottom:' + ($(window).height() / 2) + 'px" class="in"><span class="desc">' + title + '<br>团队红包</span><span class="num-icon icon' + _level + '"></span></li></ul></div>', {'bg_opacity': 0.4}, function (e) {
            var liEl = $(".hb-block.mask li.in"), liElH = liEl.height(), bottom = ($(window).height() / 2) - (liElH / 2);
            liEl.css({
                'bottom': bottom + "px"
            });
            if (_level == 3) {
                $(".hb-notice").css({
                    'bottom': bottom + liElH + 20 + "px"
                })
            }
            $(".hb-block.mask ul").one("click", function () {
                if (_level === 3) {
                    comjs.poplayerClose('', function () {
                        _cbfun()
                    })
                } else {
                    liEl.addClassEx('rotateOut' + _level, false, function () {
                        comjs.poplayerClose('', function () {
                            _cbfun()
                        })
                    }, 'rotateOut1');
                }
            })
        })
    },
    goToShare: function (_type) {
        if (_type == 1) {
            window.location.href = "dispatch.html";
        } else {
            window.location.href = "fail.html";
        }
    },
    start: function () {				
		
		var self = this;
        /*
         * 装载资源
         * */
        self.loadRs(function () {
            //TODO..获取参与人的信息，以及服务器返回的游戏开始时间
            /*header img */
            var imgSrc = 'http://g.pic.wemepi.com/data.x/2015/7/18/10/11/5/c/3/a/1/7/c3a17b36a05be1de43e950328b7b38f2.jpg',
            //游戏开始时间(秒)
                countDownTime = 6;
            self.scenesCls = new Scenes(imgSrc);
            var scenes = self.scenesCls;
            scenes.show();
            var timeEl = $(".less-time");
            timeEl.html(tools.formatTime(countDownTime));
            var timerObj = tools.countDownTimer(countDownTime, function (index) {
                //距离boss开始3秒播放音乐
                if (index == 3) {
                    tools.palaySound('sound_start');
                }
                timeEl.html(tools.formatTime(index));
            }, function () {
                self.getBossData(function (cbData) {
                    //切换下一个场景
                    scenes.next(function () {
                        /*
                         * 打boss结束后的回调函数
                         * @param obj
                         * obj.num        //当前是那个BOSS。 1,2,3
                         * obj.isSuccess  true在规定时间内boss没有血了
                         *                false时间到了
                         * obj.attackHp   对boss造成的伤害
                         * 还有new Boss时，传入的数据也会返回
                         * {'hp': 1500, 'eachAttack': 150, 'lessHp': 1500, 'id': 1}
                         * */
                        var bossCb = function (obj) {
                            var lessTime = 10, countDown_num = 10, tmpbos = null, cbT = null;
                            /*
                             * 判断对boss造成伤害但是时间到了的情况。
                             * */
                            if (!obj.isSuccess) {
                                if (obj.attackHp <= 0) {
                                    //失败跳转页面
                                    self.goToShare(0);
                                } else {
                                    alert('当前BOSS为' + obj.num + '即将跳转页面');
                                    self.goToShare(1);
                                    //失败跳转页面
                                }

                                return;
                            }
                            switch (obj.num) {
                                case 1:
                                    tmpbos = bos2;
                                    break;
                                case 2:
                                    tmpbos = bos3;

                                    break;
                                case 3:
                                    break;
                            }
                            //成功弹出红包，点击红包后调用回调函数
                            self.showhb(obj.num, function () {
                                //如果开启了定时器，清除
                                if (cbT != null) {
                                    cbT.clear();
                                }
                                //如果临时boss对象不为空则调用,为空说明是最后一个BOSS
                                if (tmpbos != null) {
                                    scenes.next(function () {
                                        tmpbos.start(lessTime);
                                    });

                                } else {
                                    self.goToShare(1);
                                    //alert("跳转到分享页");
                                }
                            });
                            //如果不是最后一个BOSS，开启一个定时器在一定时间内自动跳转
                            if (obj.num !== 3) {
                                //开始一个定时器
                                cbT = tools.countDownTimer(countDown_num, function (index) {
                                    lessTime = index;
                                }, function () {
                                    if (tmpbos != null) {
                                        scenes.next(function () {
                                            tmpbos.start(lessTime);
                                        });

                                    }
                                })
                            }
                        }
                        var bos1 = new Boss(1, cbData[0], bossCb);
                        var bos2 = new Boss(2, cbData[1], bossCb);
                        var bos3 = new Boss(3, cbData[2], bossCb);
                        bos1.start(0);
                    });
                })

            })

        });
    }
}
