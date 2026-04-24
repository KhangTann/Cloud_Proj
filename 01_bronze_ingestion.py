# Databricks notebook source
# BRONZE LAYER: Load data from S3 and save to Bronze tables
from pyspark.sql.functions import *

print("=== LOADING BRONZE DATA FROM S3 ===")

# AWS Credentials
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

# 1. Load Users from S3
print("\n1. Loading Users...")
df_users = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv("s3://tourgo-bigdata-lake/raw/users/users.csv")

df_users.write.mode("overwrite").saveAsTable("workspace.default.bronze_users")
print(f"   ✅ bronze_users: {df_users.count()} records")

# 2. Load Tours from S3
print("\n2. Loading Tours...")
df_tours = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv("s3://tourgo-bigdata-lake/raw/tours/tours.csv")

df_tours.write.mode("overwrite").saveAsTable("workspace.default.bronze_tours")
print(f"   ✅ bronze_tours: {df_tours.count()} records")

# 3. Load Bookings from S3
print("\n3. Loading Bookings...")
df_bookings = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv("s3://tourgo-bigdata-lake/raw/bookings/bookings.csv")

df_bookings.write.mode("overwrite").saveAsTable("workspace.default.bronze_bookings")
print(f"   ✅ bronze_bookings: {df_bookings.count()} records")

print("\n=== BRONZE LAYER COMPLETE ===")