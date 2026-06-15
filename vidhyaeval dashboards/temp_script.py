import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Dhyanarth@777',
    'database': 'vidhya_eval'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(dictionary=True)

cursor.execute("SELECT * FROM evaluations")
evaluations = cursor.fetchall()

print("\nEvaluations Table Contents:")
print("-" * 50)
for evaluation in evaluations:
    print(f"Answer Sheet No: {evaluation['answersheet_no']}")
    print(f"Exam Type: {evaluation['exam_type']}")
    print(f"Subject: {evaluation['subject']}")
    print(f"Question Paper: {evaluation['question_paper']}")
    print(f"Answer Sheets: {evaluation['answer_sheets']}")
    print(f"Created At: {evaluation['created_at']}")
    print("-" * 50)

cursor.close()
conn.close()