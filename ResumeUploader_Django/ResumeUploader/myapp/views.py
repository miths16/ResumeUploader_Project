from rest_framework.response import Response
from django.shortcuts import render
from .models import *
from .serializers import ProfileSerializer
from rest_framework.views import APIView
from rest_framework import status

class ProfileView(APIView):
    def post(self, request, fromat=None):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response ({'msg': 'Resume Uploaded Successfully', 'status':'success', 'candidate':serializer.data}, 
                             status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
    
    def get(self, request, format=None):
        candidates = Profile.objects.all()
        serializer = ProfileSerializer(candidates, many=True)
        return Response({'status':'success', 'candidate':serializer.data}, status=status.HTTP_200_OK)

