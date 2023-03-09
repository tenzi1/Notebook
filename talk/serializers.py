from django.contrib.auth import get_user_model
from rest_framework import serializers

from talk.models import Post

User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')
    class Meta:
        model = Post
        fields = ('id','author', 'text', 'created', 'updated')

