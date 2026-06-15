// VidyaEval - Teacher Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // File Upload Handling
    const questionPaperInput = document.getElementById('question-paper');
    const answerSheetsInput = document.getElementById('answer-sheets');
    const keyPointsFileInput = document.getElementById('key-points-file');
    const uploadedFilesContainer = document.getElementById('uploaded-files');
    const evaluationCriteria = document.getElementById('evaluation-criteria');
    
    // Start Evaluation Button
    const startEvaluationBtn = document.getElementById('start-evaluation');
    const resultsSection = document.getElementById('results-section');
    
    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear user data from localStorage
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            
            // Redirect to login page
            window.location.href = 'index.html?logout=true';
        });
    }
    
    // Handle Question Paper Upload
    if (questionPaperInput) {
        questionPaperInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2); // Convert to MB
                
                // Show file name near the input
                const fileLabel = this.parentElement.querySelector('p.mb-2');
                if (fileLabel) {
                    fileLabel.innerHTML = `<span class="font-semibold">${fileName}</span> (${fileSize} MB)`;
                }
                
                // Change background color to indicate successful upload
                this.parentElement.classList.add('bg-green-50');
                this.parentElement.classList.add('border-green-300');
            }
        });
    }
    
    // Handle Answer Sheets Upload
    if (answerSheetsInput) {
        answerSheetsInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                // Show the uploaded files container
                if (uploadedFilesContainer) {
                    uploadedFilesContainer.classList.remove('hidden');
                    
                    // Create list of uploaded files
                    const fileList = uploadedFilesContainer.querySelector('ul');
                    if (fileList) {
                        fileList.innerHTML = ''; // Clear existing items
                        
                        Array.from(this.files).forEach(file => {
                            const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
                            const fileItem = document.createElement('li');
                            fileItem.className = 'py-2 flex justify-between items-center';
                            fileItem.innerHTML = `
                                <div class="flex items-center">
                                    <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                                    <span class="text-sm text-gray-700">${file.name} (${fileSize} MB)</span>
                                </div>
                                <button class="text-red-500 hover:text-red-700">
                                    <i class="fas fa-times"></i>
                                </button>
                            `;
                            fileList.appendChild(fileItem);
                        });
                        
                        // Add event listeners to remove buttons
                        fileList.querySelectorAll('button').forEach(button => {
                            button.addEventListener('click', function() {
                                this.closest('li').remove();
                                
                                // Hide the container if no files are left
                                if (fileList.children.length === 0) {
                                    uploadedFilesContainer.classList.add('hidden');
                                }
                            });
                        });
                    }
                    
                    // Change background color to indicate successful upload
                    this.parentElement.classList.add('bg-green-50');
                    this.parentElement.classList.add('border-green-300');
                }
            }
        });
    }
    
    // Handle Key Points File Upload
    if (keyPointsFileInput) {
        keyPointsFileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2); // Convert to MB
                
                // Show file name near the input
                const fileLabel = this.parentElement;
                fileLabel.innerHTML = `
                    <span class="text-sm text-gray-700">${fileName} (${fileSize} MB)</span>
                    <button id="remove-key-points" class="ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-times"></i>
                    </button>
                    <input id="key-points-file" type="file" class="hidden" />
                `;
                
                // Re-attach event listener to the new input
                document.getElementById('key-points-file').addEventListener('change', arguments.callee);
                
                // Add event listener to remove button
                document.getElementById('remove-key-points').addEventListener('click', function(e) {
                    e.preventDefault();
                    fileLabel.innerHTML = `
                        Browse
                        <input id="key-points-file" type="file" class="hidden" />
                    `;
                    
                    // Re-attach event listener to the new input
                    document.getElementById('key-points-file').addEventListener('change', arguments.callee.caller);
                });
            }
        });
    }
    
    // Start Evaluation Process
    if (startEvaluationBtn) {
        startEvaluationBtn.addEventListener('click', function(e) {
            e.preventDefault();
        
            // Get form data
            const examType = document.getElementById('exam-type').value;
            const subject = document.getElementById('subject').value;
            const keyPoints = document.getElementById('key-points').value;
            const evaluationCriteria = document.getElementById('evaluation-criteria').value;
            const questionPaper = document.getElementById('question-paper').files[0];
            const answerSheets = document.getElementById('answer-sheets').files;
        
            // Validate required fields
            if (!examType || !subject || !questionPaper || answerSheets.length === 0) {
                alert('Please fill in all required fields (Exam Type, Subject, Question Paper, and Answer Sheets)');
                return;
            }
        
            // Create FormData object
            const formData = new FormData();
            formData.append('exam_type', examType);
            formData.append('subject', subject);
            formData.append('key_points', keyPoints);
            formData.append('evaluation_criteria', evaluationCriteria);
            formData.append('question_paper', questionPaper);
            for (let i = 0; i < answerSheets.length; i++) {
                formData.append('answer_sheets', answerSheets[i]);
            }
        
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        
            // Send data to Flask backend using the correct endpoint
            fetch('/submit-evaluation', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error('Server error: ' + text);
                    });
                }
                return response.text();
            })
            .then(html => {
                // Show success message
                alert('Evaluation submitted successfully!');
                // Handle the redirect or HTML response
                window.location.href = '/teacher-dashboard';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the evaluation: ' + error.message);
            })
            .finally(() => {
                // Reset button state
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-robot mr-2"></i> Start AI Evaluation';
            });
        });
    }
});