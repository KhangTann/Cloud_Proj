import boto3
import csv
import io
from django.conf import settings


def read_csv_from_s3(prefix):
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY,
        aws_secret_access_key=settings.AWS_SECRET_KEY
    )

    bucket_name = 'tourgo-bigdata-lake'

    # List files trong folder
    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=prefix
    )
    # print("BUCKET:", "tourgo-bigdata-lake")
    # print("PREFIX:", prefix)

    if 'Contents' not in response:
        return []

    data = []

    for obj in response['Contents']:
        key = obj['Key']

        # chỉ đọc file CSV
        if key.endswith('.csv'):
            file_obj = s3.get_object(Bucket=bucket_name, Key=key)
            content = file_obj['Body'].read().decode('utf-8')

            reader = csv.DictReader(io.StringIO(content))

            for row in reader:
                data.append(row)

    return data