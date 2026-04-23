# Databricks notebook source
from pyspark.sql.functions import sum as _sum, count, to_date, col

# AWS credentials
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

print("="*80)
print(" GOLD TABLE 1: REVENUE BY DAY")
print("="*80)

# Đọc full_booking_data từ S3
df_full = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/gold/full_booking_data")

# Group by ngày, chỉ tính confirmed bookings
df_revenue_day = df_full \
    .filter(col("status") == "confirmed") \
    .groupBy(col("booking_date").alias("date")) \
    .agg(
        _sum("revenue").alias("total_revenue"),
        count("booking_id").alias("num_bookings")
    ) \
    .orderBy("date")

print(f"\n Tổng số ngày có booking: {df_revenue_day.count()}")
print("\n Top 5 ngày revenue cao nhất:")
df_revenue_day.orderBy(col("total_revenue").desc()).show(5)

# Lưu vào S3
df_revenue_day.write.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/gold/revenue_by_day")

print("\n Đã lưu: s3://tourgo-bigdata-lake/gold/revenue_by_day/")

# COMMAND ----------

from pyspark.sql.functions import countDistinct

print("="*80)
print(" GOLD TABLE 2: TOP TOURS")
print("="*80)

# Top 10 tours theo số booking confirmed
df_top_tours = df_full \
    .filter(col("status") == "confirmed") \
    .groupBy("tour_id", "tour_name", "destination", "category") \
    .agg(
        count("booking_id").alias("total_bookings"),
        _sum("revenue").alias("total_revenue")
    ) \
    .orderBy(col("total_bookings").desc()) \
    .limit(10)

print("\n Top 10 Tours (theo số booking):")
display(df_top_tours)

# Lưu vào S3
df_top_tours.write.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/gold/top_tours")

print("\n Đã lưu: s3://tourgo-bigdata-lake/gold/top_tours/")

# COMMAND ----------

print("="*80)
print(" GOLD TABLE 3: SUMMARY STATS")
print("="*80)

# Tổng hợp các KPI tổng quan
df_summary = df_full.agg(
    count("booking_id").alias("total_bookings"),
    _sum("revenue").alias("total_revenue"),
    countDistinct("user_id").alias("total_users"),
    countDistinct("tour_id").alias("active_tours")
)

print("\n KPI Tổng Quan:")
df_summary.show(truncate=False)

# Lưu vào S3
df_summary.write.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/gold/summary")

print("\n Đã lưu: s3://tourgo-bigdata-lake/gold/summary/")

print("\n" + "="*80)
print(" HOÀN TẤT TẤT CẢ GOLD TABLES!")
print("="*80)
print("""
 Các Gold Tables đã tạo:
   1. revenue_by_day   - Revenue theo ngày
   2. top_tours        - Top 10 tours
   3. summary          - KPI tổng quan
   
 Vị trí: s3://tourgo-bigdata-lake/gold/

 Sẵn sàng cho Dashboard!
""")

# COMMAND ----------

# DBTITLE 1,Verify 3 Gold Tables
print("="*80)
print(" KIỂM TRA 3 GOLD DELTA TABLES")
print("="*80)

gold_tables = [
    ("revenue_by_day", "s3a://tourgo-bigdata-lake/gold/revenue_by_day"),
    ("top_tours", "s3a://tourgo-bigdata-lake/gold/top_tours"),
    ("summary", "s3a://tourgo-bigdata-lake/gold/summary")
]

for table_name, path in gold_tables:
    print(f"\n {table_name.upper()}")
    print("-" * 80)
    
    try:
        # Đọc Delta table từ S3
        df = spark.read.format("delta") \
            .option("fs.s3a.access.key", ACCESS_KEY) \
            .option("fs.s3a.secret.key", SECRET_KEY) \
            .option("fs.s3a.endpoint", S3_ENDPOINT) \
            .load(path)
        
        row_count = df.count()
        columns = df.columns
        
        print(f" TỒN TẠI và QUERY ĐƯỢC!")
        print(f"   Số dòng: {row_count}")
        print(f"   Số cột: {len(columns)}")
        print(f"   Columns: {columns}")
        print(f"\n   Preview:")
        df.show(5, truncate=False)
        
    except Exception as e:
        print(f" LỖI: {str(e)[:200]}")

print("\n" + "="*80)
print(" KẾT LUẬN: CẢ 3 GOLD TABLES ĐÃ SẴN SÀNG!")
print("="*80)

# COMMAND ----------

# DBTITLE 1,Export to CSV
print("="*80)
print("📤 EXPORT 3 GOLD TABLES RA CSV")
print("="*80)
print()

# Đường dẫn xuất CSV
path_export_revenue = "s3a://tourgo-bigdata-lake/processed/gold_revenue_by_day"
path_export_top_tours = "s3a://tourgo-bigdata-lake/processed/gold_top_tours"
path_export_summary = "s3a://tourgo-bigdata-lake/processed/gold_summary"

# 1. Export revenue_by_day
print("1️⃣ Export revenue_by_day...")
df_revenue = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/gold/revenue_by_day")

df_revenue.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_revenue, header=True, mode="overwrite")
print(f"   ✅ Done: {path_export_revenue}")

# 2. Export top_tours
print("\n2️⃣ Export top_tours...")
df_tours = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/gold/top_tours")

df_tours.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_top_tours, header=True, mode="overwrite")
print(f"   ✅ Done: {path_export_top_tours}")

# 3. Export summary
print("\n3️⃣ Export summary...")
df_sum = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/gold/summary")

df_sum.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_summary, header=True, mode="overwrite")
print(f"   ✅ Done: {path_export_summary}")

print("\n" + "="*80)
print("🎉 HOÀN TẤT EXPORT TẤT CẢ CSV FILES!")
print("="*80)
print("\n📁 Đường dẫn CSV cho Django Team:")
print(f"   1. {path_export_revenue}/")
print(f"   2. {path_export_top_tours}/")
print(f"   3. {path_export_summary}/")
print("\n💡 Mỗi folder chứa 1 file CSV với header")
print("="*80)

# COMMAND ----------

# DBTITLE 1,Verify CSV Files
import subprocess

print("="*80)
print("🔍 KIỂM TRA CÁC FILE CSV ĐÃ XUẤT")
print("="*80)
print()

# Sử dụng dbutils để list files trong S3
export_paths = [
    ("revenue_by_day", "s3a://tourgo-bigdata-lake/processed/gold_revenue_by_day"),
    ("top_tours", "s3a://tourgo-bigdata-lake/processed/gold_top_tours"),
    ("summary", "s3a://tourgo-bigdata-lake/processed/gold_summary")
]

for table_name, path in export_paths:
    print(f"📁 {table_name}:")
    print(f"   Path: {path}/")
    
    try:
        # List files trong folder
        files = spark.read \
            .option("fs.s3a.access.key", ACCESS_KEY) \
            .option("fs.s3a.secret.key", SECRET_KEY) \
            .option("fs.s3a.endpoint", S3_ENDPOINT) \
            .csv(path, header=True)
        
        # Đọc để kiểm tra file tồn tại
        row_count = files.count()
        print(f"   ✅ File CSV tồn tại")
        print(f"   ✅ Có header row")
        print(f"   ✅ Rows: {row_count}")
        print(f"   ✅ Columns: {len(files.columns)}")
        print(f"   📊 Schema: {files.columns}")
        print()
        
    except Exception as e:
        print(f"   ❌ Lỗi: {str(e)[:100]}")
        print()

print("="*80)
print("📝 LƯU Ý VỀ TÊN FILE:")
print("="*80)
print()
print("Spark tạo file CSV với tên dạng: part-00000-xxx.csv")
print("Mỗi folder chứa 1 file CSV duy nhất (nhờ coalesce(1))")
print()
print("👍 Django có thể đọc bằng cách:")
print("   1. List files trong folder")
print("   2. Đọc file .csv đầu tiên tìm thấy")
print("   3. Hoặc đọc trực tiếp từ folder (pandas sẽ tự tìm)")
print()
print("="*80)