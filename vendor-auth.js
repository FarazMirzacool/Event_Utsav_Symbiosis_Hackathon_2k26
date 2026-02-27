// ========== API CONFIGURATION ==========
const API_BASE_URL = 'http://localhost:5001/api/vendor';

// ========== DOM ELEMENTS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('vendorToken');
    if (token && window.location.pathname.includes('login')) {
        // Redirect to dashboard if already logged in
        window.location.href = 'vendor-dashboard.html';
    }
    
    // Add floating particles
    createParticles();
});

// ========== PARTICLES BACKGROUND ==========
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Add particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
        }
    }
`;
document.head.appendChild(style);

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <i class="fas fa-times toast-close" onclick="this.parentElement.remove()"></i>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// ========== PASSWORD VISIBILITY TOGGLE ==========
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========== FORM VALIDATION ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[1-9]\d{9,14}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(input, message) {
    input.classList.add('input-error');
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function clearError(input) {
    input.classList.remove('input-error');
    const error = input.parentElement.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

// ========== LOGIN HANDLER ==========
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]')?.checked || false;
    const loginBtn = document.getElementById('loginBtn');
    
    // Validate inputs
    if (!validateEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }
    
    if (!password) {
        showToast('Password Required', 'Please enter your password', 'error');
        return;
    }
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Logging in...</span> <div class="spinner"></div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store token
        localStorage.setItem('vendorToken', data.access_token);
        localStorage.setItem('vendor', JSON.stringify({
            id: data.vendor_id,
            business_name: data.business_name,
            owner_name: data.owner_name,
            verified: data.verified
        }));
        
        // Set session expiry if not remember me
        if (!remember) {
            setTimeout(() => {
                localStorage.removeItem('vendorToken');
                localStorage.removeItem('vendor');
            }, 24 * 60 * 60 * 1000); // 24 hours
        }
        
        showToast('Login Successful!', `Welcome back, ${data.business_name}!`, 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'vendor-dashboard.html';
        }, 1500);
        
    } catch (error) {
        showToast('Login Failed', error.message, 'error');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Login to Dashboard</span> <i class="fas fa-arrow-right"></i>';
    }
}

// ========== REGISTER HANDLER ==========
async function handleRegister(event) {
    event.preventDefault();
    
    const registerBtn = document.getElementById('registerBtn');
    
    // Get form values
    const formData = {
        business_name: document.getElementById('businessName')?.value.trim(),
        owner_name: document.getElementById('ownerName')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        phone: document.getElementById('phone')?.value.trim(),
        password: document.getElementById('password')?.value,
        confirmPassword: document.getElementById('confirmPassword')?.value,
        address: document.getElementById('address')?.value.trim(),
        description: document.getElementById('businessDesc')?.value.trim(),
        experience: parseInt(document.getElementById('experience')?.value) || 0,
        gst_number: document.getElementById('gstNumber')?.value.trim(),
        services: Array.from(document.getElementById('serviceCategory')?.selectedOptions || []).map(opt => opt.value),
        terms: document.getElementById('terms')?.checked
    };
    
    // Validation
    if (!formData.business_name) {
        showToast('Business Name Required', 'Please enter your business name', 'error');
        return;
    }
    
    if (!formData.owner_name) {
        showToast('Owner Name Required', 'Please enter owner name', 'error');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePhone(formData.phone)) {
        showToast('Invalid Phone', 'Please enter a valid phone number', 'error');
        return;
    }
    
    if (!validatePassword(formData.password)) {
        showToast('Weak Password', 'Password must be at least 6 characters', 'error');
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showToast('Password Mismatch', 'Passwords do not match', 'error');
        return;
    }
    
    if (formData.services.length === 0) {
        showToast('Services Required', 'Please select at least one service category', 'error');
        return;
    }
    
    if (!formData.terms) {
        showToast('Terms Required', 'Please accept the terms and conditions', 'error');
        return;
    }
    
    // Show loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span>Creating Account...</span> <div class="spinner"></div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        showToast('Registration Successful!', 'Your vendor account has been created. Please login.', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'vendor-login.html';
        }, 2000);
        
    } catch (error) {
        showToast('Registration Failed', error.message, 'error');
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<span>Create Vendor Account</span> <i class="fas fa-arrow-right"></i>';
    }
}

// ========== FORGOT PASSWORD ==========
function showForgotPassword() {
    openModal('forgotModal');
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!validateEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }
    
    showToast('Reset Link Sent', 'Please check your email for password reset instructions', 'success');
    closeModal('forgotModal');
}

// ========== SOCIAL LOGIN ==========
function socialLogin(provider) {
    showToast(`${provider} Login`, `Redirecting to ${provider} login...`, 'info');
    
    // In production, redirect to OAuth provider
    setTimeout(() => {
        showToast('Coming Soon', `${provider} login will be available soon!`, 'warning');
    }, 1500);
}

// ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ========== TERMS AND PRIVACY ==========
function showTerms() {
    showToast('Terms & Conditions', 'Opening terms and conditions...', 'info');
    // In production, open terms modal or page
}

function showPrivacy() {
    showToast('Privacy Policy', 'Opening privacy policy...', 'info');
    // In production, open privacy modal or page
}

// ========== REAL-TIME VALIDATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Add real-time validation to inputs
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                showError(this, 'This field is required');
            } else {
                clearError(this);
                
                // Specific validations
                if (this.type === 'email' && !validateEmail(this.value)) {
                    showError(this, 'Invalid email format');
                }
                
                if (this.id === 'phone' && !validatePhone(this.value)) {
                    showError(this, 'Invalid phone number');
                }
                
                if (this.type === 'password' && this.value.length < 6) {
                    showError(this, 'Password must be at least 6 characters');
                }
            }
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrength(strength);
        });
    }
});

// ========== PASSWORD STRENGTH INDICATOR ==========
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
}

function updatePasswordStrength(strength) {
    const strengthMap = {
        0: { text: 'Very Weak', color: '#EF4444' },
        1: { text: 'Weak', color: '#F59E0B' },
        2: { text: 'Fair', color: '#F59E0B' },
        3: { text: 'Good', color: '#10B981' },
        4: { text: 'Strong', color: '#10B981' },
        5: { text: 'Very Strong', color: '#10B981' }
    };
    
    let indicator = document.querySelector('.password-strength');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'password-strength';
        indicator.style.cssText = `
            margin-top: 5px;
            font-size: 0.8rem;
            font-weight: 500;
        `;
        document.getElementById('password').parentElement.appendChild(indicator);
    }
    
    const info = strengthMap[strength] || strengthMap[0];
    indicator.textContent = `Strength: ${info.text}`;
    indicator.style.color = info.color;
}

// ========== LOADING STATES ==========
function showLoading(button) {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span>Processing...</span> <div class="spinner"></div>';
    return originalText;
}

function hideLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

// ========== SESSION MANAGEMENT ==========
function checkAuth() {
    const token = localStorage.getItem('vendorToken');
    const vendor = JSON.parse(localStorage.getItem('vendor') || 'null');
    
    if (!token || !vendor) {
        // Redirect to login if not authenticated
        if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
            window.location.href = 'vendor-login.html';
        }
    }
    
    return { token, vendor };
}

function logout() {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendor');
    showToast('Logged Out', 'You have been successfully logged out', 'success');
    setTimeout(() => {
        window.location.href = 'vendor-login.html';
    }, 1500);
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Ctrl + L - Focus email input on login page
    if (e.ctrlKey && e.key === 'l' && window.location.pathname.includes('login')) {
        e.preventDefault();
        document.getElementById('email')?.focus();
    }
    
    // Escape - Close modal
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});

// ========== REMEMBER ME FUNCTIONALITY ==========
function setRememberMe(email) {
    if (email && document.querySelector('input[name="remember"]')?.checked) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
}

function getRememberedEmail() {
    return localStorage.getItem('rememberedEmail') || '';
}

// Auto-fill remembered email on login page
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput && window.location.pathname.includes('login')) {
        emailInput.value = getRememberedEmail();
    }
});