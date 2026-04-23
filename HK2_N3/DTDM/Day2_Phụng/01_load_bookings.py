# Databricks notebook source
# 1. AWS Credentials
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# 2. Define S3 Path
S3_PATH = "s3://tourgo-bigdata-lake/raw/bookings/bookings.csv"

# 3. Load Data
print(f"Loading data from {S3_PATH}...")
df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", "s3.eu-north-1.amazonaws.com") \
    .csv(S3_PATH)

# 4. Verify Data
df.show(10)
df.printSchema()

print(f"Total records loaded: {df.count()}")
