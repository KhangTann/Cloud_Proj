# Databricks notebook source
# AWS credentials
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

# Thay thế đường dẫn bằng đường dẫn thực tế trên S3
path_gold = "s3a://tourgo-bigdata-lake/gold/full_booking_data"

# Đọc Delta table với credentials
df = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load(path_gold)

print(f"Tổng số dòng: {df.count()}")
print(f"Số cột: {len(df.columns)}")
print(f"\nSchema:")
df.printSchema()
print(f"\nDữ liệu mẫu (5 dòng đầu):")
display(df.limit(5))

print("\n Lưu ý: DeltaTable.forPath() và .history() không hỗ trợ trên Databricks Serverless với S3.")
print(" Đề xem Delta history, vui lòng sử dụng Unity Catalog table hoặc cluster thông thường.")

# COMMAND ----------

# Cách 1: Sử dụng PySpark option
df_v0 = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .option("versionAsOf", 0) \
    .load(path_gold)

print(f"Số lượng đơn hàng tại Version 0: {df_v0.count()}")

# Cách 2: Sử dụng SQL (Nếu bạn đã lưu thành Table)
# %sql
# SELECT COUNT(*) FROM gold_bookings_delta VERSION AS OF 0

# COMMAND ----------

from pyspark.sql.functions import lit

# 1. Tạo dữ liệu giả có thêm cột 'invalid_column' không tồn tại trong schema gốc
bad_data = df_v0.limit(5).withColumn("invalid_column", lit("Dữ liệu lỗi"))

print(" Kiểm tra schema:")
print(f"  - Schema gốc: {len(df_v0.columns)} cột")
print(f"  - Schema lỗi: {len(bad_data.columns)} cột (thêm 'invalid_column')")
print(f"\n Thử ghi dữ liệu SAI SCHEMA vào Delta table...\n")

try:
    # 2. Thử ghi vào bảng Delta hiện tại (có thêm credentials)
    bad_data.write.format("delta") \
        .option("fs.s3a.access.key", ACCESS_KEY) \
        .option("fs.s3a.secret.key", SECRET_KEY) \
        .option("fs.s3a.endpoint", S3_ENDPOINT) \
        .mode("append") \
        .save(path_gold)
    print(" KHÔNG NÊN THẤY DÒNG NÀY - Delta đã cho phép ghi sai schema!")
except Exception as e:
    # 3. Chụp screenshot thông báo lỗi này để đưa vào báo cáo
    print(" HỆ THỐNG ĐÃ CHẶN THÀNH CÔNG DO SAI SCHEMA!")
    print("="*80)
    error_msg = str(e)
    if "SchemaNotSameDeltaException" in error_msg or "schema" in error_msg.lower():
        print(" Delta Schema Enforcement hoạt động đúng!")
    print(f"\n Lỗi chi tiết:\n{error_msg[:500]}")
    print("="*80)

# COMMAND ----------

import time

print(" DEMO: Hiệu năng đọc Delta Lake")
print("=" * 50)

# Đo thời gian đọc Delta lần 1 (cold read)
start_cold = time.time()
df_cold = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load(path_gold)
count_cold = df_cold.count()
cold_duration = time.time() - start_cold

# Đo thời gian đọc Delta lần 2 (cached/warm read)
start_warm = time.time()
count_warm = df_cold.count()  # Sử dụng lại DataFrame đã load
warm_duration = time.time() - start_warm

print("\n Kết quả:")
print("-" * 50)
print(f" Tổng số records: {count_cold:,} dòng")
print(f" Lần đọc đầu tiên: {cold_duration:.2f} giây")
print(f" Lần đọc thứ hai: {warm_duration:.4f} giây")
print(f" Cải thiện hiệu năng: {cold_duration/warm_duration:.1f}x nhanh hơn!")
print("-" * 50)
print("\n Delta Lake tối ưu hóa:")
print("  - Metadata caching")
print("  - Column pruning")
print("  - Data skipping")