function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function catchSubmit(event){
    let article_content = $('#article-content').val();
    var match = /\r|\n/.exec(article_content);
    if (match) {
        event.preventDefault();
        let new_content = article_content.replace(/\r|\n/g, '[line-br]')
        //new_content = new_content.replace(/\r|\n/, '[line-br]')
        $('#article-content').val(new_content);
        $(this).submit();
    }
}

function addTabs(event){
    if(event.key =='Tab'){
        event.preventDefault();
        let cursor = $('#article-content').prop("selectionStart");
        let article_content = $('#article-content').val();
        let new_content = article_content.replace(/\n/, '\n').replace(/\r/, '\r')
        console.log(new_content)
        let article_array = article_content.split('');
        article_array[cursor] = '    '
        $('#article-content').val(article_array.join(''))
    }
}


function createCard(article){
    return `
        <div class="card display-article">
            <div class="card-header">
                <i class="far fa-newspaper"></i>
                <span></span>
            </div>
            <div class="card-body">
            </div>
        </div>
    `
}

var add_article = function(){
    let article_form = $('.add-article-form');
    article_form.toggle()
    article_form.css('overflow', 'visible');
    article_form.animate({
        'height': '370px'
    }, 'slow')
    $('#article-title').val($('#search-input').val());
}

var start_search = function(){
    let keyword = $('#search-input').val();
    $.ajax({
        method:'POST',
        dataType: 'json',
        url: 'articles/',
        data: {'keyword': keyword},
        success: function(response){
            let articles = JSON.parse(JSON.stringify(response));
            if(articles.status == 'ok'){
                if(articles.results.length == 0){
                    $('.search-results').html(
                        `<div class="no-results">
                            No results found for keyword "${keyword}". 
                            <a href="#" id="add_article">Add Article</a>
                        </div>`);
                    $('#add_article').click(add_article);
                } else{
                    var listing;
                    $('.search-results').html('');
                    for(var i = 0; i < articles.results.length; i++){
                        listing = null;
                        var article = articles.results[i];
                        var card = createCard();
                        var results = $('.search-results');
                        results.append(card);
                        results.children().last().find('.card-header > span').text(article.title);
                        results.children().last().find('.card-body').text(article.content);
                        replaceSpecial(results.children().last().find('.card-body'));

                    }
                }
            }
        },
        failure: function(error){
            console.log(error)
        }
    })

}

$(document).ready(function(){
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", window.csrftoken);
            }
        }
    });
    $('#add-btn').click(add_article);
    $('#search-btn').click(start_search);
    $('#search-input').keyup(function(event){
        if(event.key == 'Enter'){
            start_search();
        }
    })

    $('#btn-cancel-article').click(function(){
        $('.add-article-form').css({
            'overflow':'hidden',
            'height':'0px',
        }).toggle()
        $('.article-title').val('');
    })

    $('#article-content').keydown(addTabs);

    $('#post-article').submit(catchSubmit);
})

function replaceSpecial(element){
    var content = element.html();
    console.log(content)
    let new_content = content.replace(/\[c\]/g,'<code>\n').replace(/\[[/]c\]/g,'</code>');
    new_content = new_content.replace(/\[line\-br\]/g,'<br />')
    console.log(new_content);
    element.html(new_content)
}