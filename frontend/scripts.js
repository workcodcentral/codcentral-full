
// In scripts.js
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
        console.error('Required form fields not found');
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    // Send to backend
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login successful, redirect to dashboard
                window.location.href = '/dashboard.html';
            } else {
                // Login failed, show error
                alert('Login failed: ' + data.message);
            }
        });
});

// Signup form handling
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Signup form submitted!');

        const name = document.querySelector('#signupForm input[type="text"]').value;
        const email = document.querySelector('#signupForm input[type="email"]').value;
        const password = document.querySelector('#signupForm input[type="password"]').value;
        const confirmPassword = document.querySelectorAll('#signupForm input[type="password"]')[1].value;

        console.log('Signup data:', { name, email, password, confirmPassword });
        
        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Send to backend
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Signup response:', data);
            if (data.success) {
                // ✅ ADD SUCCESS MESSAGE HERE:
                alert('✅ Account created successfully! Please login with your new account.');
                window.location.href = '/login.html';
            } else {
                // ✅ ADD ERROR MESSAGE HERE:
                alert('❌ Signup failed: ' + data.message);
            }
        })
        .catch(error => {
            console.log('Signup error:', error);
            alert('Signup error occurred');
        });
    });
}



// Check if user is logged in
//window.addEventListener('load', function () {
// Get user info from backend
//fetch('/api/user-info')
// .then(response => response.json())
//.then(data => {
// if (data.success) {
// User is logged in, show their name
// document.getElementById('userName').textContent = 'Welcome, ' +
// data.user.name;
// } else {
// User is not logged in, redirect to login
// window.location.href = '/login.html';
//  }
///});
//});

// Download button - ONLY if element exists
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection.style.display === 'none') {
            downloadSection.style.display = 'block';
            loadFiles();
        } else {
            downloadSection.style.display = 'none';
        }
    });
}
// Load available files
function loadFiles() {
    console.log('Loading files...');
    fetch('/api/files')
        .then(response => response.json())
        .then(data => {
            console.log('Files API response:', data);
            const filesList = document.getElementById('filesList');
            filesList.innerHTML = '';
            
            if (data.success && data.files && data.files.length > 0) {
                data.files.forEach(file => {
                    console.log('File:', file);
                    const fileDiv = document.createElement('div');
                    fileDiv.innerHTML = `
                        <div class="file-item">
                            <span>${file.name}</span>
                            <a href="/api/download/${file.id}" class="downloadlink">Download</a>
                        </div>
                    `;
                    filesList.appendChild(fileDiv);
                });
            } else {
                filesList.innerHTML = '<p>No files found</p>';
                console.log('No files returned or error:', data);
            }
        })
        .catch(error => {
            console.log('Error loading files:', error);
        });
}
// Submit button - ONLY if element exists  
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    submitBtn.addEventListener('click', function () {
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection.style.display === 'none') {
            uploadSection.style.display = 'block';
        } else {
            uploadSection.style.display = 'none';
        }
    });
}
// Upload file
const uploadFileBtn = document.getElementById('uploadFileBtn');
if (uploadFileBtn) {
    uploadFileBtn.addEventListener('click', function () {
        document.getElementById('uploadFileBtn').addEventListener('click',
            function () {
                const fileInput = document.getElementById('fileInput');
                const file = fileInput.files[0];
                if (!file) {
                    alert('Please select a file');
                    return;
                }
                const formData = new FormData();
                formData.append('file', file);
                fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById('uploadStatus').textContent = 'File uploaded successfully!';
                            fileInput.value = '';
                        } else {
                            document.getElementById('uploadStatus').textContent = 'Upload failed: ' + data.message;
                        }
                    });
            });
    });
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        document.getElementById('logoutBtn').addEventListener('click', function () {
            fetch('/api/logout', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    window.location.href = 'https://codcentral.top/';
                    console.log('User not logged in');
                });
        });
    });
}