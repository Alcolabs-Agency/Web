import os

def clean_labels(folder, classes_count):
    for file_name in os.listdir(folder):
        file_path = os.path.join(folder, file_name)
        with open(file_path, 'r') as file:
            lines = file.readlines()
        
        valid_lines = []
        for line in lines:
            parts = line.strip().split()
            if len(parts) == 5:
                class_id = int(parts[0])
                if 0 <= class_id < classes_count:
                    valid_lines.append(line)
        
        if valid_lines:
            with open(file_path, 'w') as file:
                file.writelines(valid_lines)
        else:
            os.remove(file_path)  # Elimina el archivo si no contiene líneas válidas

# Define la ruta a tus etiquetas y el número de clases
train_labels_folder = "datasets/train/labels"
val_labels_folder = "datasets/val/labels"
classes_count = 11  # Cambia esto según tus clases definidas

# Limpia las etiquetas
clean_labels(train_labels_folder, classes_count)
clean_labels(val_labels_folder, classes_count)

print("Limpieza completada.")
