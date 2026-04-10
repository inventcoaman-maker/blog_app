from urllib import request

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from .serializers  import *
from django.contrib.auth import authenticate
import re
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from backend.blog.models import Post
from backend.blog.models import Category,Tag
from django.core.validators import RegexValidator
from .pagination import CustomPagination
today = timezone.now().date()



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
            return Response(serializers.data, status=status.HTTP_201_CREATED)
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

                return Response(
                    {"status": True, "message": "Password changed successfully"},
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
        if title.strip() and text.strip() == "":
            return Response(
                {"error":"title and text field are required"},status=status.HTTP_400_BAD_REQUEST
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
            return  Response({
                "message":"created"
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class currentUserPost(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
          x=Post.objects.filter(author=request.user)
          serailizer=postSerailizer(x,many=True)
          return Response(serailizer.data,status=status.HTTP_200_OK)
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
          serailizer=postSerailizer(postId)
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
              return Response({"message":"updated successfully"},
                  status=status.HTTP_201_CREATED)
          return Response(
                serailizer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({
                "error": f"Something went wrong: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    
class allPost(APIView):
    def get(self, request):
        try:
            category = request.query_params.get("category")
            tag = request.query_params.get("tag")
            author = request.query_params.get("author")
            queryset = Post.objects.filter().order_by("-created_date")
            print(queryset)            # Debug: print creation dates
            for post in queryset[:5]:  # First 5 posts
                print(f"{post.title}: {post.created_date}")
            # today = timezone.now().date()
            today_posts = queryset.filter(created_date__date=today)
            print(f"Posts from today ({today}): {today_posts.count()}")            
            if category:
                queryset = queryset.filter(category__id=category)
            if tag:
                queryset = queryset.filter(tags__id=tag)
            if author:
                queryset = queryset.filter(author__id=author)
            if not request.user.is_authenticated:
                queryset = queryset.filter(is_private=False)
            else:
                queryset = queryset.filter(
                    is_private=False
                ) | queryset.filter(
                    is_private=True, author=request.user
                )
       
            
            paginator = CustomPagination()
            paginated = paginator.paginate_queryset(queryset, request)
            # print(paginated)
            serializer = postSerailizer(paginated, many=True)
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
           paginator = CustomPagination()
           category = request.query_params.get("category")
           posts = Category.objects.all()
           if category:
                posts = posts.filter(category__id=category)
           posts = posts.order_by("id").distinct()
           paginated=paginator.paginate_queryset(queryset=posts,request=request)
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
           paginator = CustomPagination()
           category = request.query_params.get("tag")
           posts = Tag.objects.all()
           if category:
                posts = posts.filter(category__id=category)
           posts = posts.order_by("id").distinct()
           paginated=paginator.paginate_queryset(queryset=posts,request=request)
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
        print(x.comments.all())
        # print(x.comments.all())

        serailizer=postSerailizer(x)
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
        comments = x.comments.all() 
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
       print
       if request.user.is_authenticated:
           serializer=commentSerailizer(data=request.data)    
           if serializer.is_valid():
               serializer.save(user=request.user,post=x)
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
        replies = Reply.objects.filter(comment__post_id=post_id)
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
    
    def patch(self,request):
        rule = re.compile(r'^[0-9]+$')
        x=User.objects.get(id=request.user.id)
        print(x.phone)
        phone1=request.data.get('phone')
        if phone1:
            phone1=phone1.strip()
            if(len(phone1)>10 or not rule.search(phone1)):
              return Response({
                 "status": 400,
                    "statusText": "Bad Request",
                    "message": "Phone must be exactly 10 digits"})
        print(phone1)
        if (User.objects.filter(phone=phone1).exclude(id=request.user.id).exists()):
            return Response({
                 "status": 400,
                    "statusText": "Bad Request",
                    "message": "Phone number already in use"},status=status.HTTP_400_BAD_REQUEST)
        serializer=profileSerializer(x,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
               "status": 202,
                "statusText": "Accepted",
                "message": "Data updated successfully",
                "data": serializer.data
            })                
        return Response(serializer.errors, status=400)
    

# 1  {
# "first_name":"qqqq",
# "last_name":"mmmm",
# "email": "first@gmail.com",
# "password": "Ajagd435@#34"
# }


# 2 {
# "first_name":"qqqq",
# "last_name":"mmmm",
# "email": "second@gmail.com",
# "password": "Ajagd435@#34"
# }

{
"first_name":"mkolp",
"last_name":"qwer",
"email": "oyeok!@#!!!@#@gmail.com",
"password": "Ajagd@#1234"
}

{
    "old_password":"Ajagd@#1234",
    "new_password":"Ajagd@#123465"
}

{
"first_name":"mkolp",
"last_name":"qwer",
"email": "new maill@gmail.com",
"password": "Ajagd@#1234"
}


{
"first_name":"alsonew",
"last_name":"qwer",
"email": "new121234@gmail.com",
"password": "Ajagd435@#34"
}

{
"first_name":"alsonew",
"last_name":"qwer",
"email": "newlpmkko@gmail.com",
"password": "Ajagd435@#34"
}
    

{
"first_name":"mkolp",
"last_name":"qwer",
"email": "oyeok!@#@gmail.com",
"password": "Ajagd435@#34"
}

      



# from rest_framework import viewsets
# from blog.models import User
# from .serializers import *

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = userSerailizer



        
# Create your views here.
# {

#  "email": "king@yo",
#  "password": "aman123"
# } 



# {
#  "first_name": "neww",
#  "last_name": "Jha",
#  "email": "new@yo",
#  "password": "yooo123"
# }

# {
#  "email": "new@yo",  
#  "password": "yooo123"
# }


# {
#   "first_name": "ajay",
#  "last_name": "Jha",
#  "email": "ajay@yo",
#   "password": "ajay1234"
# }


# {
# "first_name":"new5754775one",
# "last_name":"odgdfhfdh4574kk",
# "email": "ajay24325235dfgdf@yo",
# "password": "ajagdfgy1234"
# }





# {
# "first_name":"new575475462575one",
# "last_name":"odgdfhfryrtdh4574kk",
# "email": "ajay24325235dfgdf@yopmail.com",
# "password": "ajagdfgy1243534"
# }



# {
# "first_name":"gfdgbbzg34536",
# "last_name":"bbzdd55yyeys",
# "email": "hfghf4747yrtyut45@yopmail.com",
# "password": "Ndeyeyed5@12747"
# }


# {
# "first_name":"ngnzfzdj",
# "last_name":"bbzdd55yyeys",
# "email": "hfghf47@gmail.com",
# "password": "Nfnzdhher@312h"
# }


#  aman1@yopmail.com


{
"first_name":"new name",
"last_name":"yess",
"email": "newname@gmail.com",
"password": "Newpass@#123"
}



{
    "old_password":"Newpass@#123",
    "new_password":"Newpass@#12389"
}
