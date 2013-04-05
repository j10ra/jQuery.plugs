var winW, winH;

$(function () {

    onLoad()
    $(window).resize(function () { reLoad(); })
    $(window).change(function () { reLoad(); })

    $(".thumb-grp div figure:nth-child(4n)").addClass("s1")

});

function reLoad() {
    
}
function onLoad() {
    liveCheck()
    jsNMtable()
    nmTableStriped()
    jsModal();
}

function jsNMtable() {
    $('.jsNMtable').each(function () {
        var th = $(this).find('th');

        th.each(function () {
            $(this).width($(this).attr('data-width'));
        });
    });
}

function nmTableStriped() {
    $('.jsNMtableStriped').each(function () {
        $('tbody > tr:nth-child(odd)', this).addClass('odd').css('background', '#f2f2f2');
        $('tbody > tr:first').addClass('first');
    })
}

function liveCheck() {
    setInterval(function () {
        $('.jsUploadedFile .jsFileName').fileNameTruncate({ length: 14 }).animate({ opacity: 1 }, 1000);

        //Upload story uploaded files
        $('.jsUploadedFile').each(function () {
            $(this).find("li:even").css('background-color', '#f2f2f2');
            $(this).find("li:odd").css('background-color', '#fff');
        });

        $('.jsUploadedFile li .jsFileName').each(function () {
            var label = $(this).text();
            var ext = label.substr(label.lastIndexOf('.'));

            switch (ext) {
                case '.jpg': case '.png': case '.gif': case '.jpeg': case '.tiff': case '.tif': case '.bmp':
                    $(this).prev('i').addClass('cam').animate({ opacity: 1 }, 1000);
                    break;

                case '.3g2': case '.3gp': case '.asf': case '.asx': case '.avi': case '.flv': case '.m2v':
                case '.mov': case '.mp4': case '.mpg': case '.srt': case '.swf': case '.vob': case '.wmv':
                    $(this).prev('i').addClass('vid').animate({ opacity: 1 }, 1000);
                    break;

                default: $(this).prev('i').addClass('wrt').animate({ opacity: 1 }, 1000);
            }
        });
    }, 1);

}