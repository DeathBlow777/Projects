// VidyaEval - Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const loginRoleStudent = document.getElementById('login-role-student');
    const loginRoleTeacher = document.getElementById('login-role-teacher');

    // Logout Button Handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    // Add event listeners for role selection to update UI
    if (loginRoleStudent) {
        loginRoleStudent.addEventListener('change', function() {
            updateRoleSelection('login');
        });
    }
    
    if (loginRoleTeacher) {
        loginRoleTeacher.addEventListener('change', function() {
            updateRoleSelection('login');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const loginForm = document.getElementById('login-form');
        const loginBtn = document.getElementById('login-btn');
    
        // Replace the login button event listener in auth.js
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('login-role').value;
        
        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }
        
        // Submit the form to the server
        loginForm.submit();
    });
}
    });
    
    
    // Registration Form Handling
    const registerForm = document.getElementById('register-form');
    const registerBtn = document.getElementById('register-btn');
    const registerError = document.getElementById('register-error');
    const roleStudentRadio = document.getElementById('role-student');
    const roleTeacherRadio = document.getElementById('role-teacher');
    
    // Add event listeners for role selection to update UI
    if (roleStudentRadio) {
        roleStudentRadio.addEventListener('change', function() {
            updateRoleSelection('register');
        });
    }
        
    if (roleTeacherRadio) {
        roleTeacherRadio.addEventListener('change', function() {
            updateRoleSelection('register');
        });
    }
    
    // Replace the existing register button event listener in auth.js
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.querySelector('input[name="role"]:checked')?.value;
            let enrollment = '';
            let department = '';
            
            if (role === 'student') {
                enrollment = document.getElementById('enrollment').value;
            } else if (role === 'teacher') {
                department = document.getElementById('department').value;
            }
            
            // Enhanced validation
            if (!fullname || !email || !password || !confirmPassword) {
                showError('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }
            
            if (!role) {
                showError('Please select a role.');
                return;
            }

            if ((role === 'student' && !enrollment) || (role === 'teacher' && !department)) {
                showError(role === 'student' ? 'Please enter your roll number.' : 'Please enter your department.');
                return;
            }
            
            // Create form data to submit to server
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm-password', confirmPassword);
            formData.append('role', role);
            formData.append('enrollment', enrollment);
            formData.append('department', department);
            
            // Submit form to server
            fetch('/register', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    showError('An error occurred. Please try again.');
                }
            })
            .catch(error => {
                showError('An error occurred. Please try again.');
                console.error('Error:', error);
            });
        });
    }
    
    // Helper Functions
    function updateRoleSelection(formType) {
        if (formType === 'login') {
            const studentLabel = document.querySelector('label[for="login-role-student"]');
            const teacherLabel = document.querySelector('label[for="login-role-teacher"]');
            
            if (studentLabel && teacherLabel) {
                if (loginRoleStudent.checked) {
                    studentLabel.querySelector('i').classList.add('text-purple-400');
                    studentLabel.querySelector('i').classList.remove('text-gray-400');
                    teacherLabel.querySelector('i').classList.add('text-gray-400');
                    teacherLabel.querySelector('i').classList.remove('text-purple-400');
                } else if (loginRoleTeacher.checked) {
                    teacherLabel.querySelector('i').classList.add('text-purple-400');
                    teacherLabel.querySelector('i').classList.remove('text-gray-400');
                    studentLabel.querySelector('i').classList.add('text-gray-400');
                    studentLabel.querySelector('i').classList.remove('text-purple-400');
                }
            }
        } else if (formType === 'register') {
            const studentLabel = document.querySelector('label[for="role-student"]');
            const teacherLabel = document.querySelector('label[for="role-teacher"]');
            
            if (studentLabel && teacherLabel) {
                if (roleStudentRadio.checked) {
                    studentLabel.querySelector('i').classList.add('text-purple-400');
                    studentLabel.querySelector('i').classList.remove('text-gray-400');
                    teacherLabel.querySelector('i').classList.add('text-gray-400');
                    teacherLabel.querySelector('i').classList.remove('text-purple-400');
                } else if (roleTeacherRadio.checked) {
                    teacherLabel.querySelector('i').classList.add('text-purple-400');
                    teacherLabel.querySelector('i').classList.remove('text-gray-400');
                    studentLabel.querySelector('i').classList.add('text-gray-400');
                    studentLabel.querySelector('i').classList.remove('text-purple-400');
                }
            }
        }
    }
    
    function showError(message) {
        const errorDiv = document.getElementById('register-error') || document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            errorDiv.classList.add('block');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
                errorDiv.classList.remove('block');
            }, 5000);
        }
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if user is logged in (for dashboard pages)
    function checkAuth() {
        const currentPage = window.location.pathname;
        const userRole = localStorage.getItem('userRole');
        
        if (currentPage.includes('dashboard')) {
            if (!userRole) {
                window.location.href = 'index.html';
                return;
            }
            
            // Check if user is accessing the correct dashboard
            if (currentPage.includes('teacher-dashboard') && userRole !== 'teacher') {
                window.location.href = 'student-dashboard.html';
            } else if (currentPage.includes('student-dashboard') && userRole !== 'student') {
                window.location.href = 'teacher-dashboard.html';
            }
        }
    }

    // Run auth check on page load
    checkAuth();

    // Initialize floating labels
    const initFloatingLabels = () => {
        const inputs = document.querySelectorAll('.floating-label input');
        
        inputs.forEach(input => {
            // Set initial state
            updateFloatingLabel(input);
            
            // Add event listeners
            input.addEventListener('input', () => updateFloatingLabel(input));
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                updateFloatingLabel(input);
            });
        });
    };
    
    function updateFloatingLabel(input) {
        if (input.value) {
            input.classList.add('has-value');
            input.parentElement.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
            input.parentElement.classList.remove('has-value');
        }
    }

    // Add floating label styles
    const style = document.createElement('style');
    style.textContent = `
        .floating-label {
            position: relative;
            margin-bottom: 1rem;
        }

        .floating-label input {
            height: 56px;
            padding: 1.25rem 1rem 0.5rem;
            font-size: 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .floating-label input::placeholder {
            color: transparent;
            opacity: 0;
        }

        .floating-label label {
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            font-size: 1rem;
            color: #9CA3AF;
            pointer-events: none;
            transition: all 0.2s ease;
        }

        .floating-label.has-value label,
        .floating-label.focused label {
            top: 0.75rem;
            transform: translateY(0) scale(0.85);
            color: #8B5CF6;
        }

        .floating-label.focused input {
            border-color: #8B5CF6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
        }
    `;
    document.head.appendChild(style);

    // Initialize floating labels
    initFloatingLabels();

    // Password visibility toggle functionality
    // Toggle password visibility on login page
    const togglePasswordBtn = document.getElementById('toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Toggle password visibility on registration page
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', function() {
            const confirmPasswordInput = document.getElementById('confirm-password');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                confirmPasswordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}); 