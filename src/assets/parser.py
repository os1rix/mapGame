import os

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
            
            # Append the export statement
            export_statement = f"\n\nexport default {export_name};"
            content += export_statement
            
            # Write back to the file
            with open(file_path, 'w') as file:
                file.write(content)
            
            print(f"Processed file: {filename}")

# Example usage
folder_path = "c:/Users/silvo/code/mapGame/src/assets/areas"
add_export_statements(folder_path)
