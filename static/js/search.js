function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
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
    console.log(window.csrftoken)
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", window.csrftoken);
            }
        }
    });

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
})