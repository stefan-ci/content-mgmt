from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib.auth.models import User

from .models import Article
from .decorators import is_authenticated


# Create your views here.
@is_authenticated
def search(request):
    return render(request, 'search.html')


@is_authenticated
def get_articles(request):
    keyword = request.POST.get('keyword')
    articles = Article.objects.filter(
        Q(title__contains=keyword) | Q(content__contains=keyword))
    return JsonResponse({'status':'ok', 'results': list(articles.values())}, safe=False)

@is_authenticated
def add_article(request):
    if(request.user.is_authenticated):
        article = Article.objects.create(
            author = request.user,
            title = request.POST.get('title'),
            content = request.POST.get('content')
        )
    else:
        redirect('/admin')
    return redirect('/')


def dnd(request):
    return render(request, 'dnd.html')
