import os

import env_secrets

from intercom.client import Client

INTERCOM_TOKEN = os.environ.get('INTERCOM_TOKEN', 'No value set')
intercom = Client(personal_access_token=INTERCOM_TOKEN)

def get_all_admins():
    for admin in intercom.admins.all():
        yield admin.__dict__


def get_admin_ids():
    for admin in intercom.admins.all():
        if admin.id is None: 
            continue
        yield admin.id
    
def get_conversations_for_admin(id):
    for conversation in intercom.conversations.find_all(type='admin', id=id, after=1583080319):
        conversation_details = conversation.__dict__['conversation_message'].__dict__
        yield {
            'id': conversation_details['id'],
            'subject': conversation_details['subject'],
            'body': conversation_details['body'],
        }


def get_notes(id):
    for note in intercom.notes.find_all(user_id=id):
        yield notes
