# Databricks notebook source
# DBTITLE 1,Create Gold Layer with ML features
from pyspark.sql.functions import col, when, to_date, month, datediff, lit

# AWS credentials
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

# 1. Load data từ S3 (Delta)
df_bookings = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/silver/bookings")

df_tours = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/silver/tours")

df_users = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/silver/users")

# 2. JOIN theo đúng logic từ file .md
df_full = df_bookings.alias("b") \
    .join(df_users.alias("u"), col("b.user_id") == col("u.user_id"), "left") \
    .join(df_tours.alias("t"), col("b.tour_id") == col("t.tour_id"), "left") \
    .select(
        # Booking
        col("b.booking_id"),
        to_date(col("b.booking_date")).alias("booking_date"),
        col("b.travel_date"),
        col("b.status"),
        col("b.num_people"),

        # User
        col("u.user_id"),
        col("u.full_name").alias("user_name"),
        col("u.city").alias("user_city"),
        col("u.created_at").alias("user_created_at"),

        # Tour
        col("t.tour_id"),
        col("t.name").alias("tour_name"),
        col("t.destination"),
        col("t.category"),
        col("t.available_slots"),

        # Financial
        col("t.price").alias("price_per_person"),
        col("b.total_price").alias("total_amount")
    ) \
    .withColumn(
        "revenue",
        when(col("status") == "confirmed", col("total_amount")).otherwise(0)
    ) \
    .withColumn(
        "is_peak_season",
        when(month(col("travel_date")).isin(6, 7, 8, 12), 1).otherwise(0)
    ) \
    .withColumn(
        "loyalty_days",
        datediff(col("booking_date"), to_date(col("user_created_at")))
    ) \
    .drop("user_created_at")

# 3. Show preview
df_full.show(10)

# 4. Count kiểm tra
print(f"Bookings count: {df_bookings.count()}")
print(f"Joined count: {df_full.count()}")

# COMMAND ----------

df_full.filter(col("tour_name").isNull()).count()
df_full.filter(col("user_name").isNull()).count()

# COMMAND ----------

df_full.groupBy("booking_id").count().filter("count > 1").show()

# COMMAND ----------

df_full.write.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .option("overwriteSchema", "true") \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/gold/full_booking_data")

# COMMAND ----------

df_test = spark.read.format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .load("s3a://tourgo-bigdata-lake/gold/full_booking_data")

df_test.show(5)

# COMMAND ----------

# DBTITLE 1,Export Top 20 to CSV for Excel validation
# Export 20 dòng ra CSV để kiểm tra bằng Excel
print("📤 Exporting top 20 rows to CSV...")

df_top20.coalesce(1) \
    .write \
    .format("csv") \
    .option("header", "true") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/gold/validation_top20.csv")

print("✅ DONE!")
print("""
📁 File CSV (20 dòng) đã lưu tại:
   S3: tourgo-bigdata-lake/gold/validation_top20.csv/
   
📥 Hướng dẫn kiểm tra:
   1. Vào AWS S3 Console
   2. Download file: gold/validation_top20.csv/part-00000-*.csv
   3. Mở bằng Excel
   4. Filter cột 'status' = 'confirmed' (8 dòng)
   5. Dùng công thức: =SUM(O2:O21) (cột total_amount)
   6. Kết quả Excel phải bằng: 186,885,194.00
   
✅ Nếu khớp -> Gold Layer đúng, tiếp tục làm Dashboard!
❌ Nếu sai -> Báo lại để sửa code!
""")

# COMMAND ----------

# DBTITLE 1,Quick Validation - Top 20 rows for Excel check
print("="*80)
print("🔍 KIỂM TRA NHANH - TOP 20 DÒNG ĐẦU TIÊN")
print("="*80)

# Lấy 20 dòng đầu tiên
df_top20 = df_full.limit(20)

print("\n📊 20 bookings đầu tiên:")
df_top20.show(20, truncate=False)

# Tính tổng revenue của những đơn CONFIRMED trong 20 dòng này
from pyspark.sql.functions import sum as spark_sum

total_revenue_confirmed = df_top20 \
    .filter(col("status") == "confirmed") \
    .agg(spark_sum("total_amount").alias("total_revenue")) \
    .collect()[0]["total_revenue"]

confirmed_count = df_top20.filter(col("status") == "confirmed").count()

print("\n" + "="*80)
print("💰 KẾT QUẢ TÍNH TOÁN TỪ SPARK (20 dòng đầu):")
print("="*80)
print(f"Số đơn CONFIRMED: {confirmed_count}")
print(f"Tổng Revenue (CONFIRMED): {total_revenue_confirmed:,.2f} VND")
print("\n⚠️  Bây giờ hãy:")
print("   1. Download file CSV bên dưới")
print("   2. Mở bằng Excel")
print("   3. Filter cột 'status' = 'confirmed'")
print("   4. Dùng =SUM() tính tổng cột 'total_amount'")
print(f"   5. So sánh với kết quả Spark: {total_revenue_confirmed:,.2f}")
print("\n   ✅ Nếu KHỚP -> Code đúng")
print("   ❌ Nếu SAI KHÁC -> Code sai logic")

# COMMAND ----------

# DBTITLE 1,Download CSV directly from notebook
print("📥 Chuẩn bị file CSV để download trực tiếp...")

# Convert Spark DataFrame sang Pandas để download
df_top20_pandas = df_top20.toPandas()

print(f"✅ Đã convert {len(df_top20_pandas)} rows")
print("\n📊 CÁCH TẢI FILE:")
print("   1. Xem bảng dữ liệu bên dưới")
print("   2. Click nút 'Download' (⬇️) ở góc phải của bảng")
print("   3. Chọn 'CSV' hoặc 'JSON'")
print("   4. File sẽ download về máy bạn ngay")
print("\n💡 Sau khi tải về:")
print("   - Mở bằng Excel")
print("   - Filter 'status' = 'confirmed'")
print("   - SUM cột 'total_amount'")
print("   - Phải bằng: 186,885,194.00")
print("\n" + "="*80)

# Display với download option
display(df_top20_pandas)