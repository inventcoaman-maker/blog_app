from django.contrib import admin

from .models import Post,User,Comment,Reply

admin.site.register(Post) 
admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Reply)


# Register your models here.
