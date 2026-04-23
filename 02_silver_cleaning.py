# Databricks notebook source
# DBTITLE 1,SILVER LAYER: Transform Bronze to Silver
from pyspark.sql.functions import col, to_timestamp, lower, trim, when, avg, coalesce, lit, row_number
from pyspark.sql.types import DecimalType, IntegerType
from pyspark.sql.window import Window

print("\n=== TRANSFORMING BRONZE TO SILVER ===")

# Use Unity Catalog tables - bronze data loaded from S3
BRONZE_CATALOG = "workspace.default"
SILVER_CATALOG = "workspace.default"

# AWS credentials for S3 write
ACCESS_KEY = ""
SECRET_KEY = ""
S3_ENDPOINT = "s3.eu-north-1.amazonaws.com"

def log_count(table_name, bronze_df, silver_df):
    print(f"[{table_name}] Bronze records: {bronze_df.count()} | Silver records: {silver_df.count()}")

# 1. Clean Users
print("\n1. Cleaning Users...")
df_users_bronze = spark.table(f"{BRONZE_CATALOG}.bronze_users")

# Deduplicate by user_id - keep the LATEST record based on created_at
window_user = Window.partitionBy("user_id").orderBy(col("created_at").desc())
df_users_silver = df_users_bronze \
    .withColumn("row_num", row_number().over(window_user)) \
    .filter(col("row_num") == 1) \
    .drop("row_num") \
    .withColumn("full_name", trim(col("full_name"))) \
    .withColumn("email", lower(trim(col("email")))) \
    .withColumn("city", lower(trim(col("city")))) \
    .withColumn("created_at", to_timestamp(col("created_at"))) \
    .filter(col("email").isNotNull() & col("email").contains("@"))

# Save to Unity Catalog table
df_users_silver.write.mode("overwrite").saveAsTable(f"{SILVER_CATALOG}.silver_users")

# Also save to S3 as Delta format
df_users_silver.write \
    .format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/silver/users")
log_count("Users", df_users_bronze, df_users_silver)
print(f"   Schema: {df_users_silver.columns}")

# 2. Clean Tours
print("\n2. Cleaning Tours...")
df_tours_bronze = spark.table(f"{BRONZE_CATALOG}.bronze_tours")

# Standardize types and strings
df_tours_temp = df_tours_bronze \
    .withColumn("name", trim(col("name"))) \
    .withColumn("destination", lower(trim(col("destination")))) \
    .withColumn("category", lower(trim(col("category")))) \
    .withColumn("price", col("price").cast(DecimalType(18, 2))) \
    .withColumn("available_slots", col("available_slots").cast(IntegerType())) \
    .withColumn("duration_days", col("duration_days").cast(IntegerType()))

# Fill NULL price with mean by category
window_cat = Window.partitionBy("category")
df_tours_temp = df_tours_temp.withColumn("avg_price", avg(col("price")).over(window_cat))
df_tours_silver = df_tours_temp \
    .withColumn("price", coalesce(col("price"), col("avg_price"))) \
    .drop("avg_price") \
    .dropDuplicates(["tour_id"]) \
    .filter((col("price") > 0) & (col("available_slots") >= 0) & (col("duration_days") > 0))

# Save to Unity Catalog table
df_tours_silver.write.mode("overwrite").saveAsTable(f"{SILVER_CATALOG}.silver_tours")

# Also save to S3 as Delta format
df_tours_silver.write \
    .format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/silver/tours")
log_count("Tours", df_tours_bronze, df_tours_silver)
print(f"   Schema: {df_tours_silver.columns}")

# 3. Clean Bookings
print("\n3. Cleaning Bookings...")
df_bookings_bronze = spark.table(f"{BRONZE_CATALOG}.bronze_bookings")

# Join with tours silver to get category and tour price for validation
# Also validate that user_id exists in silver_users (referential integrity)
df_bookings_temp = df_bookings_bronze \
    .join(df_tours_silver.select("tour_id", "category", col("price").alias("tour_price")), on="tour_id", how="inner") \
    .join(df_users_silver.select("user_id"), on="user_id", how="inner") \
    .withColumn("status", lower(trim(col("status")))) \
    .withColumn("num_people", when(col("num_people") <= 0, 1).otherwise(col("num_people")).cast(IntegerType())) \
    .withColumn("booking_date", to_timestamp(col("booking_date"))) \
    .withColumn("travel_date", to_timestamp(col("travel_date")))

# Logic validation: total_price = num_people * tour_price
# If total_price is null or wrong, recalculate it
df_bookings_temp = df_bookings_temp \
    .withColumn("total_price", coalesce(col("total_price").cast(DecimalType(18, 2)), col("num_people") * col("tour_price")))

# Fill NULL total_price with mean by category if still null (e.g. tour_price missing)
window_cat_booking = Window.partitionBy("category")
df_bookings_temp = df_bookings_temp.withColumn("avg_total_price", avg(col("total_price")).over(window_cat_booking))

df_bookings_silver = df_bookings_temp \
    .withColumn("total_price", coalesce(col("total_price"), col("avg_total_price"))) \
    .withColumn("status", when(col("status").isin("confirmed", "cancelled", "pending"), col("status")).otherwise("pending")) \
    .filter(col("booking_date") <= col("travel_date")) \
    .dropDuplicates(["booking_id"]) \
    .drop("avg_total_price", "category", "tour_price")

# Save to Unity Catalog table
df_bookings_silver.write.mode("overwrite").saveAsTable(f"{SILVER_CATALOG}.silver_bookings")

# Also save to S3 as Delta format
df_bookings_silver.write \
    .format("delta") \
    .option("fs.s3a.access.key", ACCESS_KEY) \
    .option("fs.s3a.secret.key", SECRET_KEY) \
    .option("fs.s3a.endpoint", S3_ENDPOINT) \
    .mode("overwrite") \
    .save("s3a://tourgo-bigdata-lake/silver/bookings")
log_count("Bookings", df_bookings_bronze, df_bookings_silver)
print(f"   Schema: {df_bookings_silver.columns}")

print("\n=== SILVER LAYER COMPLETE ===")



# COMMAND ----------

print("=" * 80)
print("SILVER LAYER - DỮ LIỆU SAU KHI XỬ LÝ")
print("=" * 80)

# 1. Silver Users
print("\n📊 1. SILVER_USERS (Top 10)")
print("-" * 80)
df_users_silver = spark.table("workspace.default.silver_users")
df_users_silver.show(10, truncate=False)
print(f"\nTổng số users: {df_users_silver.count()}")
print(f"Schema: {df_users_silver.columns}")

# 2. Silver Tours
print("\n" + "=" * 80)
print("📊 2. SILVER_TOURS (Top 10)")
print("-" * 80)
df_tours_silver = spark.table("workspace.default.silver_tours")
df_tours_silver.show(10, truncate=False)
print(f"\nTổng số tours: {df_tours_silver.count()}")
print(f"Schema: {df_tours_silver.columns}")

# Check price statistics
print("\n💰 Price Statistics by Category:")
df_tours_silver.groupBy("category") \
    .agg(
        {"price": "count", "price": "avg", "price": "min", "price": "max"}
    ).show()

# 3. Silver Bookings
print("\n" + "=" * 80)
print("📊 3. SILVER_BOOKINGS (Top 10)")
print("-" * 80)
df_bookings_silver = spark.table("workspace.default.silver_bookings")
df_bookings_silver.show(10, truncate=False)
print(f"\nTổng số bookings: {df_bookings_silver.count()}")
print(f"Schema: {df_bookings_silver.columns}")

# Check status distribution
print("\n📈 Booking Status Distribution:")
df_bookings_silver.groupBy("status").count().orderBy("count", ascending=False).show()

print("\n" + "=" * 80)
print("✅ DONE - Đã xem xong Silver layer data")
print("=" * 80)