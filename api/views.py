import json

from django.shortcuts import render
from django.http import JsonResponse

from api.api_modules.intercom import (
    get_all_admins, get_admin_ids, get_conversations_for_admin, get_notes)

CONVERSATION_ITEMS = ['id','subject','body']

# Create your views here.
def api_handler(request, api_name, endpoint):
    if api_name == 'intercom':
        if endpoint == 'admins':
            all_admins = list(get_all_admins())
            human_admins = [
                admin for admin in all_admins 
                if admin['email'] is not None]
            response = {'response':'Intercom', 'admins': human_admins}
        elif endpoint == 'conversations':
            admin_ids = list(get_admin_ids())
            conversations = list(get_conversations_for_admin("3649815"))
            response = {
                'response':'Intercom', 'conversations': conversations}
        elif endpoint == 'notes':
            notes = list(get_notes("3649815"))
            response = {
                'response':'Intercom', 'notes': notes}
    else:
        response = {'response':'Not found'}
    return JsonResponse(response)
