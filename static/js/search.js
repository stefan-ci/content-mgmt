function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function createCard(article){
    return `
        <div class="card">
            <div class="card-header">
                ${ article.title }
            </div>
            <div class="card-body">
                ${ article.content }
            </div>
        </div>
    `
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
                            <a href="/articles/new">Add Article</a>
                        </div>`);
                } else{
                    for(var i = 0; i < articles.records.length; i++){

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
})