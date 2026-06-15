from flask import Flask, render_template, request, redirect, url_for, flash, session
import mysql.connector
import os
app = Flask(__name__)
app.secret_key = 'vidhyaeval_secret_key'  # Add this line for flash messages

# MySQL configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Dhyanarth@777',
    'database': 'vidhya_eval'
}
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def index():
    # Redirect to the registration page when the root URL is accessed
    return redirect(url_for('register'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        fullname = request.form['fullname']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']
        role = request.form['role']
        enrollment = request.form.get('enrollment', '')
        department = request.form.get('department', '')

        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return redirect(url_for('register'))

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (fullname, email, password, role, enrollment, department) VALUES (%s, %s, %s, %s, %s, %s)",
                (fullname, email, password, role, enrollment, department)
            )
            conn.commit()
            cursor.close()
            conn.close()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login_page'))  # Redirect to login after successful registration
        except mysql.connector.Error as err:
            flash(f'Error: {err}', 'error')
            return redirect(url_for('register'))
        

    return render_template('register.html')

@app.route('/index', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email', '')  # Avoids KeyError
        password = request.form.get('password', '')
        role = request.form.get('login-role', '')

        if not email or not password or not role:
            flash('Please enter email, password, and select a role.', 'error')
            return redirect(url_for('index'))

        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM users WHERE email = %s AND password = %s AND role = %s",
                (email, password, role)
            )
            user = cursor.fetchone()
            cursor.close()
            conn.close()

            if user:
                session['email'] = user['email']

                if role == 'admin':
                    return redirect(url_for('admin_dashboard'))
                elif role == 'teacher':
                    return redirect(url_for('teacher_dashboard'))
                elif role == 'student':
                    return redirect(url_for('student_dashboard'))
            else:
                flash('Invalid email, password, or role!', 'error')
                return redirect(url_for('index'))

        except mysql.connector.Error as err:
            flash(f'Database Error: {err}', 'error')
            return redirect(url_for('index'))

    return render_template('index.html')

@app.route('/student-dashboard')
def student_dashboard():
    # Check if the user is logged in (session contains email)
    if 'email' not in session:
        flash('Please log in to access the dashboard.', 'error')
        return redirect(url_for('login_page'))

    # Fetch student details from the database using email
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT fullname, enrollment FROM users WHERE email = %s",
            (session['email'],)  # Use email to fetch details
        )
        student = cursor.fetchone()
        cursor.close()
        conn.close()

        if student:
            # Pass the student's name and enrollment to the template
            return render_template('student-dashboard.html', name=student['fullname'], enrollment=student['enrollment'])
        else:
            flash('Student details not found.', 'error')
            return redirect(url_for('login_page'))
    except mysql.connector.Error as err:
        flash(f'Error: {err}', 'error')
        return redirect(url_for('login_page'))

@app.route('/teacher-dashboard')
def teacher_dashboard():
    # Check if the user is logged in (session contains email)
    if 'email' not in session:
        flash('Please log in to access the dashboard.', 'error')
        return redirect(url_for('login_page'))

    # Fetch teacher details from the database using email
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get teacher details
        cursor.execute(
            "SELECT id, fullname, department FROM users WHERE email = %s",
            (session['email'],)
        )
        teacher = cursor.fetchone()
        
        if not teacher:
            flash('Teacher details not found.', 'error')
            return redirect(url_for('login_page'))
        
        # Fetch assigned batches for this teacher
        # You can use either teacher email or teacher ID based on how you've stored assignments
        cursor.execute(
            "SELECT * FROM batches WHERE teacher_assign = %s OR teacher_id = %s",
            (session['email'], teacher['id'])
        )
        assigned_batches = cursor.fetchall()
        
        cursor.close()
        conn.close()

        # Pass the teacher's name, department, and assigned batches to the template
        return render_template(
            'teacher-dashboard.html', 
            name=teacher['fullname'], 
            department=teacher['department'],
            assigned_batches=assigned_batches
        )
    except mysql.connector.Error as err:
        flash(f'Error: {err}', 'error')
        return redirect(url_for('login_page'))
    
@app.route('/submit-evaluation', methods=['POST'])
def submit_evaluation():
    if 'email' not in session:
        flash('Please log in to submit an evaluation.', 'error')
        return redirect(url_for('login_page'))

    # Get form data
    exam_type = request.form.get('exam_type', '')
    subject = request.form.get('subject', '')
    key_points = request.form.get('key_points', '')
    evaluation_criteria = request.form.get('evaluation_criteria', '')

    # Handle file uploads
    question_paper = request.files.get('question_paper')
    answer_sheets = request.files.getlist('answer_sheets')

    # Validate required fields
    if not exam_type or not subject or not question_paper or not answer_sheets:
        flash('Please fill in all required fields.', 'error')
        return redirect(url_for('teacher_dashboard'))

    # Save files
    q_paper_filename = os.path.join(app.config['UPLOAD_FOLDER'], question_paper.filename)
    question_paper.save(q_paper_filename)

    uploaded_answer_sheets = []
    for answer_sheet in answer_sheets:
        if answer_sheet and answer_sheet.filename:
            a_sheet_filename = os.path.join(app.config['UPLOAD_FOLDER'], answer_sheet.filename)
            answer_sheet.save(a_sheet_filename)
            uploaded_answer_sheets.append(answer_sheet.filename)

    if not uploaded_answer_sheets:
        flash('No valid answer sheets were uploaded.', 'error')
        return redirect(url_for('teacher_dashboard'))

    # Insert data into the database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO evaluations (teacher_email, exam_type, subject, question_paper, answer_sheets, key_points, criteria) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (session['email'], exam_type, subject, question_paper.filename, ','.join(uploaded_answer_sheets), key_points, evaluation_criteria)
        )
        conn.commit()
        cursor.close()
        conn.close()

        flash('Evaluation submitted successfully!', 'success')
        return redirect(url_for('teacher_dashboard'))
    
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
        return redirect(url_for('teacher_dashboard'))
    
@app.route('/add-teacher', methods=['POST'])
def add_teacher():
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    fullname = request.form.get('teacher-name')
    email = request.form.get('teacher-email')
    department = request.form.get('teacher-department')
    password = request.form.get('teacher-password')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (fullname, email, password, role, department) VALUES (%s, %s, %s, 'teacher', %s)",
            (fullname, email, password, department)
        )
        conn.commit()
        cursor.close()
        conn.close()
        flash('Teacher added successfully!', 'success')
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
    return redirect(url_for('admin_dashboard'))

# Add Student Route
@app.route('/add-student', methods=['POST'])
def add_student():
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    fullname = request.form.get('student-name')
    email = request.form.get('student-email')
    class_name = request.form.get('student-class')
    password = request.form.get('student-password')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (fullname, email, password, role, class) VALUES (%s, %s, %s, 'student', %s)",
            (fullname, email, password, class_name)
        )
        conn.commit()
        cursor.close()
        conn.close()
        flash('Student added successfully!', 'success')
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
    return redirect(url_for('admin_dashboard'))

# Delete Teacher Route
@app.route('/delete-teacher/<int:teacher_id>', methods=['POST'])
def delete_teacher(teacher_id):
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s AND role = 'teacher'", (teacher_id,))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Teacher deleted successfully!', 'success')
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
    return redirect(url_for('admin_dashboard'))

# Delete Student Route
@app.route('/delete-student/<int:student_id>', methods=['POST'])
def delete_student(student_id):
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s AND role = 'student'", (student_id,))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Student deleted successfully!', 'success')
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
    return redirect(url_for('admin_dashboard'))

# Admin Dashboard Route (already fetches data correctly)
@app.route('/admin-dashboard', methods=['GET', 'POST'])
def admin_dashboard():
    if 'email' not in session:
        flash('Please log in to access the admin dashboard.', 'error')
        return redirect(url_for('login_page'))

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()['total_users']

        cursor.execute("SELECT COUNT(*) as total_teachers FROM users WHERE role = 'teacher'")
        total_teachers = cursor.fetchone()['total_teachers']

        cursor.execute("SELECT COUNT(*) as total_students FROM users WHERE role = 'student'")
        total_students = cursor.fetchone()['total_students']

        cursor.execute("SELECT id, fullname, email, department FROM users WHERE role = 'teacher'")
        teachers = cursor.fetchall()

        cursor.execute("SELECT id, fullname, email, class FROM users WHERE role = 'student'")
        students = cursor.fetchall()

        cursor.execute("SELECT * FROM batches")
        batches = cursor.fetchall()

        cursor.close()
        conn.close()

        return render_template('admin-dashboard.html',
                               total_users=total_users,
                               total_teachers=total_teachers,
                               total_students=total_students,
                               teachers=teachers,
                               students=students,
                               batches=batches)

    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
        return redirect(url_for('login_page'))
    

@app.route('/add-batch', methods=['POST'])
def add_batch():
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    print("Request received at /add-batch")
    print(f"Form data: {request.form}")
    print(f"Files: {request.files}")

    batch_number = request.form.get('batch_number')
    course_name = request.form.get('course_name')
    teacher_assign = request.form.get('teacher_assign')
    teacher_id = request.form.get('teacher_id')
    answer_key = request.files.get('answer_key')
    answer_sheet = request.files.get('answer_sheet')

    if not batch_number or not course_name or not teacher_assign:
        flash('Please fill in all required fields (Batch Number, Course Name, Teacher Assign).', 'error')
        return redirect(url_for('admin_dashboard'))

    answer_key_path = ''
    answer_sheet_path = ''

    if answer_key and answer_key.filename:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], answer_key.filename)
        print(f"Saving answer key to: {filepath}")
        answer_key.save(filepath)
        answer_key_path = filepath
        print(f"Answer key saved: {answer_key_path}")
    else:
        print("No answer key uploaded")

    if answer_sheet and answer_sheet.filename:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], answer_sheet.filename)
        print(f"Saving answer sheet to: {filepath}")
        answer_sheet.save(filepath)
        answer_sheet_path = filepath
        print(f"Answer sheet saved: {answer_sheet_path}")
    else:
        print("No answer sheet uploaded")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO batches (batch_number, course_name, teacher_assign, teacher_id, answer_key, answer_sheet)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (batch_number, course_name, teacher_assign, teacher_id, answer_key_path, answer_sheet_path)
        )
        conn.commit()
        cursor.close()
        conn.close()
        flash('Batch added successfully!', 'success')
        print(f"Database entry: {batch_number}, {answer_key_path}, {answer_sheet_path}")
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')
        print(f"Database error: {err}")
        return redirect(url_for('admin_dashboard'))

    return redirect(url_for('admin_dashboard'))

# Delete Batch Route (Optional)
@app.route('/delete-batch/<int:batch_id>', methods=['POST'])
def delete_batch(batch_id):
    if 'email' not in session:
        flash('Please log in to perform this action.', 'error')
        return redirect(url_for('login_page'))

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM batches WHERE id = %s", (batch_id,))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Batch deleted successfully!', 'success')
    except mysql.connector.Error as err:
        flash(f'Database Error: {err}', 'error')

    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    app.run(debug=True)