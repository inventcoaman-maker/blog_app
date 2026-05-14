from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .serializers import *
from django.contrib.auth import authenticate
import re
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from blog.models import Post, Category, Tag
from .pagination import CustomPagination
today = timezone.now().date()
from django.core.cache import cache
from .utils import genrate_otp
from django.contrib.auth.models import BaseUserManager
import copy




user=get_user_model()


strong_password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*!])[\w\d@#$%*!]{8,}$"

class SignupApi(APIView):
    def post(self, request):
        try:
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            password = request.data.get('password')
            confirm_password = request.data.get('confirm_password')
            email = request.data.get('email')
            image=request.data.get("image")
            print(password,confirm_password)

            if not (first_name):
                return Response({
                    "error": "first_name is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            if not (last_name):
                return Response({
                    "error": "last_name is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            if(password != confirm_password):
                return Response({
                    "error": "password and confirm_password do not match."
                }, status=status.HTTP_400_BAD_REQUEST)
            if not (password):
                return Response({
                    "error": "password is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            if not re.match(strong_password_regex,password):
                return Response({'error':"Password must contain uppercase, lowercase, number, special character and be 8+ characters long"},status=status.HTTP_400_BAD_REQUEST)
            if not ( email):
                return Response({
                    "error": "email is required."
                }, status=status.HTTP_400_BAD_REQUEST)
            if not email.endswith('@gmail.com'):
                return Response({
                    "error": "Only @gmail.com emails are allowed."
                }, status=status.HTTP_400_BAD_REQUEST)
            # Check if email already exists
            if user.objects.filter(email=email).exists():
                return Response({
                    "error": "Email already registered."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create the user
            new_user = user.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                password=password,
                email=email,
                image=image
            )

         
            return Response({
                'status':True,
                "message": "User created successfully",
                # "user": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "status":False,
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        



class loginApi(APIView):
    def post(self,request):
        email=request.data.get('email')
        password=request.data.get('password')

        # already_email=user.objects.filter(email=email).exists()
        # print(already_email)
        # if email==already_email:
        #     return Response({
        #         'error':'email not matched'
        #     },status=status.HTTP_404_NOT_FOUND)


        x=authenticate(request,email=email,password=password)
        print(x)
        if x is None:
            return Response({
                'error':'email or password not matched'
            },status=status.HTTP_404_NOT_FOUND)

        # print(x)
        refresh=RefreshToken.for_user(x)
        
        
        return Response({
            "access_token" :str(refresh.access_token),
            "refresh_token" : str(refresh),
            'message':'user logedin'
        })
class logoutApi(APIView):
    def post(self,request):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_200_OK)
    
class allUsers(APIView):
    def get(self,request):
        # print(len(user.objects.all()))
        try:
            all_users = user.objects.filter()
            print(all_users)
            paginator=CustomPagination()
            paginated_queryset = paginator.paginate_queryset(queryset=all_users,request=request)
            print(all_users)
            serializer = userSerailizer(paginated_queryset, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # print(request.user)
        
class singleUser(APIView):
    def get(self,request):
        if not request.user.is_authenticated:
            return Response({}, status=status.HTTP_200_OK)
        # print(len())
        x=request.user
        # print(x)
        # print(user)
        # z = get_object_or_404(user,id=id)
        serializers=userSerailizer(x)
        return Response(
            serializers.data
            
        ,status=status.HTTP_200_OK )
    # permission_classes = [AllowAny]
    # def get(self, request,id):
    #     permission_classes = [AllowAny]

    #     if request.user.is_authenticated:
    #         return Response({
    #             "user": request.user.email,
    #             "message": "JWT user"
    #         })

    #     else:
    #         return Response({
    #             "message": "Anonymous user"
    #         })


    permission_classes = [IsAuthenticated]
    def patch(self,request):
        # z = get_object_or_404(user,id=id)
        x=request.user
        # print(x)
        # print(x)
        serializers=userSerailizer(x,data=request.data,partial=True)
        print(serializers)
        if serializers.is_valid():
            serializers.save()
            Activity.objects.create(user=request.user, action="Updated profile",target=f"you updated your profile")    
            
            return Response( serializers.data, status=status.HTTP_201_CREATED)
        return Response(
            serializers.errors,status=status.HTTP_400_BAD_REQUEST
        )
class changePassword(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            serializer = ChangePasswordSerializer(data=request.data)
            
            if serializer.is_valid():
                old_password = serializer.validated_data["old_password"]
                new_password = serializer.validated_data["new_password"]
                
                if not user.check_password(old_password):
                    return Response(
                        {"error": "Old password is incorrect"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if old_password == new_password:
                    return Response(
                        {"error": "New password must be different from old password"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                if not re.match(strong_password_regex, new_password):
                    return Response(
                        {"error": "Password must contain uppercase, lowercase, number, special character and be 8+ characters long"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                
                user.set_password(new_password)
                user.save()
                Activity.objects.create(user=request.user, action="Changed password", target=f"you changed your password")
               

                return Response(
                    {"status": True, "message": "Password changed successfully","change_pass":f"you changed your password"},
                    status=status.HTTP_200_OK
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(
                {"status": False, "error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class postCreate(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        # data={request.data.dict()}
        title=request.data.get('title')
        text=request.data.get('text')
        if title.strip() == "":
            return Response(
                {"error":"title  field are required"},status=status.HTTP_400_BAD_REQUEST
            )
        if text.strip() == "":
            return Response(
                {"error":"text  field are required"},status=status.HTTP_400_BAD_REQUEST
            )
        # if "category.id" in request.data:
        #     id=request.data["category"]
        #     category=Category.objects.filter(category=id)
        #     data.update({"category":category["id"]})
        # if "tags.id" in request.data:
        #     id=request.data["tags"]
        #     tag=Tag.objects.filter(tags=id)
        #     data.update({"tags":tag["id"]})
        # data1=request.data["category"]
        # print(data1)
        # x=Post.objects.filter(category=data1)
        # data=request.data["tags"]
        # print(x.values())
        # print(data,data1)
        serializer= postSerailizer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            Activity.objects.create(user=request.user, action="Created post", target=f"you created post {serializer.instance.id}")
            return  Response({
                "message":"created"
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class currentUserPost(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
          user_posts = Post.objects.filter(author=request.user)
          
          serializer = postSerailizer(user_posts, many=True, context={"request": request})
          return Response({
              "posts": serializer.data,
              
          }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

class selfPostUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        try:
          x=Post.objects.filter(author=request.user)
          postId=get_object_or_404(x,id=id)
          print(postId)
          serailizer=postSerailizer(postId,context={"request": request})
          return Response(serailizer.data,
                  status=status.HTTP_200_OK)                                                                                                                                    
        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    def put(self,request,id):
        try:
          x=Post.objects.filter(author=request.user)
          postId=get_object_or_404(x,id=id)
          print(postId)
        #   for i in x.values():
        #       print(i)
        #   print(x)
          serailizer=postSerailizer(postId,data=request.data)
          if serailizer.is_valid():
              serailizer.save(author=request.user)
              Activity.objects.create(user=request.user, action="Updated post", target="post updated")
              return Response({"message":"updated successfully"},
                  status=status.HTTP_201_CREATED)
          return Response(
              {
                  "message": "Failed to update post",
                  "errors": serailizer.errors
              },
              status=status.HTTP_400_BAD_REQUEST
          )
        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
class selfPostDelete(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, id):
        delete_message={

        }
        x = Post.objects.filter(author=request.user)
        post = get_object_or_404(x, id=id)
        deleted_post=copy.deepcopy(post)
        post.delete()
        activity=Activity.objects.create(user=request.user, action="Deleted post", target=f"you deleted post {deleted_post.id}")
        delete_message["activity"]=f"you deleted post {deleted_post.id}"
        return Response({"message": "deleted successfully","delete_message":delete_message}, status=status.HTTP_200_OK)
    
class allPost(APIView):
    def get(self, request):
        try:
            category = request.query_params.get("category")
            tag = request.query_params.get("tag")
            author = request.query_params.get("author")
            title=request.query_params.get("title")

            queryset = Post.objects.all().order_by("-created_date")

            if category:
                queryset = queryset.filter(category__id=category)
                if(len(queryset)==0):
                    return Response({
                        "message":"not data found",
                        "status":400
                    },status=400)
               
            if tag:
                queryset = queryset.filter(tags__id=tag)
                if(len(queryset)==0):
                    return Response({
                        "message":"not data found",
                         "status":400
                    },status=400)
            if author:
                queryset = queryset.filter(author__id=author)
                print(queryset)
                if(len(queryset)==0):
                    return Response({
                        "message":"not data found",
                         "status":400
                    },status=400)
            if title:
                queryset=queryset.filter(title__icontains=title)
                if(len(queryset)==0):
                    return Response({
                        "message":"not data found",
                         "status":400
                    },status=400)
                if(title.strip()=="" or title is None):
                    return Response({
                        "error":'title cant be empty',
                        "status":400
                    })

            
            if not request.user.is_authenticated:
                queryset = queryset.filter(is_private=False)

            else:
                pined_post = Post.objects.filter(pin_post=request.user)

                if pined_post.exists():
                    pinned = Post.objects.filter(
                        pin_post=request.user,
                        is_private=False
                    ) | Post.objects.filter(
                        pin_post=request.user,
                        is_private=True,
                        author=request.user
                    )

                    others = Post.objects.exclude(
                        pin_post=request.user
                    ).filter(
                        is_private=False
                    ) | Post.objects.exclude(
                        pin_post=request.user
                    ).filter(
                        is_private=True,
                        author=request.user
                    )

                    pinned = pinned.order_by('-created_date')
                    others = others.order_by('-created_date')

                    if category:
                        pinned = pinned.filter(category__id=category)
                        others = others.filter(category__id=category)
                    if tag:
                        pinned = pinned.filter(tags__id=tag)
                        others = others.filter(tags__id=tag)
                    if author:
                        pinned = pinned.filter(author__id=author)
                        others = others.filter(author__id=author)
                    if title:
                        pinned=pinned.filter(title__icontains=title)
                        others = others.filter(title__icontains=title)


                    queryset = list(pinned) + list(others)

                else:
                    queryset = queryset.filter(
                        is_private=False
                    ) | queryset.filter(
                        is_private=True,
                        author=request.user
                    )

            paginator = CustomPagination()
            paginated = paginator.paginate_queryset(queryset, request)

            serializer = postSerailizer(
                paginated, many=True, context={"request": request}
            )

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# class bycategoryTag(APIView):
#     def get(self, request):
#         try:
#             paginator = CustomPagination()
#             category = request.query_params.get("category")
#             tag = request.query_params.get("tag")
#             posts = Post.objects.all()
#             if category:
#                 posts = posts.filter(category__name=category)
#             if tag:
#                 posts = posts.filter(tags__name__iexact=tag)
#             posts = posts.order_by("id").distinct()
#             print(posts)
#             paginated = paginator.paginate_queryset(posts, request)
#             serializer = postSerailizer(paginated, many=True)
#             return paginator.get_paginated_response(serializer.data)
#         except Exception as e:
#             return Response(
#                 {"error": f"Something went wrong: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
        
class category(APIView):
    def get(self,request):
        try:
           categories = Category.objects.all().order_by("id")
           paginator = CustomPagination()
           paginated=paginator.paginate_queryset(queryset=categories,request=request)
           serailizer=categroyserializer(paginated,many=True)
           return paginator.get_paginated_response(serailizer.data)
        except Exception as e:
            return Response({"error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self,request):
        serailizer=categroyserializer(data=request.data)
        if serailizer.is_valid():
            serailizer.save()
            return Response({
            "status": 201,
            "statusText": "SUCCESS",
            "message": "Data created successfully",
            })
        
class categoryupdateDelete(APIView):
    def get(self,request,id):
        x=get_object_or_404(Category,id=id)
        # tag=Tag.objects.filter(id=id)
        serializer=categroyserializer(x)
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serializer.data
        })
    
    
    def patch(self,request,id):
        x=get_object_or_404(Category ,id=id)
        serailizer=categroyserializer(x,data=request.data,partial=True)
        if serailizer.is_valid():
            serailizer.save()
            return Response({
            "status": 202,
            "statusText": "Accepted",
            "message": "Data updated successfully",
            })
        
    def delete(self,request,id):
         x=get_object_or_404(Category ,id=id)
         x.delete()
         return Response({
            "status": 204,
            "statusText": "No Content",
            "message": "Data deleted successfully",
            })
    
class tag(APIView):
    def get(self,request):
        try:
           tags = Tag.objects.all().order_by("id")
           paginator = CustomPagination()
           paginated=paginator.paginate_queryset(queryset=tags,request=request)
           serailizer=tagserializer(paginated,many=True)
           return paginator.get_paginated_response(serailizer.data)
        except Exception as e:
            return Response({"error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self,request):
        serailizer=tagserializer(data=request.data)
        if serailizer.is_valid():
            serailizer.save()
            return Response({
            "status": 201,
            "statusText": "SUCCESS",
            "message": "Data created successfully",
            })
        
class authors(APIView):
    def get(self, request):
        try:
            paginator = CustomPagination()
            email = request.query_params.get("email") 
            authors = User.objects.all()
            if email:
                authors = authors.filter(email=email)
            authors = authors.order_by("id").distinct()
            paginated = paginator.paginate_queryset(
                queryset=authors,
                request=request
            )
            serializer = authorSeriallizer(paginated, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        
class tagupdateDelete(APIView):
    def get(self,request,id):
        x=get_object_or_404(Tag,id=id)
        # tag=Tag.objects.filter(id=id)
        serializer=tagserializer(x)
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serializer.data
        })
    
    def patch(self,request,id):
        x=get_object_or_404(Tag,id=id)
        serailizer=categroyserializer(x,data=request.data,partial=True)
        if serailizer.is_valid():
            serailizer.save() 
            return Response({
            "status": 202,
            "statusText": "Accepted",
            "message": "Data updated successfully",
            })
        
    def delete(self,request,id):
         x=get_object_or_404(Tag ,id=id)
         x.delete()
         return Response({
            "status": 204,
            "statusText": "No Content",
            "message": "Data deleted successfully",
            })
class singlePost(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self,request,id):
        x=get_object_or_404(Post,id=id)
        print(x)
        print(x.tags.all())
        # print(x.comments.all())
        # print(x.comments.all())

        serailizer=postSerailizer(x,context={"request": request})
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serailizer.data
        })
    
    
class comment(APIView):
    def get(self,request,id):
        x=get_object_or_404(Post,id=id)
        comments = x.comments.all().order_by("-created_at")
        print(len(comments))
        serializer = commentSerailizer(comments, many=True)   
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data": serializer.data
        })
      


    def post(self,request,id):
       x=get_object_or_404(Post,id=id)
       print(x)
       if request.user.is_authenticated:
           
           serializer=commentSerailizer(data=request.data)    
           if serializer.is_valid():
               serializer.save(user=request.user,post=x)
               Activity.objects.create(user=request.user, action="Created comment", target=f"you commented on post {x.id}")
               return Response({
                    "status": 201,
                    "statusText": "accepted",
                    "message": "Data created successfully",
            })
           return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
class reply(APIView):
    def get(self, request, post_id):
        replies = Reply.objects.filter(comment__post_id=post_id).order_by("-created_at")
        serializer = replySerailizer(replies, many=True)
        return Response({
            "status": 200,
            "data": serializer.data
        })

    def post(self, request, post_id):
        comment_id = request.data.get("comment")
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        if request.user.is_authenticated:
            serializer = replySerailizer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, comment=comment)
                Activity.objects.create(user=request.user, action="Created reply", target=f"you replied to comment {comment.id}")
                return Response({
                    "status": 201,
                    "message": "Reply created successfully"
                })
        return Response(serializer.errors, status=400)
    
class profile(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        x=User.objects.get(id=request.user.id)
        serializer=profileSerializer(x)
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serializer.data
        })
    
    def put(self,request):
        rule = re.compile(r'^[0-9]+$')
        x=User.objects.get(id=request.user.id)
        print(x.phone)
        phone1=request.data.get('phone')
        first_name=request.data.get('first_name')
        last_name=request.data.get('last_name')
        if first_name is not None and first_name.strip() == "":
            return Response({
                "status": 400,
                "statusText": "Bad Request",
                "error": "First name cannot be empty"
            }, status=status.HTTP_400_BAD_REQUEST)
        if last_name is not None and last_name.strip() == "":
            return Response({
                "status": 400,
                "statusText": "Bad Request",
                "error": "Last name cannot be empty"
            }, status=status.HTTP_400_BAD_REQUEST)

        if phone1 is not None:
            phone1 = phone1.strip()
            if len(phone1) == 0:
                return Response({
                    "status": 400,
                    "statusText": "Bad Request",
                    "error": "Phone cannot be empty. Provide a valid 10-digit phone number."}, status=status.HTTP_400_BAD_REQUEST)
            if len(phone1) != 10 or not rule.fullmatch(phone1):
                return Response({
                    "status": 400,
                    "statusText": "Bad Request",
                    "error": "Phone must be exactly 10 digits and contain only numbers."}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(phone=phone1).exclude(id=request.user.id).exists():
                return Response({
                    "status": 400,
                    "statusText": "Bad Request",
                    "error": "Phone number already in use."},status=status.HTTP_400_BAD_REQUEST)
        
        serializer=profileSerializer(x,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            Activity.objects.create(user=request.user, action="Updated profile", target=f"you updated your profile")
            return Response({
               "status": 202,
                "statusText": "Accepted",
                "message": "Data updated successfully",
                "data": serializer.data
            })                
        return Response(serializer.errors, status=400)
    
class like(APIView):
       permission_classes=[IsAuthenticated]
       def patch(self, request, post_id):
        post = get_object_or_404(Post,id=post_id)
        user=request.user
        like_message={

        }
        if user in post.like.all():
            post.like.remove(user)
            like=False
        else:
            post.like.add(user)
            activity=Activity.objects.create(user=request.user, action="Liked post", target=f"you liked post {post.id}")
            like_message["activity"]=f"you liked post {post.id}"
            like=True

        return Response({
           "message":like_message,
            "liked": like,
            "like_count": post.like.count()
        })


class pin_post(APIView):
    #    add_pinned_lst=[]
    #    remove_pinned_lst=[]
       permission_classes=[IsAuthenticated]
       def patch(self, request, post_id):
        post = get_object_or_404(Post,id=post_id)
        pined_post_length=Post.objects.filter(pin_post=request.user).count()
        first_pined_post=Post.objects.filter(pin_post=request.user).first()
        print(first_pined_post)
        user=request.user
        pinned_message={

        }
        if user in post.pin_post.all():
            post.pin_post.remove(user)
            pin_post=False
            # self.remove_pinned_lst.append(post_id)
        else:
            if pined_post_length>=3:
                first_pined_post.pin_post.remove(user)
                post.pin_post.add(user)

            post.pin_post.add(user)
            activity=Activity.objects.create(user=request.user, action="Pinned post", target=f"you pinned post {post.id}")
            pinned_message["activity"]=f"you pinned post {post.id}"
            # x=post.pin_post.all()
            # for i in x:
            #     print(i)
            pin_post=True
            # print(first_pined_post)

            # self.add_pinned_lst.append(post_id)/
        # print(self.add_pinned_lst)
        # print(self.remove_pinned_lst)

        return Response({
            "message":pinned_message,
            "pin_post": pin_post,
        })
       

class genrateOtp(APIView):
    def post(self,request):

        email = request.data.get('email')
        if not email:
            return Response({
                "message":"email required"
            },status=status.HTTP_400_BAD_REQUEST) 
        otp = str(genrate_otp())
        cache.set(email, otp, timeout=300)
        print(f"OTP for {email}: {otp}")
        return Response({"message": "OTP sent successfully"},status=200)
    
    
class verifyOtp(APIView):
    def post(self,request):
        email=request.data.get("email")
        otp_str=request.data.get("otp")
        print(email,otp_str)
        if not email or not otp_str:
            return Response({"error":"email and otp are required"},status=400)
        try:
            otp = str(otp_str).strip()
        except ValueError:
            return Response({"error":"Invalid OTP format"},status=400)
        stored_otp = cache.get(email)
        print(stored_otp)
        if not stored_otp:
            return Response({"error":"otp expired"},status=400)
        if stored_otp != otp:
            return Response({"error":"otp not matched"},status=400)
        cache.delete(email)
        try:
           user = User.objects.get(email=email)
        except User.DoesNotExist:
           return Response({"error": "User not found"}, status=404)
        x= RefreshToken.for_user(user)
        return Response({
        "message": "Login successful",
        "access": str(x.access_token),
        "refresh": str(x),
        })
            


class savedPost(APIView):
     permission_classes=[IsAuthenticated]
     def patch(self,request,post_id):
        x=get_object_or_404(Post,id=post_id)
        user=request.user
        savedpost={

        }
        if user in x.saved_post.all():
            x.saved_post.remove(user)
            saved_post=False
        else:
            x.saved_post.add(user)
            activity=Activity.objects.create(user=request.user, action="Saved post", target=f"you saved {x.id} post")
            savedpost["activity"]=f"you  saved {x.id} post"
            saved_post= True
        # print(x.comments.all())
        # print(x.comments.all())

        return Response({
            "message":savedpost,
            "saved_post": saved_post,
            "saved_count": x.saved_post.count()
        })

class allSavedPost(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        all_saved_post=Post.objects.filter(saved_post=request.user)
        print(all_saved_post)
        serializer=postSerailizer(all_saved_post,many=True,context={"request": request})
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serializer.data
        })
    

class history(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        all_history=Activity.objects.filter(user=request.user).order_by("-created_at")
        print(len(all_history))
        serializer=HistorySerializer(all_history,many=True)
        return Response(
           {
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serializer.data
        },status=200

        )

class historyDelete(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request):
        ids=request.data.get("ids",[])
        
        if not isinstance(ids, list) or not ids:
            return Response(
                {"error": "Provide a valid list of IDs"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        x=Activity.objects.filter(id__in=ids, user=request.user)
        
        if not x.exists():
            return Response(
                {"message": "No activities found to delete"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        x.delete()
        return Response({"message": "history deleted successfully"}, status=status.HTTP_200_OK)



class postByTitle(APIView):
    def get(self,request):
        x=request.query_params.get("title")
        post = Post.objects.filter(title__icontains=x)
        # for i in post.values():
        #     if(i["title"].strip()==" "):
        #         return Response({
        #             "status":400,
        #             "message":"title cant be empty"
        #         })

            # print(i["id"],i["title"])
        if(x is None or  x.strip()==""):
            return Response({
                   "status":400,
                    "message":"title cant be empty"
                },status=400)


        
        
           
        # print(post)
        # if(post.strip()==""):
        #     return Response({
        #         "status":400,
        #         "message":"title cant be empty"
        #     })

        # print(post.tags.all())
        # print(post[1])
        # print(x.tags.all())
        # print(x.comments.all())
        # print(x.comments.all())

        serailizer=postSerailizer(post,many=True,context={"request": request})
        return Response({
            "status": 200,
            "statusText": "ok",
            "message": "Data fetched successfully",
            "data":
                serailizer.data
        })