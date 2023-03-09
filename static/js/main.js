$(function () {
    //load all post
    load_posts()
    // Submit post on submit
    console.log('script executing..')
    $('#post-form').on('submit', function (event) {
        event.preventDefault();
        console.log("form submitted!");
        create_post();
    });

    //Deleting text
    $('#talk').on('click', 'a[id^=delete-post-]', function () {

        var post_primary_key = $(this).attr('id').split('-')[2];
        console.log(post_primary_key)
        delete_post(post_primary_key);

    });

    // Load all posts on page load
    function load_posts() {
        $.ajax({
            url: 'api/v1/posts/',
            type: "GET",
            success: function (json) {
                for (var i = 0; i < json.length; i++) {
                    console.log(json[i])
                    dateString = convert_to_readable_date(json[i.created])
                    $("#talk").prepend("<li id='post-" + json[i].id + "'><strong>" + json[i].text + "</strong> - <em>" + json[i].author + "</em> - <span>" + dateString + "</span> - <a class='btn btn-danger'id='delete-post-" + json[i].id + "'> delete me</a></li>");
                }
            },
            error: function (xhr, errmsg, err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                    " <a href='#' class='close'>&times;</a></div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        })
    }

    // convert ugly date to human readable date
    function convert_to_readable_date(date_time_string) {
        let newDate = moment(date_time_string).format('MM/DD/YYYY, h:mm:ss a')
        return newDate
    }
    // AJAX for deleting
    function delete_post(post_primary_key) {
        if (confirm('are you sure you want to remove this post?') == true) {
            $.ajax({
                url: "api/v1/posts/" + post_primary_key, // the endpoint
                type: "DELETE", // http method
                data: { postpk: post_primary_key }, // data sent with the delete request
                success: function (json) {
                    // hide the post
                    $('#post-' + post_primary_key).hide(); // hide the post on success
                    console.log("post deletion successful");
                },

                error: function (xhr, errmsg, err) {
                    // Show an error
                    $('#results').html("<div class='alert-box alert radius' data-alert>" +
                        "Oops! We have encountered an error. <a href='#' class='close'>&times;</a></div>"); // add error to the dom
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        } else {
            return false;
        }
    };



    // JavaScript function to get cookie by name; retrieved from https://docs.djangoproject.com/en/3.1/ref/csrf/
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function create_post() {
        console.log('starting create_post')
        $.ajax({
            'url': 'api/v1/posts/',
            'type': 'POST',

            'data': { 'post_data': $('#post-text').val() },

            // handle successful response
            success: function (json) {
                docString = convert_to_readable_date(json.created)
                $("#talk").prepend("<li id='post-" + json.id + "'><strong>" + json.text +
                    "</strong> - <em> " + json.author + "</em> - <span> " + docString +
                    "</span> - <a class='btn btn-danger' id='delete-post-" + json.id + "'>delete me</a></li>");

            },
            error: function (xhr, errmsg, err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg + err +
                    " <a href='#' class='close'>&times;</a></div>")
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        })
    }

    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});