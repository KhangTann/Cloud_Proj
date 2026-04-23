import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def convert_types(data):
    for row in data:
        for key in row:
            value = row[key]

            if value is None or value == "":
                row[key] = None
                continue

            # int
            if value.isdigit():
                row[key] = int(value)
                continue

            # float
            try:
                row[key] = float(value)
                continue
            except:
                pass

            # keep string
            row[key] = value

    return data

_cache = {}

def read_csv_file(file_name):
    if file_name in _cache:
        return _cache[file_name]

    file_path = os.path.join(BASE_DIR, "gold_data", file_name)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_name} not found")

    data = []

    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)

    data = convert_types(data)

    _cache[file_name] = data  # cache

    return data