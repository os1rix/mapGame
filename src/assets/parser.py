import os
import re

def add_export_statements(folder_path):
    # Iterate through all files in the given folder
    for filename in os.listdir(folder_path):
        # Process only .js files
        if filename.endswith('.js'):
            file_path = os.path.join(folder_path, filename)
            
            with open(file_path, 'r') as file:
                content = file.read()

            # content = content.replace('"type": "LineString"', '"type": "Polygon"')
            
            pattern_start = r'\[\s*\[\s*'
            pattern_end = r'\]\s*\]\s*'
            match_start = re.search(pattern_start, content)
            match_end = re.search(pattern_end, content)
            if (match_start and match_end):
                # print("fucked up")
                # print(match_end.start())
                # print(match_start.start())
            # else:
                end_index = match_end.start()
                start_index = match_start.start()
                coordinates = content[start_index:end_index+2]
                
                new_coordinates = f'[[{coordinates[1:-1]}]'
                
                content = content[:start_index] + new_coordinates + content[end_index +2:]
            
            # Write back to the file
            with open(file_path, 'w') as file:
                file.write(content)
            
            print(f"Processed file: {filename}")

# Example usage
folder_path = "c:/Users/silvo/code/mapGame/src/assets/areas"
add_export_statements(folder_path)
