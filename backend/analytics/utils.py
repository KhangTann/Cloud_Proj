import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def convert_types(data):
    for row in data:
        for key in row:
            value = row[key]

            # Try int
            try:
                row[key] = int(value)
                continue
            except:
                pass

            # Try float
            try:
                row[key] = float(value)
                continue
            except:
                pass

            # Keep string if not number
            row[key] = value

    return data


def read_csv_file(file_name):
    file_path = os.path.join(BASE_DIR, "gold_data", file_name)

    data = []

    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)

    # Convert types AFTER reading
    data = convert_types(data)

    return data