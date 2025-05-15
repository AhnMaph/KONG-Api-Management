import json

# Đường dẫn tới file JSON
file_path = "genres.json"

# Đọc dữ liệu từ file
with open(file_path, encoding='utf-8') as f:
    data = json.load(f)

# Dùng set để lọc trùng theo "name"
seen = set()
unique_genres = []
for item in data:
    name = item['name'].strip()
    if name not in seen:
        seen.add(name)
        unique_genres.append({'name': name})

# Ghi lại file JSON đã lọc
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(unique_genres, f, indent=4, ensure_ascii=False)

print("✅ Đã xóa các thể loại trùng lặp.")
