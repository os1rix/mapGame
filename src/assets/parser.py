import os
import json

def add_export_statements(folder_path):
    # Iterate through all files in the given folder
    for filename in os.listdir(folder_path):
        # Process only .js files
        if filename.endswith('.js'):
            file_path = os.path.join(folder_path, filename)
            
            # Get the name without the .js extension
            export_name = os.path.splitext(filename)[0]
            
            # Read the file contents
            with open(file_path, 'r') as file:
                content = file.read()
            
            # Load the content as JSON
            try:
                geojson_data = json.loads(content)
            except json.JSONDecodeError:
                print(f"Error decoding JSON in file: {filename}")
                continue
            
            # Check if the geometry type is LineString and convert to Polygon
            if geojson_data.get("geometry", {}).get("type") == "LineString":
                # Wrap the coordinates in an additional array
                geojson_data["geometry"]["type"] = "Polygon"
                geojson_data["geometry"]["coordinates"] = [
                    geojson_data["geometry"]["coordinates"]
                ]
            
            # Convert back to JSON string
            updated_content = json.dumps(geojson_data, indent=2)
            # Write back to the file
            with open(file_path, 'w') as file:
                file.write(updated_content)
            
            print(f"Processed file: {filename}")

# Example usage
folder_path = "c:/Users/silvo/code/mapGame/src/assets/areas"
add_export_statements(folder_path)
