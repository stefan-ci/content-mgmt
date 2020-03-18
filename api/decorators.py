from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect

def is_authenticated(function):
    def wrap(request, *args, **kwargs):
        if request.user.is_authenticated:
            return function(request, *args, **kwargs)
        else:
            return redirect('/admin')
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap