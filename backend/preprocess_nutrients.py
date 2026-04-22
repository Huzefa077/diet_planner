import pandas as pd

def preprocess_nutrients(file_path, output_path):
    # Load the dataset
    data = pd.read_csv(file_path)

    # Inspect the first few rows
    print("Original Data:")
    print(data.head())

    # Standardize column names
    data.columns = data.columns.str.strip().str.lower().str.replace('.', '_')

    # Fill missing values
    data = data.fillna(0)

    # Save cleaned dataset
    data.to_csv(output_path, index=False)
    print(f"Dataset cleaned and saved at: {output_path}")

# Input and output file paths
input_file = "../nutrients.csv"
output_file = "nutrients_cleaned.csv"

preprocess_nutrients(input_file, output_file)
