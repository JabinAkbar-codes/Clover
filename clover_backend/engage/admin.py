from django.contrib import admin

from .models import ContactMessage, Subscriber

admin.site.register(ContactMessage)
admin.site.register(Subscriber)
