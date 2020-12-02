HTML

<img alt="" src="//puui.qpic.cn/vupload/0/20180822_sukan_loading.png/0" errsrc="//i.gtimg.cn/qqlive/images/20150608/pic_h.png>
 

JS

try {
    window.addEventListener('error', function (event) {
        imageErrorHandler(event);
    }, true);

} catch (error) {}

function imageErrorHandler(event) {
    if (event && event.target && event.target.nodeName && event.target.nodeName.toLowerCase() == "img") {
        var dsrc = getDefaultPic(event.target);
        console.log('bad img source: ' + event.target.src);
        if (dsrc && dsrc !== event.target.src) { // 防止当默认图片也出错时，有死循环
            var tmpImage = new Image();
            tmpImage.src = dsrc;
            tmpImage.onload = function () {
                tmpImage = null;
                event.target.src = dsrc;
            };
        }

    }
}

function getDefaultPic(imgdom) {
    if (imgdom.getAttribute('errsrc')) {
        return imgdom.getAttribute('errsrc')
    } else {
        return ''
    }
}