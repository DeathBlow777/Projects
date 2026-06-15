// SmartGrade - Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const addBatchModal = document.getElementById('add-batch-modal');
    const addBatchForm = document.getElementById('add-batch-form');
    const closeAddBatchModal = document.getElementById('closeAddBatchModal');
    const cancelAddBatch = document.getElementById('cancel-add-batch');
    const teacherAssignSelect = document.getElementById('teacher_assign');
    const teacherIdInput = document.getElementById('teacher_id');

    if (teacherAssignSelect) {
        teacherAssignSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const teacherId = selectedOption.getAttribute('data-teacher-id');
            teacherIdInput.value = teacherId || '';
        });
    }

    document.getElementById('add-batch-btn')?.addEventListener('click', function() {
        addBatchModal.style.display = 'block';
    });

    closeAddBatchModal?.addEventListener('click', function() {
        addBatchModal.style.display = 'none';
        addBatchForm.reset();
    });

    cancelAddBatch?.addEventListener('click', function() {
        addBatchModal.style.display = 'none';
        addBatchForm.reset();
    });

    addBatchForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(addBatchForm);
        
        // Debug FormData contents
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        const batchNumber = formData.get('batch_number');
        const courseName = formData.get('course_name');
        const teacherAssign = formData.get('teacher_assign');

        if (!batchNumber || !courseName || !teacherAssign) {
            alert('Please fill in all required fields (Batch Number, Course Name, Teacher Assign).');
            return;
        }

        fetch('/add-batch', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showToast('Batch added successfully!');
                addBatchModal.style.display = 'none';
                addBatchForm.reset();
                window.location.reload();
            } else {
                return response.text().then(text => {
                    throw new Error('Error adding batch: ' + text);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while adding the batch.');
        });
    });

    // AI Model Selection
    const aiModelSelect = document.getElementById('ai-model');
    
    // Evaluation Threshold Slider
    const evaluationThreshold = document.getElementById('evaluation-threshold');
    
    // System Settings
    const enableGrammarCheck = document.getElementById('enable-grammar-check');
    const enablePlagiarism = document.getElementById('enable-plagiarism');
    const systemEmail = document.getElementById('system-email');
    const notificationFrequency = document.getElementById('notification-frequency');
    const enableEmailNotifications = document.getElementById('enable-email-notifications');
    const enableMaintenanceMode = document.getElementById('enable-maintenance-mode');
    
    // Save Changes Button
    const saveChangesBtn = document.querySelector('button:contains("Save Changes")');
    
    // Reset to Default Button
    const resetDefaultBtn = document.querySelector('button:contains("Reset to Default")');
    
    // User Action Buttons
    const editUserButtons = document.querySelectorAll('button i.fa-edit');
    const deleteUserButtons = document.querySelectorAll('button i.fa-trash');
    
    // Handle AI Model Selection
    if (aiModelSelect) {
        aiModelSelect.addEventListener('change', function() {
            // In a real application, this might update other settings based on the selected model
            console.log('AI Model changed to:', this.value);
        });
    }
    
    // Handle Evaluation Threshold Slider
    if (evaluationThreshold) {
        evaluationThreshold.addEventListener('input', function() {
            // Update a visual indicator or display the current value
            console.log('Evaluation Threshold changed to:', this.value);
        });
    }
    
    // Handle Maintenance Mode Toggle
    if (enableMaintenanceMode) {
        enableMaintenanceMode.addEventListener('change', function() {
            if (this.checked) {
                // Show confirmation dialog
                if (confirm('Enabling maintenance mode will make the system inaccessible to all users except administrators. Do you want to proceed?')) {
                    console.log('Maintenance Mode enabled');
                } else {
                    // Revert the checkbox if user cancels
                    this.checked = false;
                }
            } else {
                console.log('Maintenance Mode disabled');
            }
        });
    }
    
    // Handle Save Changes Button
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Collect all settings
            const settings = {
                aiModel: aiModelSelect ? aiModelSelect.value : null,
                evaluationThreshold: evaluationThreshold ? evaluationThreshold.value : null,
                enableGrammarCheck: enableGrammarCheck ? enableGrammarCheck.checked : null,
                enablePlagiarism: enablePlagiarism ? enablePlagiarism.checked : null,
                systemEmail: systemEmail ? systemEmail.value : null,
                notificationFrequency: notificationFrequency ? notificationFrequency.value : null,
                enableEmailNotifications: enableEmailNotifications ? enableEmailNotifications.checked : null,
                enableMaintenanceMode: enableMaintenanceMode ? enableMaintenanceMode.checked : null
            };
            
            // Validate settings
            if (settings.systemEmail && !isValidEmail(settings.systemEmail)) {
                alert('Please enter a valid system email address.');
                return;
            }
            
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
            
            // Simulate saving settings
            simulateSaveSettings(settings);
        });
    }
    
    // Handle Reset to Default Button
    if (resetDefaultBtn) {
        resetDefaultBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show confirmation dialog
            if (confirm('This will reset all settings to their default values. Do you want to proceed?')) {
                // Reset all settings to defaults
                if (aiModelSelect) aiModelSelect.value = 'standard';
                if (evaluationThreshold) evaluationThreshold.value = 75;
                if (enableGrammarCheck) enableGrammarCheck.checked = true;
                if (enablePlagiarism) enablePlagiarism.checked = true;
                if (systemEmail) systemEmail.value = 'admin@smartgrade.com';
                if (notificationFrequency) notificationFrequency.value = 'realtime';
                if (enableEmailNotifications) enableEmailNotifications.checked = true;
                if (enableMaintenanceMode) enableMaintenanceMode.checked = false;
                
                // Show success message
                showToast('Settings reset to default values.');
            }
        });
    }
    
    // Handle Edit User Buttons
    if (editUserButtons.length > 0) {
        editUserButtons.forEach(button => {
            button.parentElement.addEventListener('click', function() {
                // Get user data from the row
                const row = this.closest('tr');
                const name = row.querySelector('div.text-sm.font-medium.text-gray-900').textContent;
                const email = row.querySelector('div.text-sm.text-gray-900').textContent;
                const role = row.querySelector('span.inline-flex.items-center').textContent.trim();
                
                // Create edit user dialog
                createEditUserDialog(name, email, role);
            });
        });
    }
    
    // Handle Delete User Buttons
    if (deleteUserButtons.length > 0) {
        deleteUserButtons.forEach(button => {
            button.parentElement.addEventListener('click', function() {
                // Get user data from the row
                const row = this.closest('tr');
                const name = row.querySelector('div.text-sm.font-medium.text-gray-900').textContent;
                
                // Show confirmation dialog
                if (confirm(`Are you sure you want to delete the user "${name}"? This action cannot be undone.`)) {
                    // Show loading state
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    this.disabled = true;
                    
                    // Simulate deleting user
                    setTimeout(() => {
                        // Remove the row from the table
                        row.remove();
                        
                        // Show success message
                        showToast(`User "${name}" has been deleted.`);
                    }, 1000);
                }
            });
        });
    }
    
    // Helper Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function simulateSaveSettings(settings) {
        // In a real application, this would be an API call to your backend
        // For demo purposes, we'll simulate saving settings with a delay
        
        setTimeout(() => {
            // Reset button state
            if (saveChangesBtn) {
                saveChangesBtn.disabled = false;
                saveChangesBtn.innerHTML = 'Save Changes';
            }
            
            // Show success message
            showToast('Settings saved successfully!');
        }, 1500);
    }
    
    function createEditUserDialog(name, email, role) {
        // Create a dialog for editing user
        const editDialog = document.createElement('div');
        editDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        editDialog.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Edit User</h3>
                    <button class="text-gray-400 hover:text-gray-500" id="close-edit-dialog">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" id="edit-name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value="${name}">
                </div>
                <div class="mb-4">
                    <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="edit-email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value="${email}">
                </div>
                <div class="mb-4">
                    <label for="edit-role" class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select id="edit-role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="student" ${role === 'Student' ? 'selected' : ''}>Student</option>
                        <option value="teacher" ${role === 'Teacher' ? 'selected' : ''}>Teacher</option>
                        <option value="admin" ${role === 'Admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="edit-status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <div class="flex justify-end">
                    <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3" id="cancel-edit">
                        Cancel
                    </button>
                    <button class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="save-edit">
                        Save Changes
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(editDialog);
        
        // Handle close button
        document.getElementById('close-edit-dialog').addEventListener('click', function() {
            document.body.removeChild(editDialog);
        });
        
        // Handle cancel button
        document.getElementById('cancel-edit').addEventListener('click', function() {
            document.body.removeChild(editDialog);
        });
        
        // Handle save button
        document.getElementById('save-edit').addEventListener('click', function() {
            const newName = document.getElementById('edit-name').value;
            const newEmail = document.getElementById('edit-email').value;
            const newRole = document.getElementById('edit-role').value;
            const newStatus = document.getElementById('edit-status').value;
            
            // Validate inputs
            if (!newName || !newEmail) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(newEmail)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
            
            // Simulate saving changes
            setTimeout(() => {
                // Show success message
                showToast('User information updated successfully!');
                
                // Close dialog
                document.body.removeChild(editDialog);
            }, 1500);
        });
    }
    

    
    // Fix for the :contains() selector which is not standard
    if (!saveChangesBtn) {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Save Changes')) {
                // The save changes button functionality would be implemented here (same as above)
            }
        });
    }
    
    if (!resetDefaultBtn) {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Reset to Default')) {
                // The reset to default button functionality would be implemented here (same as above)
            }
        });
    }
    document.addEventListener('DOMContentLoaded', function() {
        addTeacherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addTeacherForm);
            fetch('/add-teacher', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    showToast('Teacher added successfully!');
                    addTeacherModal.style.display = 'none';
                    addTeacherForm.reset();
                } else {
                    response.text().then(text => alert('Error adding teacher: ' + text));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the teacher.');
            });
        });
    
        // Handle Add Student Form Submission
        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addStudentForm);
            fetch('/add-student', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    showToast('Student added successfully!');
                    addStudentModal.style.display = 'none';
                    addStudentForm.reset();
                } else {
                    response.text().then(text => alert('Error adding student: ' + text));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the student.');
            });
        });

        document.addEventListener('click', function(e) {
            if (e.target.closest('.delete-batch')) {
                const batchId = e.target.closest('.delete-batch').dataset.batchId;
                if (confirm('Are you sure you want to delete this batch?')) {
                    fetch(`/delete-batch/${batchId}`, {
                        method: 'POST'
                    })
                    .then(response => {
                        if (response.ok) {
                            showToast('Batch deleted successfully!');
                            e.target.closest('tr').remove();
                        } else {
                            response.text().then(text => alert('Error deleting batch: ' + text));
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while deleting the batch.');
                    });
                }
            }
        });

        function showToast(message) {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
            toast.textContent = message;
            
            // Add to document
            document.body.appendChild(toast);
            
            // Remove after 3 seconds
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    });
});