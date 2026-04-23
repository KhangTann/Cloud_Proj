# Databricks notebook source
# DBTITLE 1,Load Users from S3 - Auto Region Detection
# Load Users Data - Direct S3 Access with Error Handling
# ⚠️ CẦN FIX IAM PERMISSIONS TRƯỚC KHI CHẠY

print("--- Đang load dữ liệu từ S3 ---")

try:
    # 1. AWS Credentials
    ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
    SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    
    # 2. S3 Path
    S3_PATH = "s3://tourgo-bigdata-lake/raw/users/users.csv"
    
    # 3. Đọc dữ liệu từ S3
    df = spark.read \
        .option("header", "true") \
        .option("inferSchema", "true") \
        .option("fs.s3a.access.key", ACCESS_KEY) \
        .option("fs.s3a.secret.key", SECRET_KEY) \
        .option("fs.s3a.endpoint", "s3.eu-north-1.amazonaws.com") \
        .csv(S3_PATH)
    
    # 4. Hiển thị kết quả
    print(f"✅ Thành công! Đã load file từ S3")
    print(f"Đường dẫn: {S3_PATH}")
    
    df.show(10)
    
    print("\nThông tin Schema:")
    df.printSchema()
    
    print(f"\nTổng số dòng: {df.count()}")
    
except Exception as e:
    error_msg = str(e)
    print("--- LỖI KHI LOAD DỮ LIỆU ---")
    
    if "403" in error_msg or "Forbidden" in error_msg:
        print("❌ Lỗi 403: AWS từ chối quyền truy cập")
        print("\n⚠️ CẦN FIX IAM PERMISSIONS trên AWS Console:")
        print("1. Vào IAM Console → Users → Chọn user có access key")
        print("2. Thêm policy với quyền s3:GetObject và s3:ListBucket")
        print("3. Resource: arn:aws:s3:::tourgo-bigdata-lake và arn:aws:s3:::tourgo-bigdata-lake/*")
    else:
        print(f"Lỗi chi tiết: {error_msg}")