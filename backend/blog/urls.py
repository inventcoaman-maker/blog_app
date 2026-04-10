from django.urls import path
from blog import views  


urlpatterns = [
    path('', views.homeApp, name='homeApp'),
    # path('categoryFilter/',views.categoryFilter,name='categoryFilter'),
    path("post_detail/<int:pk>/",views.post_detail,name="post_detail"),
    path('post/new/', views.post_new, name='post_new'),
    path('post/<int:pk>/edit/', views.post_edit, name='post_edit'),
    path("login/",views.login_view,name="login"),
    path("signup/",views.sign_up,name="signup"),
    path("logout/",views.logout_view,name="logout"),
    path("profile/",views.profile_view,name="profile"),
    path("Change_Password/",views.Change_Password,name="Change_Password"),



    # path("logout/",views.sign_up,name="logout"),
]