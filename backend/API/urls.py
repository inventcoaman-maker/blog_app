from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
# from .views import UserViewSet
from blog.models import User

# router = DefaultRouter()


urlpatterns=[
    path('signup/',views.SignupApi.as_view()),
    path('login/',views.loginApi.as_view()),
    path('logout/',views.logoutApi.as_view()),
    path('allUsers/',views.allUsers.as_view()),
    path('singleUser/',views.singleUser.as_view()),
    path('changePassword/',views.changePassword.as_view()),
    path('postCreate/',views.postCreate.as_view()),
    path('currentUserPost/',views.currentUserPost.as_view()),
    path('selfPostUpdate/<int:id>/',views.selfPostUpdate.as_view()),
    path('allPost/',views.allPost.as_view()),
    path("category/",views.category.as_view()),
    path("Tag/",views.tag.as_view()),
    path("authors/",views.authors.as_view()),
    path("categoryupdateDelete/<int:id>/",views.categoryupdateDelete.as_view()),
    path("tagupdateDelete/<int:id>/",views.tagupdateDelete.as_view()),
    path("comment/<int:id>/",views.comment.as_view()),
    path("singlePost/<int:id>/",views.singlePost.as_view()),
    path("reply/<int:post_id>/",views.reply.as_view()),
    path("profile/",views.profile.as_view()),
    path("like/<int:post_id>/",views.like.as_view()),


    # path("bycategoryTag/",views.bycategoryTag.as_view())



]


# router.register(r'users', UserViewSet)
# urlpatterns = router.urls
