import os
import re

def add_export_statements(folder_path):
    # Iterate through all files in the given folder
    for filename in os.listdir(folder_path):
        # Process only .js files
        if filename.endswith('.js'):
            file_path = os.path.join(folder_path, filename)
            
            # Read the file contents
            with open(file_path, 'r') as file:
                content = file.read()
            
            # Replace LineString with Polygon
            # content = content.replace('"type": "LineString"', '"type": "Polygon"')
            with open(file_path, 'r') as file:
                content = file.read()
            
            # Use regex to find the coordinates section with double square brackets
            pattern_start = r'\[\s*\[\s*'
            pattern_end = r'\],\s*\]\s*'  # Matches the last closing double brackets at the end of the string
            match_start = re.search(pattern_start, content)
            match_end = re.search(pattern_end, content)
            if not (match_start and match_end):
                print("fucked up")
            else:
                end_index = match_end.start()
                start_index = match_start.start()  # Index of the first character of match_start
                # Extract the coordinates
                coordinates = content[start_index:end_index+2]
                
                # Wrap the coordinates in an additional array
                new_coordinates = f'[[{coordinates[1:-1]}]'  # Remove the outer brackets and add new ones
                
                # Replace the old coordinates with the new ones
                content = content[:start_index] + new_coordinates + content[end_index +2:]
                # Index of the first character of match_end
            # print(match_start)
            # print(match_end)
            
            # Write back to the file
            with open(file_path, 'w') as file:
                file.write(content)
            
            print(f"Processed file: {filename}")

# Example usage
folder_path = "c:/Users/silvo/code/mapGame/src/assets/test_areas"
add_export_statements(folder_path)
