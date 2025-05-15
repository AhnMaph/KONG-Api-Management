import json

# Đọc file JSON
with open('genres.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Lọc bỏ các giá trị trùng lặp dựa trên 'name'
unique_data = []
seen_names = set()

for item in data:
    if item['name'] not in seen_names:
        unique_data.append(item)
        seen_names.add(item['name'])

# Ghi lại dữ liệu đã lọc vào file mới
with open('unique_genres.json', 'w', encoding='utf-8') as file:
    json.dump(unique_data, file, ensure_ascii=False, indent=4)

print("✅ Đã lọc và lưu file JSON không trùng.")