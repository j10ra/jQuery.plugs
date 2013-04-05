/* 
jQuery Multiple Modal Plugin

Copyright (c) 2013 jetz Alipalo (jetz@sleeckut.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function jsModal() {

    var _zIndex = 9999,
        modal = $('.window');

    modal.each(function () {
        var modal = $(this),
        header = '<header><label>' + modal.attr('title') + '</label></header>'

        modal.width(modal.data('width'))
        .css({
            'left': 'auto',
            'right': '50%',
            'top': '50%',
            'margin-right': -1 * $(modal).outerWidth() / 2,
            'margin-top': -1 * $(modal).outerHeight() / 2
        })
        .find('> div').prepend(header)
        .find('header').prepend('<i class="closeThis"/>')
    });


    //open modal
    $('[data-callmodalid]').on('click', function (e) {
        e.preventDefault();

        var modalCount = $('.window.modalCount').length;

        modalID = '#' + $(this).data('callmodalid');

        if ($(modalID).length) {
            $(modalID).fadeIn(300).addClass('modalCount').css('z-index', _zIndex + modalCount);

            $('.modal-mask').fadeTo("fast", 0.5).css('z-index', _zIndex + modalCount);
        } else {
            alert("Target modal can't be found")
        }
    });


    //close modal
    $('.closeThis').on('click', function () {

        var modalCount = $('.window.modalCount').length;
        if (modalCount == 1) {
            $('.modal-mask').fadeTo("fast", 0).css('display', 'none');
        } else {
            var currentZ = _zIndex + modalCount;
            $('.modal-mask').css('z-index', currentZ - 2);
        }
        $(this).parents('.window').css('display', 'none').removeClass('modalCount');
    })


}