from rest_framework import serializers
from blog.models import *
from django.contrib.auth import get_user_model


# user=get_user_model()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    def get_activity(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Activity.objects.filter(user=request.user, target__icontains="password").values("action", "target", "created_at")
        return []





class postSerailizer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False
    )

    tag_names = serializers.SerializerMethodField()

    email = serializers.CharField(
        source="author.email",
        read_only=True
    )

    created_date = serializers.DateTimeField(
        format="%Y-%m-%d",
        read_only=True
    )
    is_liked = serializers.SerializerMethodField()
    total_likes=serializers.SerializerMethodField()
    total_comments=serializers.SerializerMethodField()
    pin_post=serializers.SerializerMethodField()
    saved_post=serializers.SerializerMethodField()
    total_savedPost=serializers.SerializerMethodField()
    Activity=serializers.SerializerMethodField()


    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author"]

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]
    
    def get_pin_post(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.pin_post.filter(id=request.user.id).exists()
        return  False
    def get_saved_post(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_post.filter(id=request.user.id).exists()
        return  False

    
    def get_is_liked(self, obj):
      request = self.context.get('request')
      if request and request.user.is_authenticated:
         return obj.like.filter(id=request.user.id).exists()
      return False
    def get_Activity(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Activity.objects.filter(user=request.user, target__icontains=f"post {obj.id}").values("action", "target", "created_at")
        return []
    
    def get_total_likes(self,obj):

        return obj.like.count()
    
    def get_total_comments(self,obj):
        return obj.comments.count()
    def get_total_savedPost(self,obj):
        return obj.saved_post.count()
        



class userSerailizer(serializers.ModelSerializer):
    Activity=serializers.SerializerMethodField()

    def get_Activity(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Activity.objects.filter(user=request.user).values("action", "target", "created_at")
        return []
    class Meta:
        model=User
        fields=('first_name',"last_name","email","image","phone","Activity")

class categroyserializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=("id","name")


class tagserializer(serializers.ModelSerializer):
    class Meta:
        model=Tag
        fields=("id","name")

class commentSerailizer(serializers.ModelSerializer):
    Activity=serializers.SerializerMethodField()
    def get_Activity(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Activity.objects.filter(user=request.user, target__icontains=f"comment {obj.id}").values("action", "target", "created_at")
        return []
    class Meta:
        model=Comment
        fields=("id","text","Activity")

class replySerailizer(serializers.ModelSerializer):
    Activity=serializers.SerializerMethodField()
    def get_Activity(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Activity.objects.filter(user=request.user, target__icontains=f"reply {obj.id}").values("action", "target", "created_at")
        return []
    

    class Meta:
        model = Reply
        fields = ("id", "text", "comment","Activity")

class profileSerializer(serializers.ModelSerializer):
        Activity=serializers.SerializerMethodField()
        def get_Activity(self,obj):
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return Activity.objects.filter(user=request.user, target__icontains="profile").values("action", "target", "created_at")
            return 2
        class Meta:
          model=User
          fields=('id','image','first_name','last_name','phone',"Activity")

class authorSeriallizer(serializers.ModelSerializer):
      class Meta:
        model=User
        fields=('id','email',) 

class HistorySerializer(serializers.ModelSerializer):

    class Meta:
        model=Activity
        fields="__all__"
        




