from django.conf import settings
from django.db import models
from django.core.validators import RegexValidator

from django.utils import timezone
from django.contrib.auth.models import AbstractUser,BaseUserManager

from django.core.validators import RegexValidator

phone_validator = RegexValidator(
    regex=r'^\d{10}$',
    message="Phone number must contain only digits."
)
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)
class User(AbstractUser):
    username=None# remove username field
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    phone = models.CharField(
        max_length=15,
        validators=[phone_validator]
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()

    def __str__(self):
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
# class Comment(models.Model):
#     text = models.TextField()
#     is_private = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.text[:20]  


class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    thumbnail_image = models.ImageField(upload_to="profile_pics/", null=True, blank=True)    
    text = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    published_date = models.DateTimeField(null=True, blank=True,default=timezone.now)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="posts"
    )


    is_private = models.BooleanField(default=False)
    like = models.ManyToManyField(User, related_name='blog_posts', blank=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title



class Comment(models.Model): 
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    text = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.text}"
    
class Reply(models.Model):
    comment=models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name="replies"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"{self.text}"
    





# Create your models here.

