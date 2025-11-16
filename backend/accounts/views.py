from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer
from accounts.models import User


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def register(request):

    # Preflight GET request for browsers (important for Render)
    if request.method == 'GET':
        return Response({"detail": "Register endpoint OK"}, status=200)

    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def login(request):

    # Preflight GET request for browsers (important for Render)
    if request.method == 'GET':
        return Response({"detail": "Login endpoint OK"}, status=200)

    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'تم تسجيل الخروج بنجاح'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_list(request):
    if not request.user.is_admin:
        return Response(
            {'error': 'فقط المدير يمكنه عرض قائمة الموظفين'},
            status=status.HTTP_403_FORBIDDEN
        )
    employees = User.objects.filter(role='employee')
    serializer = UserSerializer(employees, many=True)
    return Response(serializer.data)

