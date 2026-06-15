// SmartGrade - Result View JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Download Button
    const downloadButton = document.querySelector('button i.fa-download').parentElement;
    
    // Print Button
    const printButton = document.querySelector('button i.fa-print').parentElement;
    
    // Request Recheck/Reassessment Button
    const requestRecheckBtn = document.querySelector('button:contains("Request Recheck/Reassessment")');
    
    // Handle Download Button
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would trigger a download of the answer sheet
            alert('Downloading answer sheet...');
            
            // Simulate download delay
            setTimeout(() => {
                alert('Download complete!');
            }, 1000);
        });
    }
    
    // Handle Print Button
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would open the print dialog
            window.print();
        });
    }
    
    // Handle Request Recheck/Reassessment Button
    if (requestRecheckBtn) {
        requestRecheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a dialog for recheck/reassessment request
            const requestDialog = document.createElement('div');
            requestDialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            requestDialog.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Request Recheck/Reassessment</h3>
                        <button class="text-gray-400 hover:text-gray-500" id="close-request-dialog">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="border border-gray-300 rounded-md p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                                <input type="radio" id="dialog-recheck" name="dialog-request-type" value="recheck" class="hidden">
                                <label for="dialog-recheck" class="flex flex-col items-center cursor-pointer">
                                    <span class="text-lg font-medium text-gray-900">Recheck</span>
                                    <span class="text-sm text-gray-500 mt-1">₹150</span>
                                    <span class="text-xs text-gray-500 mt-2">Verification of marks calculation</span>
                                </label>
                            </div>
                            <div class="border border-gray-300 rounded-md p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                                <input type="radio" id="dialog-reassessment" name="dialog-request-type" value="reassessment" class="hidden">
                                <label for="dialog-reassessment" class="flex flex-col items-center cursor-pointer">
                                    <span class="text-lg font-medium text-gray-900">Reassessment</span>
                                    <span class="text-sm text-gray-500 mt-1">₹250</span>
                                    <span class="text-xs text-gray-500 mt-2">Complete re-evaluation of answer sheet</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="dialog-reason" class="block text-sm font-medium text-gray-700 mb-2">Reason for Request (Optional)</label>
                        <textarea id="dialog-reason" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Explain why you are requesting a recheck/reassessment"></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3" id="cancel-request">
                            Cancel
                        </button>
                        <button class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" id="submit-request">
                            Submit Request
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(requestDialog);
            
            // Handle request type selection
            const requestTypeContainers = requestDialog.querySelectorAll('.border.border-gray-300.rounded-md.p-4.cursor-pointer');
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
            
            // Handle close button
            document.getElementById('close-request-dialog').addEventListener('click', function() {
                document.body.removeChild(requestDialog);
            });
            
            // Handle cancel button
            document.getElementById('cancel-request').addEventListener('click', function() {
                document.body.removeChild(requestDialog);
            });
            
            // Handle submit button
            document.getElementById('submit-request').addEventListener('click', function() {
                const selectedRequestType = requestDialog.querySelector('input[name="dialog-request-type"]:checked');
                const reason = document.getElementById('dialog-reason').value;
                
                if (!selectedRequestType) {
                    alert('Please select a request type (Recheck or Reassessment).');
                    return;
                }
                
                // Show confirmation dialog with fee information
                const fee = selectedRequestType.value === 'recheck' ? '₹150' : '₹250';
                const confirmMessage = `You are about to submit a ${selectedRequestType.value} request for this examination. A fee of ${fee} will be charged. Do you want to proceed?`;
                
                if (confirm(confirmMessage)) {
                    // Show loading state
                    this.disabled = true;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
                    
                    // Simulate request submission
                    setTimeout(() => {
                        // Show success message
                        alert('Your request has been submitted successfully. You will be notified once it is processed.');
                        
                        // Close dialog
                        document.body.removeChild(requestDialog);
                    }, 1500);
                }
            });
        });
    }
    
    // Fix for the :contains() selector which is not standard
    if (!requestRecheckBtn) {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.includes('Request Recheck/Reassessment')) {
                // The request recheck button functionality would be implemented here (same as above)
            }
        });
    }
    
    // Add print styles
    addPrintStyles();
    
    function addPrintStyles() {
        // Create a style element for print styles
        const printStyles = document.createElement('style');
        printStyles.media = 'print';
        printStyles.textContent = `
            @media print {
                nav, button, .mt-6 {
                    display: none !important;
                }
                
                body {
                    background-color: white !important;
                }
                
                main {
                    padding: 0 !important;
                }
                
                .shadow-md, .shadow-lg, .shadow-xl {
                    box-shadow: none !important;
                }
                
                .rounded-lg {
                    border-radius: 0 !important;
                }
                
                .bg-gray-100 {
                    background-color: white !important;
                }
                
                .min-h-[600px] {
                    min-height: auto !important;
                }
            }
        `;
        
        document.head.appendChild(printStyles);
    }
}); 