import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_platform.settings')
django.setup()

from django.db import connection

cursor = connection.cursor()
cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE'")
tables = [row[0] for row in cursor.fetchall()]
print("TABLES:", tables)
cursor.close()
