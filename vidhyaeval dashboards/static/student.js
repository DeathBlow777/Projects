// SmartGrade - Student Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Recheck/Reassessment Request Form
    const examSelect = document.getElementById('exam-select');
    const recheckRadio = document.getElementById('recheck');
    const reassessmentRadio = document.getElementById('reassessment');
    const submitRequestBtn = document.querySelector('button:contains("Submit Request")');
    
    // Handle exam selection
    if (examSelect) {
        examSelect.addEventListener('change', function() {
            // Enable request type options when an exam is selected
            if (this.value) {
                if (recheckRadio) recheckRadio.disabled = false;
                if (reassessmentRadio) reassessmentRadio.disabled = false;
            } else {
                if (recheckRadio) recheckRadio.disabled = true;
                if (reassessmentRadio) reassessmentRadio.disabled = true;
            }
        });
    }
    
    // Handle request type selection
    const requestTypeContainers = document.querySelectorAll('.border.border-gray-300.rounded-md.p-4.cursor-pointer');
    if (requestTypeContainers.length > 0) {
        requestTypeContainers.forEach(container => {
            container.addEventListener('click', function() {
                // Remove selected class from all containers
                requestTypeContainers.forEach(c => {
                    c.classList.remove('border-blue-500', 'bg-blue-50');
                });
                
                // Add selected class to clicked container
                this.classList.add('border-blue-500', 'bg-blue-50');
                
                // Check the radio button
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    }
    
    // Handle form submission
    if (submitRequestBtn) {
        submitRequestBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            const selectedExam = examSelect.value;
            const selectedRequestType = document.querySelector('input[name="request-type"]:checked');
            const reason = document.getElementById('reason').value;
            
            if (!selectedExam) {
                alert('Please select an examination.');
                return;
            }
            
            if (!selectedRequestType) {
                alert('Please select a request type (Recheck or Reassessment).');
                return;
            }
            
            // Show confirmation dialog with fee information
            const fee = selectedRequestType.value === 'recheck' ? '₹150' : '₹250';
            const confirmMessage = `You are about to submit a ${selectedRequestType.value} request for the selected examination. A fee of ${fee} will be charged. Do you want to proceed?`;
            
            if (confirm(confirmMessage)) {
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
                
                // Simulate request submission
                simulateRequestSubmission(selectedExam, selectedRequestType.value, reason);
            }
        });
    }
    
    function simulateRequestSubmission(exam, requestType, reason) {
        // In a real application, this would be an API call to your backend
        // For demo purposes, we'll simulate the submission with a delay
        
        setTimeout(() => {
            // Show success message
            alert('Your request has been submitted successfully. You will be notified once it is processed.');
            
            // Reset form
            if (examSelect) examSelect.value = '';
            if (recheckRadio) recheckRadio.checked = false;
            if (reassessmentRadio) reassessmentRadio.checked = false;
            if (document.getElementById('reason')) document.getElementById('reason').value = '';
            
            // Remove selected class from request type containers
            requestTypeContainers.forEach(c => {
                c.classList.remove('border-blue-500', 'bg-blue-50');
            });
            
            // Reset button state
            if (submitRequestBtn) {
                submitRequestBtn.disabled = false;
                submitRequestBtn.innerHTML = 'Submit Request';
            }
        }, 1500);
    }
    
    // View Result Button Handling
    const viewButtons = document.querySelectorAll('button:has(i.fa-eye)');
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // In a real application, this would navigate to the result view page with the specific result ID
                window.location.href = 'result-view.html';
            });
        });
    }
    
    // Download Result Button Handling
    const downloadButtons = document.querySelectorAll('button:has(i.fa-download)');
    if (downloadButtons.length > 0) {
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                // In a real application, this would trigger a download of the result
                alert('Downloading result...');
                // Simulate download delay
                setTimeout(() => {
                    alert('Download complete!');
                }, 1000);
            });
        });
    }
    
    // Share Result Button Handling
    const shareButtons = document.querySelectorAll('button:has(i.fa-share-alt)');
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Create a simple share dialog
                const shareDialog = document.createElement('div');
                shareDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                shareDialog.innerHTML = `
                    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-medium text-gray-900">Share Result</h3>
                            <button class="text-gray-400 hover:text-gray-500" id="close-share-dialog">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="mb-4">
                            <label for="share-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="share-email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter recipient's email">
                        </div>
                        <div class="mb-4">
                            <label for="share-message" class="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                            <textarea id="share-message" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Add a personal message"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="send-share">
                                <i class="fas fa-paper-plane mr-2"></i> Send
                            </button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(shareDialog);
                
                // Handle close button
                document.getElementById('close-share-dialog').addEventListener('click', function() {
                    document.body.removeChild(shareDialog);
                });
                
                // Handle send button
                document.getElementById('send-share').addEventListener('click', function() {
                    const email = document.getElementById('share-email').value;
                    
                    if (!email) {
                        alert('Please enter a recipient email.');
                        return;
                    }
                    
                    // Show loading state
                    this.disabled = true;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
                    
                    // Simulate sending
                    setTimeout(() => {
                        alert(`Result shared successfully with ${email}!`);
                        document.body.removeChild(shareDialog);
                    }, 1500);
                });
            });
        });
    }
    
    // Fix for the :has() selector which might not be supported in all browsers
    // This is a polyfill for the button selectors used above
    if (viewButtons.length === 0) {
        document.querySelectorAll('button').forEach(button => {
            if (button.querySelector('i.fa-eye')) {
                button.addEventListener('click', function() {
                    window.location.href = 'result-view.html';
                });
            }
            
            if (button.querySelector('i.fa-download')) {
                button.addEventListener('click', function() {
                    alert('Downloading result...');
                    setTimeout(() => {
                        alert('Download complete!');
                    }, 1000);
                });
            }
            
            if (button.querySelector('i.fa-share-alt')) {
                // Share functionality would be implemented here (same as above)
            }
        });
    }
    
    // Fix for the :contains() selector which is not standard
    if (!submitRequestBtn) {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Submit Request')) {
                // The submit request button functionality would be implemented here (same as above)
            }
        });
    }
}); 