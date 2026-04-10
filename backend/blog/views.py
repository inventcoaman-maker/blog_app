import email
from importlib.resources import files
from multiprocessing import context
from urllib import request
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from .models import Post, Category, Tag, Comment
from django.shortcuts import render , get_object_or_404
from django.http import HttpResponse
from backend.blog.models import Post
from django.contrib.auth.models import User
from django.utils import timezone
from django.http import Http404

from django.shortcuts import redirect
from datetime import datetime
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.contrib import messages
import re
from .models import Category,Tag
from django.db.models import Q
from .models import Comment

from backend.blog.models import Post
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from .models import Post, Category, Tag, Comment

# from .form import updateProfile

from django.contrib.auth.decorators import login_required
from .form import PostForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError




# Create your views here.


def homeApp(request):
    print(len(Post.objects.all()))

    # user=request.user

    # x=Post.objects.filter(title__contains='title')
    # me= User.objects.get(username="aman")
    # Post.objects.create(author=request.user,title="title2",text="this is some text")
    # Post.objects.create(author=request.user,title="title3",text="this is some text")
    # Post.objects.create(author=request.user,title="title4",text="this is some text")
    # Post.objects.create(author=request.user,title="title5",text="this is some text")
    # Post.objects.create(author=request.user,title="title6",text="this is some text")
    # Post.objects.create(author=request.user,title="title7",text="this is some text")
    # Post.objects.create(author=request.user,title="title8",text="this is some text")
    # Post.objects.create(author=request.user,title="title9",text="this is some text")
    # Post.objects.create(author=request.user,title="title10",text="this is some text")
    # Post.objects.create(author=request.user,title="title11",text="this is some text")
    # Post.objects.create(author=request.user,title="title12",text="this is some text")
    # Post.objects.create(author=request.user,title="title13",text="this is some text")
    # Post.objects.create(author=request.user,title="title14",text="this is some text")

    # p=Post.objects.filter(title__contains="title2")
    # x=Post.objects.all()
    # x.delete()
    # Post.objects.create(author=request.user,title="title34",text="this is some text")

    # p=Post.objects.get(id=3)
    # p.publish()
    # x=Post.objects.filter(published_date=timezone.now()).values()
    # x=Post.objects.order_by("published_date")
    # Post.author = request.user 
    # Post.save()
    # allPost=Post.objects.filter().order_by('-created_date')
    # privatePost=Post.objects.filter(is_public=False).order_by('-created_date')
    # publicPost=Post.objects.filter(is_public=True).order_by('-created_date')
    # print(allPost[0].category,allPost[0].tags.all(),allPost[0].image)
    # print(allPost)
    # allPost=Post.objects.all().order_by('-created_date')
    # category=list(Post.objects.filter().values())
    # category=Category.posts.all()
    # x=request.GET.get('Category_id')
    # print(x)
    posts12=Post.objects.filter(is_private=True)
    posts121=Post.objects.filter(is_private=False)
    print(len(posts12))
    print(len(posts121))
    categories = Category.objects.all()
    tags=Tag.objects.all()
    print(tags)
    authors=User.objects.all()
    # print(Post.comment.replies.all)
    # print(authors)
    # print(categories)

    # print(posts)
    if request.user.is_authenticated:
      posts = Post.objects.filter(is_private=False) | Post.objects.filter(is_private=True, author=request.user)
      print(posts)
    else:
      posts = Post.objects.filter(is_private=False)
      print(posts)

    posts = posts.order_by('-created_date')

    category = request.GET.get('category')
    tag = request.GET.get('tags')
    author = request.GET.get('author')



    if category:
      posts = posts.filter(category__name__icontains=category)

    if tag:
      posts = posts.filter(tags__name__icontains=tag)

    if author:
      posts = posts.filter(author__email__icontains=author)
        # print(x)


    # print(input)
    


    
    
    # if (request.user.is_authenticated):
    #      print("Authenticated user:", request.user.email)
    #      allPost=Post.objects.filter(is_public=True) | Post.objects.filter(is_public=False,author=request.user)
    #     #  print(allPost)
    # else:
    #         allPost=Post.objects.filter(is_public=True)
            # print(allPost)
    # allPost=allPost.order_by('-created_date')
    enumerated_posts = enumerate(posts, start=1)
    # x=Post.objects.get(title='regrh')
    # print(x)
    # comment=x.comments.all()
    # print(comment)
    # for post in allPost:
    #   print(
    #     "Title:", post.title,
    #     "| Public:", post.is_public,
    #     "| Author:", post.author.email,
    #     "| Author ID:", post.author.id
    # )

    # print("Current User:", request.user.email)
    # print("Current User ID:", request.user.id)
    # print(Post.objects.filter(is_public=True))
    # print(Post.objects.filter(is_public=False))
    # post=Post.objects.get(id=1)
    # post = get_object_or_404(Post)
    # comment = Comment.objects.create(
    # post=post,
    # user=request.user,
    # text="Hello World"
    # )
    # comment=post.comments.all()
    # print(comment)
    # categories=[]
    # print(allPost)


    # print(category)
    context = {
        "enumerated_Post": enumerated_posts,
        "posts": posts,
        "categories": categories,
        "tags": tags,
        "authors": authors,
    } 
    return render(request,'blog/blog.html',context)
    # print(context) 
    # print(allPost)
    # for i in allPost:
    #     print(i,i.text)
    # print(x)
    # for i in x:
    #     print(i)
    # # print(x['text'])

# def categoryFilter(request):
#     return render(request,'blog/categoryFilter.html')




def post_detail(request, pk):

    post = get_object_or_404(Post, pk=pk)

    categories = Category.objects.all()
    tags = Tag.objects.all()

    if request.method == "POST":

        if "comment" in request.POST:
            comment_text = request.POST.get("comment")

            if comment_text:
                post.comments.create(
                    text=comment_text,
                    user=request.user
                )

            return redirect("post_detail", pk=post.pk)

        elif "reply" in request.POST:
            comment_id = request.POST.get("comment_id")
            reply_text = request.POST.get("reply")
            comment = get_object_or_404(Comment, id=comment_id, post=post)
            if reply_text:
                comment.replies.create(
                    text=reply_text,
                    user=request.user
                )
            return redirect("post_detail", pk=post.pk)
        else:
            form = PostForm(request.POST, request.FILES, instance=post)
            if form.is_valid():
                post = form.save(commit=False)
                post.author = request.user
                post.save()
                return redirect("post_detail", pk=post.pk)
    form = PostForm(instance=post)
    is_today = post.created_date.date() == timezone.now().date()
    return render(request, "blog/blog_detail.html", {
        "post": post,
        "today": is_today,
        "category": categories,
        "tags": tags,
        "form": form
    })
def post_new(request):
    errors=[]
    category=Category.objects.all()
    print(category)
    tags=Tag.objects.all()
    # print(tags)
    if request.method == "POST":
        # x=request.POST
        # if x['title'].strip() == "" or x['text'].strip() == "":
        #     # print('this field cant contain whitespace')
        #     errors.append('this field cant contain whitespace')
        #     form = PostForm(x, files=request.FILES)
        #     return render(request, 'blog/post_new.html', {
        #         "errors": errors,
        #         "form": form,
        #         "category": category,
        #         "tags": tags
        #     })
        # # print(form.errors)

        form = PostForm(request.POST,request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user

            # user_category=request.POST.get("category")
            user_tag=request.POST.getlist("tags")



            # if user_category:
            #     post.category_id=user_category
            post.save()
            # print(post.my_comment)
            # print(post.public_comment)
            post.tags.set(user_tag)
            print(form.errors)

           
            
            # current_user = request.user
            # print(current_user.username)
            return redirect('post_detail', pk=post.pk)
        # print(form.errors)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form,"category":category,"tags":tags})

def post_edit(request, pk):
    errors=[]
    category=Category.objects.all()
    tags=Tag.objects.all()
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        # x=request.POST
        # # print(x['title'] , x['text'])
        # if x['title'].strip() == "" or x['text'].strip() == "":
        #     # print('this field cant contain whitespace')
        #     errors.append('this field cant contain whitespace')
        #     form = PostForm(x, instance=post, files=request.FILES)
        #     return render(request, 'blog/post_edit.html', {
        #         "errors": errors,
        #         "form": form,
        #         "post": post,
        #         "category": category,
        #         "tags": tags
        #     })
        # # print(form.errors)
        form = PostForm(request.POST, instance=post, files=request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            user_category=request.POST.get("category")
            user_tag=request.POST.getlist("tags")   
            thumbnail_image=request.FILES.get("thumbnail_image")
            if user_category:
                post.category_id=user_category

            if thumbnail_image:
                post.thumbnail_image=thumbnail_image
            post.save()
            post.tags.set(user_tag)
            print(form.errors)

            return redirect('homeApp')
            
           
    else:
        form = PostForm(instance=post)
        # print(form.errors)
    return render(request, 'blog/post_edit.html', {"post":post,"form": form,"category":category,"tags":tags})


User = get_user_model()

def sign_up(request):
    errors=[]
    # success=[]

    if request.method == "POST":
        last_name = request.POST.get("last_name")
        first_name=request.POST.get("first_name")
        password = request.POST.get("password")
        confirm = request.POST.get("confirm_password")
        email = request.POST.get("email")
        # phone=request.POST.get("phone")
        print(last_name,first_name,password,confirm,email)
        strong_password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*!])[\w\d@#$%*!]{8,}$"
        if password != confirm:
                errors.append("Passwords do not match")
                # return render(request,"blog/signup.html")

            # errors.append("Passwords do not match")
            # return render(request,"blog/signup.html",{"error1":"Passwords do not match"})
        # if len(password)<8:
        #             # messages.error(request,"Password must be at least 8 characters")
        #             return render(request,"blog/signup.html",{"error2":"Password must be at least 8 characters"}) 

        if not re.match(strong_password_regex, password):
            errors.append("Password must contain uppercase, lowercase, number, special character and be 8+ characters long")
        
        # if len(password)<8:
        # #      return render(request,"blog/signup.html",{"error2":"Password must be at least 8 characters"}) 
        # x="`~!@#$%^&*()_+=-\|?/<.>,"
        # y="abcdefghijklmnopqrstuvwxyz"
        
        # if not any( i.isupper() for i in strong_password_regex):
        #     errors.append("one character must be in upper case") 
        # if not any (i.isalnum() for i in password):
        #                 messages.error(request," character must be in a lower, upper and numeric  case") 
            # print("one character must be in upper case")
        # if not any( i.islower() for i in password):
        #     errors.append("one character must be in lower case")
            # print("one character must be in lower case")
        # if not any(i  in x for i in password):
        #     messages.error(request,"at least one special character")
            # return render(request,"blog/signup.html",{"error2.3":"at least one special character"})
            # print("at least one special character")
        # if not any (i  in y for i in password):
        #     errors.append("at least one alphabet")
        # if not any( i.isdigit() for i in password):
        #     errors.append("at least one numeric number")
        # print(errors)
        
                    # print("at least one alphabet"
        # strong_password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*!])[\w\d@#$%*!]{8,}$"

        # if not any (i for i in strong_password_regex)
        # try:
        #     validate_password(password)
        # except ValidationError as e:
        #     for error in e.messages:
        #         if(error==)
        #         messages.error(request, error)
        #     return render(request,"blog/signup.html")

        # if User.objects.filter(username=email).exists():
        #     errors.append("Username exists")
            # return render(request,"blog/signup.html")
        if User.objects.filter(email=email).exists():
            errors.append("email already exists")
            # return render(request,"blog/signup.html")
        if errors:
            return render(request,"blog/signup.html",{"errors":errors})
        # success.append("Account created successfully!")
        # if success:
        #     return render(request,"blog/signup.html",{"success":success})
        # print(errors)
        user = User.objects.create_user(first_name=first_name,last_name=last_name,password=password,email=email)
        # print(user)
        
        user = authenticate(request, email=email, password=password)
        login(request, user)
        messages.success(request, "Account created successfully!")
        return redirect("homeApp")
    return render(request,"blog/signup.html")




def login_view(request):
    errors=[]
    # if request.user.is_authenticated:
    #     print("Logged in:", request.user.username)
    # success=[]
    # if request.method=="POST":
    if request.method == "POST":
        # username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email, password=password)
        print(user)
        # print(user)
        # try:s
        #     user = User.objects.get(username=username)
        # except User.DoesNotExist:
        #     user = None  # or handle the absence of the user


        if user is None:
            print("gghggh")
            errors.append("Invalid username or password")
        # if(user.username!=username):
        #         errors.append("password does not match")
      

        if errors:
            return render(request, "blog/login.html", {"errors": errors})

        login(request, user)
        messages.success(request, "You are successfully logged in")
        return redirect("homeApp")
        # username=request.POST.get("username")
        # password=request.POST.get("password")
        # email=request.POST.get("email")
        # user= authenticate(request,username=username,password=password)
        # if not username or password:
        #     messages.error(request,"all fields are required")
        #     return redirect("login")
        # user1=get_object_or_404(user,username)
        # print(user)
        # print(user)
        # print(user[0]["email"])
        # for i in user:
        #     print(i)
        # print(user[0][10])
        # # if()
        # if(user.email!=email):
        #      errors.append("email does not match ")
        # else:
        #      errors.append("Invalid username or password")

        # print(user)
        # if(user.password!=password):
        #     errors.append("password does not match ")
            #  return redirect("login")
        # if user is None:
        #     # messages.error(request, "Invalid username")
        #     errors.append("Invalid username or password")
        # else:

            # return redirect("login")
        # context={
        #     "errors":errors
        # }
        # if errors:
        #     return render(request,"blog/login.html",context)
        # user=User.objects.filter(username==username)
        # print(user.email)
        # print(user.username,user.password)
        # if user:
        #     print(user.username)
        #     login(request, user)
        #     messages.success(request,"You are successfully logged in")

        #     return redirect("homeApp")
    return render(request,"blog/login.html")


def logout_view(request):
    # print("Logging out user:", request.user.first_name)

    logout(request)
    messages.info(request, "Logged out successfully")
    return redirect("homeApp")

# Create your views here.
#  frUser['email']om django.contrib.auth import get_user_model
# >>> User = get_user_model()
# >>> User.objects.filter(username="kamal")

@login_required
def profile_view(request):
    errors=[]
    if request.method == "POST":
        user=request.user
        print(user)
        print(user.first_name)
        print(user.last_name)
        # username = request.POST.get("username")
        # mobile_Number = request.POST.get("phone")
        user.first_name = request.POST.get("first_name")
        user.last_name = request.POST.get("last_name")
        phone=request.POST.get("phone").strip()
        # already_phone = User.objects.values_list("phone", flat=True)
        # user=User.objects.filter(request.user).first()
        # print(user)
        user = request.user
        already_phone=user.phone
                       
        print(already_phone)
        
        # if phone:
        #     user.phone = phone
        # user_detail=request.user
        # x=Post.objects.filter(author=user_detail)
        # print(x)
        # if already_phone=="":
        #     errors.append('phone number required')

            
        if phone:
            if User.objects.filter(phone=phone).exclude(id=user.id).exists():
                errors.append("Mobile number should be unique")
                
                #  print(user_detail[0]['phone'])
            else:
                user.phone = phone
                # if x['phone']=='':
                #   errors.append('phone number required')
       
            # user.phone = phone

        if errors:
            return render(request,"blog/profile.html",{"errors":errors})


        # if phone:
        #     user.phone = phone


  
        # print(request.FILES)
        # user.username = username
        # user.phone = mobile_Number
        
        image = request.FILES.get("image")
        if image:
            user.image = image
        user.save()
        messages.success(request,"Profile updated successfully!")

        return redirect("homeApp")
    

    return render(request, "blog/profile.html")

@login_required
def Change_Password(request):
    error=[]
    if request.method=="POST":
        current_password=request.POST.get("current_password")
        new_password=request.POST.get("new_password")
        confirm_new_password=request.POST.get("confirm_new_password")
        # email =request.user

        try:
            # user = User.objects.get(email=request.user.email)
            user = request.user
           

          # user must login again

            print(user.password)
        except User.DoesNotExist:
            print("User not found.")
        if not user.check_password(current_password):
            error.append("Current password is wrong")
        if new_password != confirm_new_password:
            error.append("New passwords do not match")
        
        if error:
            return render(request,"blog/changePassword.html",{"error":error})

        
        user.set_password(new_password)
        user.save()
        messages.success(request, "Password changed successfully")
        return redirect("homeApp")

    #     user = authenticate(email=email, password=current_password)
    #     if user is not None:
    #       if new_password==confirm_new_password:
    #         user =User.objects.get(email=email)
    #         user.set_password(new_password)
    #         user.save()
    #         messages.info(request,"Successfully saved")
    #         return redirect("homeApp")
    #     else:
    #         messages.info(request,"PASSWORD DOES NOT MATCH")
    # else:
    #     messages.info(request,"PASSWORD INCORRECT")

        # password=request.password

        # password=current_password




    
    return render(request,"blog/changePassword.html")