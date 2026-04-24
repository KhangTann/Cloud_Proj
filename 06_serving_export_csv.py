# Databricks notebook source
# DBTITLE 1,Setup AWS Credentials
# AWS S3 Credentials
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

# Đường dẫn Gold Layer (Delta tables)
path_gold_revenue = "s3a://tourgo-bigdata-lake/gold/revenue_by_day"
path_gold_top_tours = "s3a://tourgo-bigdata-lake/gold/top_tours"
path_gold_summary = "s3a://tourgo-bigdata-lake/gold/summary"

# Đường dẫn xuất CSV (cho Django)
path_export_revenue = "s3a://tourgo-bigdata-lake/processed/gold_revenue_by_day"
path_export_top_tours = "s3a://tourgo-bigdata-lake/processed/gold_top_tours"
path_export_summary = "s3a://tourgo-bigdata-lake/processed/gold_summary"

print("✅ AWS Credentials và đường dẫn đã được cấu hình")

# COMMAND ----------

# DBTITLE 1,Export Gold Table 1: revenue_by_day
print("="*80)
print("📥 EXPORT 1/3: revenue_by_day")
print("="*80)

# Đọc Delta table từ Gold layer
df_revenue = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load(path_gold_revenue)

print(f"✅ Đọc thành công: {df_revenue.count()} dòng")
print(f"📋 Schema: {df_revenue.columns}")

# Hiển thị dữ liệu
print("\n👀 Preview dữ liệu:")
df_revenue.show(5, truncate=False)

# Export sang CSV (coalesce(1) để tạo 1 file duy nhất)
print(f"\n📤 Đang export sang: {path_export_revenue}")
df_revenue.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_revenue, header=True, mode="overwrite")

print("✅ Export revenue_by_day hoàn tất!")
print(f"📁 Đường dẫn: {path_export_revenue}")
print("="*80)

# COMMAND ----------

# DBTITLE 1,Export Gold Table 2: top_tours
print("="*80)
print("📥 EXPORT 2/3: top_tours")
print("="*80)

# Đọc Delta table từ Gold layer
df_top_tours = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load(path_gold_top_tours)

print(f"✅ Đọc thành công: {df_top_tours.count()} dòng")
print(f"📋 Schema: {df_top_tours.columns}")

# Hiển thị dữ liệu
print("\n👀 Preview dữ liệu:")
df_top_tours.show(10, truncate=False)

# Export sang CSV (coalesce(1) để tạo 1 file duy nhất)
print(f"\n📤 Đang export sang: {path_export_top_tours}")
df_top_tours.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_top_tours, header=True, mode="overwrite")

print("✅ Export top_tours hoàn tất!")
print(f"📁 Đường dẫn: {path_export_top_tours}")
print("="*80)

# COMMAND ----------

# DBTITLE 1,Export Gold Table 3: summary
print("="*80)
print("📥 EXPORT 3/3: summary")
print("="*80)

# Đọc Delta table từ Gold layer
df_summary = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load(path_gold_summary)

print(f"✅ Đọc thành công: {df_summary.count()} dòng")
print(f"📋 Schema: {df_summary.columns}")

# Hiển thị dữ liệu
print("\n👀 Preview dữ liệu:")
df_summary.show(truncate=False)

# Export sang CSV (coalesce(1) để tạo 1 file duy nhất)
print(f"\n📤 Đang export sang: {path_export_summary}")
df_summary.coalesce(1).write \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .csv(path_export_summary, header=True, mode="overwrite")

print("✅ Export summary hoàn tất!")
print(f"📁 Đường dẫn: {path_export_summary}")
print("="*80)

# COMMAND ----------

# DBTITLE 1,Summary - Đường dẫn CSV cho Django Team
print("\n" + "="*80)
print("🎉 HOÀN TẤT EXPORT TẤT CẢ GOLD TABLES")
print("="*80)
print("\n📁 ĐƯỜNG DẪN CSV CHO DJANGO TEAM:\n")

print("✅ 1. Revenue by Day:")
print(f"   {path_export_revenue}/")
print("   - Columns: date, total_revenue, num_bookings")
print("   - Records: 1 row (daily aggregation)\n")

print("✅ 2. Top Tours:")
print(f"   {path_export_top_tours}/")
print("   - Columns: tour_id, tour_name, destination, category, total_bookings, total_revenue")
print("   - Records: 10 rows (top 10 tours)\n")

print("✅ 3. Summary Stats:")
print(f"   {path_export_summary}/")
print("   - Columns: total_bookings, total_revenue, total_users, active_tours")
print("   - Records: 1 row (overall KPIs)\n")

print("="*80)
print("📝 LƯU Ý CHO DJANGO TEAM:")
print("="*80)
print("1. Mỗi thư mục chứa 1 file CSV duy nhất (nhờ coalesce(1))")
print("2. File CSV có header row (header=True)")
print("3. S3 Bucket: tourgo-bigdata-lake")
print("4. S3 Region: eu-north-1")
print("5. Cần AWS credentials để đọc từ S3")
print("="*80)

# COMMAND ----------

