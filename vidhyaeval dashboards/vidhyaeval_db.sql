CREATE DATABASE vidhya_eval;
USE vidhya_eval;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL,
    enrollment VARCHAR(255),
    department VARCHAR(255)
);
ALTER TABLE users 
ADD COLUMN class VARCHAR(255),
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active';
ALTER TABLE users MODIFY role ENUM('student', 'teacher', 'admin') NOT NULL;
INSERT INTO users (fullname, email, password, role, enrollment, department) 
VALUES ('Admin User', 'admin@gmail.com', 'yourpassword', 'admin', NULL, NULL);
select * from users;








CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_email VARCHAR(255) NOT NULL,
    exam_type VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    question_paper VARCHAR(255) NOT NULL,
    answer_sheets TEXT NOT NULL,
    key_points TEXT,
    criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE evaluations CHANGE COLUMN id answersheet_no INT AUTO_INCREMENT;
select * from evaluations;









CREATE TABLE batches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_number ENUM('A', 'B', 'C') NOT NULL,
    course_name VARCHAR(255),
    teacher_assign VARCHAR(100),
    teacher_id INT,
    answer_key VARCHAR(255),
    answer_sheet VARCHAR(255),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

select * from batches;
drop table batches;
DESCRIBE batches;

-- Create the answer_sheets table
CREATE TABLE answer_sheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    answer_sheet_id VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    status ENUM('pending', 'reviewed') DEFAULT 'pending',
    score DECIMAL(5,2),
    feedback TEXT,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    INDEX (answer_sheet_id),
    INDEX (roll_number)
);
drop table answer_sheets;
