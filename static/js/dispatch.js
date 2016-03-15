var Dispatch = {
    scenesCls: null,
    loadRs: function (_cbfun) {
        var RsList = [
            {'id': 'hero', 'src': 'static/img/dispatch_bg.jpg'},
            {'id': 'icon', 'src': 'static/img/icon.png'},
            {'id': 'face', 'src': 'static/img/user_face.png'},
            {'id': 'gift_btn', 'src': 'static/img/share_gift_btn.png'},
            {'id': 'activity', 'src': 'static/img/more_activity.png'},
        ];
        var queue = new createjs.LoadQueue();
        queue.on("complete", handleComplete, this);
        queue.on("fileload", handleProgress, this);
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
    start: function () {
        var self = this;
         /*
         * 装载资源
         * */
        self.loadRs(function(){
            $('.container').show();
            $('.share_wrap').show();
            //  $('.lose_share_wrap').show();
        });
    }
}