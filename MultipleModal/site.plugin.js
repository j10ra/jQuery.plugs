
// Custom Newsmodo Form
(function ($) {
    $.fn.newsmodoForm = function (options) {
        var settings = $.extend({
        }, options);

        return this.each(function () {
            var form = $(this),
                textbox = form.find(':text'),
                textarea = form.find('textarea'),
                select = form.find('select');

            form.addClass('newsmodoForm')
            .attr('autocomplete', 'off').show().animate({ opacity: 1 }, 500);

            //Textbox
            textbox.each(function () {
                var elem = $(this);
                elem.wrap('<span class="inputbox" />');

                if (elem.hasClass('jsDateField')) {
                    elem.parent('span').addClass('date-field');
                } else if (elem.hasClass('jsTimeField')) { elem.parent('span').addClass('time-field') }

                elem.formDefault();

                if (elem.attr('data-readonly') == 'true') {
                    elem.attr('readonly', 'readonly').parent().addClass('readOnly')
                } else { elem.formState() };

                if (elem.attr('data-icon') == 'magnify') {
                    elem.parent().css('position', 'relative')
                    elem.after('<i class="icn-sprite magnify"></i>')
                }
            });

            //Textarea 
            textarea.each(function () {
                var elem = $(this);
                elem.wrap('<span class="textarea" />');
                elem.formDefault(); elem.formState(); elem.autosize();

                elem.css('min-height', elem.attr('data-minHeight'));
            });

            //Select
            select.each(function () {
                var elem = $(this);


                if (elem.attr('disabled')) {
                    elem.wrap('<span class="select disabled" />').fadeTo(0, 0);
                } else {
                    elem.wrap('<span class="select" />').fadeTo(0, 0);
                }

                var _select = elem.parent('.select');

                _select.prepend('<label></label><i><span>▼</span></i>')
                .find("label").text($(this).find("option:selected").text());

                elem.change(function () { _select.find("label").text($(this).find("option:selected").text()) });

                elem.formState()

            });


            $('.newsmodoForm :checkbox, .newsmodoForm :radio').each(function () {
                var elem = $(this), label = elem.attr('id');

                $('[for="' + label + '"]').hover(function () {
                    elem.parent('span').addClass('hover')
                }, function () { elem.parent('span').removeClass('hover') });
                $('[for="' + label + '"]').each(function () { $(this).addClass('elem-label') })

                elem.focus(function () {
                    elem.parent('span').addClass('focus')
                }).blur(function () { elem.parent('span').removeClass('focus') });

                if (elem.is(':radio')) {
                    elem.wrap('<span class="radio" />')
                } else { elem.wrap('<span class="checkbox" />') };

                elem.hover(function () {
                    $(this).parent('span').addClass('hover');
                }, function () { $(this).parent('span').removeClass('hover'); })

                .bind('updateState', function () {
                    if (elem.is(':checked')) {
                        if (elem.is(':radio')) {
                            $('input[type="radio"][name="' + $(this).attr('name') + '"]').parent().removeClass('checked');
                        } elem.parent().addClass('checked');
                    } else { elem.parent().removeClass('checked') }
                })
                .trigger('updateState').click(function () { $(this).trigger('updateState') });

            });

        });
    }

})(jQuery);



//customForm Defaults
(function ($) {
    $.fn.formDefault = function () {
        var elem = $(this);
        if (elem.val() == "") { elem.val(elem.attr('data-default')) }
        else if (elem.val() !== elem.attr('data-default')) { elem.parent().addClass('filled') };
        if (elem.is(':disabled')) { elem.parent().addClass('disabled') };
    }
})(jQuery);



//customForm States
(function ($) {
    $.fn.formState = function () {
        var elem = $(this);

        elem.focus(function () {
            if (elem.val() == elem.attr('data-default')) { elem.val(elem.attr('""')) }
            elem.parent('span').addClass('focus');
        })
        elem.blur(function () {
            elem.parent('span').removeClass('focus');
            if (elem.val() == '') { elem.val(elem.attr('data-default')) };
            if (elem.val() !== elem.attr('data-default')) {
                elem.parent('span').addClass('filled')
            } else { elem.parent('span').removeClass('filled') }
        });
    }
})(jQuery);



//Textarea auto resize
(function ($) {
    var
	defaults = {
	    className: 'autosizejs',
	    append: '',
	    callback: false
	},
	hidden = 'hidden',
	borderBox = 'border-box',
	lineHeight = 'lineHeight',

	copy = '<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',

	copyStyle = [
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textTransform',
		'wordSpacing',
		'textIndent'
	],
	oninput = 'oninput',
	onpropertychange = 'onpropertychange',

	mirrored,

	mirror = $(copy).data('autosize', true)[0];

    mirror.style.lineHeight = '99px';
    if ($(mirror).css(lineHeight) === '99px') {
        copyStyle.push(lineHeight);
    }
    mirror.style.lineHeight = '';

    $.fn.autosize = function (options) {
        options = $.extend({}, defaults, options || {});

        if (mirror.parentNode !== document.body) {
            $(document.body).append(mirror);
        }

        return this.each(function () {
            var
			ta = this,
			$ta = $(ta),
			minHeight,
			active,
			resize,
			boxOffset = 0,
			callback = $.isFunction(options.callback);

            if ($ta.data('autosize')) {
                return;
            }

            if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox) {
                boxOffset = $ta.outerHeight() - $ta.height();
            }

            minHeight = Math.max(parseInt($ta.css('minHeight'), 10) - boxOffset, $ta.height());

            resize = ($ta.css('resize') === 'none' || $ta.css('resize') === 'vertical') ? 'none' : 'horizontal';

            $ta.css({
                overflow: hidden,
                overflowY: hidden,
                wordWrap: 'break-word',
                resize: resize
            }).data('autosize', true);

            function initMirror() {
                mirrored = ta;
                mirror.className = options.className;

                $.each(copyStyle, function (i, val) {
                    mirror.style[val] = $ta.css(val);
                });
            }

            function adjust() {
                var height, overflow, original;

                if (mirrored !== ta) {
                    initMirror();
                }

                if (!active) {
                    active = true;
                    mirror.value = ta.value + options.append;
                    mirror.style.overflowY = ta.style.overflowY;
                    original = parseInt(ta.style.height, 10);

                    mirror.style.width = Math.max($ta.width(), 0) + 'px';

                    mirror.scrollTop = 0;
                    mirror.scrollTop = 9e4;
                    height = mirror.scrollTop;

                    var maxHeight = parseInt($ta.css('maxHeight'), 10);

                    // Opera returns '-1px' when max-height is set to 'none'.
                    maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;
                    if (height > maxHeight) {
                        height = maxHeight;
                        overflow = 'scroll';
                    } else if (height < minHeight) {
                        height = minHeight;
                    }
                    height += boxOffset;
                    ta.style.overflowY = overflow || hidden;

                    if (original !== height) {
                        ta.style.height = height + 'px';
                        if (callback) {
                            options.callback.call(ta);
                        }
                    }

                    setTimeout(function () {
                        active = false;
                    }, 1);
                }
            }

            if (onpropertychange in ta) {
                if (oninput in ta) {

                    ta[oninput] = ta.onkeyup = adjust;
                } else {
                    // IE7 / IE8
                    ta[onpropertychange] = adjust;
                }
            } else {
                // Modern Browsers
                ta[oninput] = adjust;
            }

            $(window).on('resize', function () {
                active = false;
                adjust();
            });

            // Allow for manual triggering if needed.
            $ta.on('autosize', function () {
                active = false;
                adjust();
            });

            // Call adjust in case the textarea already contains text.
            adjust();
        });
    };
})(jQuery);


//Truncate file name
(function ($) {
    $.fn.fileNameTruncate = function (options) {
        var settings = $.extend({
            length: 100,
            ellipses: '...~'
        }, options);

        return this.each(function () {
            var text = $(this).text();

            var ext = text.substring(text.lastIndexOf(".") + 1, text.length).toLowerCase();
            var filename = text.replace('.' + ext, '');

            if (filename.length <= settings.length) {
                return;
            }

            filename = filename.substr(0, settings.length) + (text.length > settings.length ? settings.ellipses : '');
            $(this).text(filename + '.' + ext);
        });
    };
})(jQuery);

//Character Counter
(function ($) {
    $.fn.CharCountdown = function (options) {
        var settings = $.extend({
            length: 1000
        }, options);

        var that;
        function counter() {
            var remaining = settings.length - $(that).val().length;
            if (remaining < 0) {
                remaining = 0;
                $(this).val($(this).val().slice(0, settings.length));
            }
            $(that).parents().next(':first').text(remaining + ' Characters remaining');
        }

        return this.each(function () {
            that = $(this);
            counter();

            $(this).on('keyup', counter);
        });
    };
})(jQuery);

(function ($) {

    $.fn.ravTruncate = function (options) {


        var o = $.extend({
            maxHeight: null,
            maxWords: 30,
            child: null
        }, options);

        return this.each(function () {
            var $this = $(this)
            var $title = $this.find(o.child);
            var $words = $title.text().split(' ')

            while ($this.outerHeight() > o.maxHeight) {
                $title.text($words.slice(0, o.maxWords).join(' ') + ' ...')
                o.maxWords--;
            }

        });

    };
})(jQuery);

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