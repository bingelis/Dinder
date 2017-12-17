/**
 * Sample usage:
 *
 * <a href="/blog/48/delete" data-method="DELETE" data-token="...">delete this post</a>
 */
$(document).ready(function () {

    // Every link with an attribute data-method
    $('body').on('click', 'a[data-method]', function(event) {
        event.preventDefault();

        const target = $(event.currentTarget);
        const action = target.attr('href');
        const _method = target.data('method');
        const _token = target.data('token');
        const _target = $('#' + target.data('target'));

        if (typeof _target !== 'undefined') {

            $.ajax({
                'url': action,
                'method': _method,
                'data': {
                    '_token': _token
                },
                success: function() {
                    const _targetParent = _target.parent();

                    _target.slideUp(300).promise().done(function () {
                        _target.remove();

                        if(_targetParent.hasClass('list-group')) {
                            _targetParent.parent().find('form').removeClass('hidden');
                        }
                    });
                }
            });
        } else {

            // Create a form on click
            let form = $('<form/>', {
                style:  "display:none;",
                action: action,
                method: 'POST'
            });

            form.append($('<input/>', {
                type:'hidden',
                name:'_method',
                value: _method
            }));

            form.append($('<input/>', {
                type:'hidden',
                name:'_token',
                value: _token
            }));

            form.appendTo(target);

            // Submit the form
            form.submit();
        }
    });

    $('.item-categories-form').submit(function(event) {
        event.preventDefault();
        const $me = $(this);

        $.ajax({
            'url': $me.attr('action'),
            'method': $me.attr('method'),
            'data': $me.serialize(),
            success: function(data) {
                $me.parent().find('.list-group').html(data.template);
                $me.find('select option:selected').remove();

                if($me.parent().find('.list-group .list-group-item').length > 2) {
                    $me.addClass('hidden');
                }
            },
            error: function() {
                window.location.reload();
            }
        });
    });

    $('body').on('click', '.link-activate', function (event) {
        event.preventDefault();
        const $me = $(this);

        $.ajax({
            'url': $me.attr('href'),
            'method': 'PUT',
            'data': {
                '_token': $me.data('token')
            },
            success: function() {
                const badge = $me.closest('.tab-content').prev().find('.active .badge');
                badge.text(parseInt(badge.text()) - 1);

                $me.closest('.slick-slider').slick('slickRemove', $me.closest('.slick-slide').attr('data-slick-index')).slick('refresh');
            }
        });
    });

    var itemOwner = false;
    var itemOwnerId = false;
    var itemRespondent = false;
    var itemRespondentId = false;

    $('body').on('click', '.item-owner', function(event) {
        event.preventDefault();

        const $me = $(this);
        itemOwner = $me.closest('.slick-slide');
        itemOwnerId = $me.data('id');

        $.ajax({
            'url': $me.attr('href'),
            'method': 'GET',
            success: function(data) {
                $('#matches-container').html(data.template).show();
            }
        });
    });

    $('body').on('click', '.item-respondent', function(event) {
        event.preventDefault();

        const $me = $(this);
        itemRespondent = $me.closest('.slick-slide');
        itemRespondentId = $me.data('id');

        $.ajax({
            'url': $me.attr('href'),
            'method': 'GET',
            success: function(data) {
                $('#matches-container').html(data.template).show();
            }
        });
    });

    $('body').on('click', '.item-match-delete', function(event) {
        event.preventDefault();

        const $me = $(this);

        $.ajax({
            'url': $me.attr('href'),
            'method': 'DELETE',
            'data': {
                'owner': itemOwnerId,
                '_token': $me.data('token')
            },
            success: function(data) {
                const badge = itemOwner.closest('.tab-content').prev().find('.active .badge');
                badge.text(parseInt(badge.text()) - 1);

                $('#matches-container').html(data.template).show();
            }
        });
    });

    $('body').on('click', '.item-match-decline', function(event) {
        event.preventDefault();

        const $me = $(this);

        $.ajax({
            'url': $me.attr('href'),
            'method': 'PUT',
            'data': {
                'respondent': itemRespondentId,
                '_token': $me.data('token')
            },
            success: function(data) {
                const badge = itemRespondent.closest('.tab-content').prev().find('.active .badge');
                badge.text(parseInt(badge.text()) - 1);

                $('#matches-container').html(data.template).show();
                itemRespondent.closest('.slick-slider').slick('slickRemove', itemRespondent.closest('.slick-slide').attr('data-slick-index')).slick('refresh');
            }
        });
    });

    $('body').on('click', '.item-match-trade', function(event) {
        event.preventDefault();

        const $me = $(this);

        $.ajax({
            'url': $me.attr('href'),
            'method': 'PUT',
            'data': {
                'respondent': itemRespondentId,
                '_token': $me.data('token')
            },
            success: function() {
                const badge = itemRespondent.closest('.tab-content').prev().find('.active .badge');
                badge.text(parseInt(badge.text()) - 1);

                $('#matches-container').empty().hide();
                itemRespondent.closest('.slick-slider').slick('slickRemove', itemRespondent.closest('.slick-slide').attr('data-slick-index')).slick('refresh');
            }
        });
    });
});
