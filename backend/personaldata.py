from flask import Blueprint, Flask, request, jsonify
import pyodbc
from db_connection import get_db_connection

personal_bp = Blueprint("personaldata", __name__)

# Check if patient exists in the database (for first-time login)
@personal_bp.route('/check_first_time', methods=['GET'])
def check_first_time():
    patient_id = request.args.get('patient_id')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Execute the stored procedure to check if the patient exists
        cursor.execute("EXEC CheckIfPatientExists ?", (patient_id,))
        result = cursor.fetchone()

        if result and result[0] == 1:  # Patient exists
            return jsonify({"first_time": False}), 200
        else:  # Patient does not exist (NULL result)
            return jsonify({"first_time": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Insert Data
@personal_bp.route('/insert_thyroid_condition', methods=['POST'])
def insert_thyroid_condition():

    #patient_id = request.args.get('patient_id') 
    try:
        data = request.get_json()

        patient_id = data.get('patient_id')
        print(f"PatientID: {patient_id}")
        # Extract parameters
        age = data.get('Age')
        gender = data.get('Gender')
        weight = data.get('Weight')
        weight_unit = data.get('WeightUnit')
        height = data.get('Height')
        height_unit = data.get('HeightUnit')
        
        # Pass "Yes" or "No" directly
        cholesterol = data.get('Cholesterol')
        pressure = data.get('Pressure')
        diabetes = data.get('Diabetes')
        pregnancy = data.get('Pregnancy')

        conn = get_db_connection()
        cursor = conn.cursor()

        # Execute stored procedure
        cursor.execute("EXEC InsertThyroidCondition ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?", 
                       (patient_id, age, gender, weight, weight_unit, height, height_unit, cholesterol, pressure, diabetes, pregnancy))
        conn.commit()

        cursor.close()
        conn.close()
        
        return jsonify({"message": "Data inserted successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update Data
@personal_bp.route('/update_thyroid_condition', methods=['POST'])
def update_thyroid_condition():

    
    #patient_id = request.args.get('patient_id') 
    

    try:
        data = request.get_json()

        patient_id = data.get('patient_id')
        print(f"PatientID: {patient_id}")
        # Extract parameters
        age = data.get('Age')
        gender = data.get('Gender')
        weight = data.get('Weight')
        weight_unit = data.get('WeightUnit')
        height = data.get('Height')
        height_unit = data.get('HeightUnit')
        
        # Pass "Yes" or "No" directly
        cholesterol = data.get('Cholesterol')
        pressure = data.get('Pressure')
        diabetes = data.get('Diabetes')
        pregnancy = data.get('Pregnancy')

       
        print(f"Age: {age}, Gender: {gender}, Weight: {weight}, Height: {height}")
        print(f"Cholesterol: {cholesterol}, Pressure: {pressure}, Diabetes: {diabetes}, Pregnancy: {pregnancy}")

        conn = get_db_connection()
        cursor = conn.cursor()

        # Execute stored procedure
        cursor.execute("EXEC UpdateThyroidCondition ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?", 
                       (patient_id, age, gender, weight, weight_unit, height, height_unit, cholesterol, pressure, diabetes, pregnancy))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Data updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Read Data (Fetch Based on PatientID)
@personal_bp.route('/get_thyroid_condition', methods=['GET'])
def get_thyroid_condition():

    patient_id = request.args.get('patient_id') 

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch data for the given PatientID
        cursor.execute("EXEC GetPersonalData @PatientID=?", patient_id)
        rows = cursor.fetchall()

        # Convert to JSON format
        results = []
        for row in rows:
            results.append({
                "Age": row[0],
                "Gender": row[1],  # Correctly mapping gender here
                "Weight (kg)": row[2],  # Correct weight mapping
                "Height (cm)": row[3],  # Correct height mapping
                "Cholesterol": row[4],  # Here, 1/0 will be returned from SP (or Yes/No as you prefer)
                "Pressure": row[5],      # Here, 1/0 will be returned from SP (or Yes/No as you prefer)
                "Diabetes": row[6],      # Here, 1/0 will be returned from SP (or Yes/No as you prefer)
                "Pregnancy": row[7]      # Here, 1/0 will be returned from SP (or Yes/No as you prefer)
            })

        cursor.close()
        conn.close()

        if results:
            return jsonify(results), 200
        else:
            return jsonify({"message": "No records found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500