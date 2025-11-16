import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskapp.settings')
django.setup()

from accounts.models import User

def create_users():
    # Create admin (manager)
    if not User.objects.filter(email='hayder@alyafour').exists():
        User.objects.create_superuser(
            username='hayder',
            email='hayder@alyafour',
            password='123456',
            role='admin'   # ← صحيح، مش manager
        )
        print("✔ Admin created: hayder@alyafour")
    else:
        print("⚠ Admin already exists")

    # Employees data
    employees = ["ahmed", "saif", "said", "abdelrahman"]

    for name in employees:
        email = f"{name}@alyafour"
        
        if not User.objects.filter(email=email).exists():
            User.objects.create_user(
                username=name,
                email=email,
                password='123456',
                role='employee'  # ← صحيح
            )
            print(f"✔ Employee created: {email}")
        else:
            print(f"⚠ Employee already exists: {email}")

    print("\n🎉 Finished creating users successfully!")

if __name__ == "__main__":
    create_users()
