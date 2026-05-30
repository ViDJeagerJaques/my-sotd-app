import sys

file_path = r'e:\Gdev-project\my-sotd-app\app\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

old_stylist_start = -1
old_stylist_end = -1
for i, line in enumerate(lines):
    if 'className="grid grid-cols-1 lg:grid-cols-2 gap-16"' in line:
        old_stylist_start = i
        break

for i in range(old_stylist_start, len(lines)):
    if 'id="tracker"' in lines[i]:
        for j in range(i-1, 0, -1):
            if '</section>' in lines[j]:
                old_stylist_end = j - 2
                break
        break

generator_start = -1
generator_end = -1

for i in range(old_stylist_end, len(lines)):
    if '{/* --- GENERATE SOTD / ENVIRONMENT SETUP --- */}' in lines[i]:
        generator_start = i
        break

for i in range(generator_start, len(lines)):
    if '{/* --- BRUTALIST MONTHLY SCENT CALENDAR --- */}' in lines[i]:
        generator_end = i - 1
        break

print(f'Old stylist: {old_stylist_start} to {old_stylist_end}')
print(f'Generator: {generator_start} to {generator_end}')

if old_stylist_start != -1 and generator_start != -1:
    new_lines = lines[:old_stylist_start] + lines[generator_start:generator_end] + lines[old_stylist_end:generator_start] + lines[generator_end:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Replaced!")
