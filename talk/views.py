import json

from django.http import HttpResponse, QueryDict
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Post
from .forms import PostForm
from .serializers import PostSerializer

def home(request):

    context = {
        # 'all_posts': Post.objects.reverse(),
        'form': PostForm(),
     
    }
    return render(request, 'index.html', context)


# @login_required
# def create_post(request):
#     if request.method == 'POST':
#         form = PostForm(request.POST)
#         if form.is_valid():
#             post = form.save(commit=False)
#             post.author = request.user
#             post.save()
#             return redirect('home')
#     else:
#         form = PostForm()
#     return render(request, 'post.html', {'form':form})


def create_post(request):
    if request.method == 'POST':
        post_text = request.POST.get('post_data')
        response_data = {}

        post = Post(text=post_text, author=request.user)
        post.save()

        response_data['result'] = 'Create post successfull!!!'
        response_data['postpk'] = post.pk
        response_data['text'] = post.text
        response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
        response_data['author'] = post.author.username

        return HttpResponse(
         json.dumps(response_data),
         content_type="application/json"   
        )
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening..."},
                       ),
                       content_type="application/json"
        )


def delete_post(request):
    if request.method == 'DELETE':
        post = Post.objects.get(
            pk=int(QueryDict(request.body).get('postpk')))
        post.delete()

        response_data = {}
        response_data['msg'] = 'Post was deleted.'

        return HttpResponse(
            json.dumps(response_data),
            content_type='application/json'
        )
    
    else:
        return HttpResponse(
            json.dumps({"nothing to see": "this isn't happening"}),
            content_type="application/json"
        )
    

@api_view(['GET', 'POST'])
def post_collection(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = {'text': request.data.get('post_data'), 'author':request.user}
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def post_element(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)