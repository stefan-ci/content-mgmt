from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import render, redirect

from .models import Article


# Create your views here.
def search(request):
    return render(request, 'search.html')


def get_articles(request):
    keyword = request.POST.get('keyword')
    articles = Article.objects.filter(
        Q(title__contains=keyword) | Q(content__contains=keyword))
    return JsonResponse({'status':'ok', 'results': list(articles.values())}, safe=False)


def add_article(request):
    article = Article.objects.create(
        author = request.user,
        title = request.POST.get('title'),
        content = request.POST.get('content')
    )
    return redirect('/')
