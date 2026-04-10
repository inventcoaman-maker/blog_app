from rest_framework import serializers
from blog.models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model


# user=get_user_model()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)





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

    class Meta:
        model = Post
        fields = "__all__"
        read_only_fields = ["author"]

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]
        



class userSerailizer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('first_name',"last_name","email","image","phone")

class categroyserializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=("id","name")


class tagserializer(serializers.ModelSerializer):
    class Meta:
        model=Tag
        fields=("id","name")

class commentSerailizer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields=("id","text")

class replySerailizer(serializers.ModelSerializer):

    class Meta:
        model = Reply
        fields = ("id", "text", "comment")

class profileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('id','image','first_name','last_name','phone',)

class authorSeriallizer(serializers.ModelSerializer):
      class Meta:
        model=User
        fields=('id','email',) 




    
