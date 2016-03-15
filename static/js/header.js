function initRme() {
    setTimeout(function () {
        var win_w = window.innerWidth,
            def_fs = 16,
            def_w = 1080,
            htmlEl = document.getElementsByTagName("html")[0],
            percentage = 1 / def_fs * 100;
        htmlEl.style.fontSize = win_w / (def_w / percentage) * 100 + "%";
    }, 1);
}
initRme();