from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage, Subscriber


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message']


class ContactView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        s = ContactSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save()
        return Response({'detail': 'Thanks! We will get back to you within 24 hours.'}, status=status.HTTP_201_CREATED)


class NewsletterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        s = serializers.EmailField().run_validation(email)
        Subscriber.objects.get_or_create(email=s)
        return Response({'detail': 'You are subscribed.'}, status=status.HTTP_201_CREATED)
