/**
 * Authentication functionality for the PayMoney application
 */

// Initialize auth pages
document.addEventListener('DOMContentLoaded', function() {
  // Redirect if already logged in
  if (redirectIfLoggedIn()) return;
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    
    // Show password toggle
    const showPasswordCheckbox = document.getElementById('showPassword');
    const loginPassword = document.getElementById('loginPassword');
    
    if (showPasswordCheckbox && loginPassword) {
      showPasswordCheckbox.addEventListener('change', function() {
        loginPassword.type = this.checked ? 'text' : 'password';
      });
    }
    
    // Forgot password
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    
    if (forgotPasswordLink && forgotPasswordModal) {
      forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        forgotPasswordModal.style.display = 'block';
      });
      
      const resetPasswordForm = document.getElementById('resetPasswordForm');
      if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
      }
    }
  }
  
  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    
    // Password validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password && confirmPassword) {
      confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity('Passwords do not match');
        } else {
          confirmPassword.setCustomValidity('');
        }
      });
    }
  }
});

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const loginId = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Simple validation
  if (!loginId || !password) {
    showNotification('Please enter all fields', 'error');
    return;
  }
  
  // Demo login logic - In a real app, this would be an API call
  // For demo purposes, check if the user exists in local storage
  const users = JSON.parse(localStorage.getItem('paymoney_users') || '[]');
  const user = users.find(u => (u.email === loginId || u.phone === loginId) && u.password === password);
  
  if (user) {
    // Save logged in user (without password)
    const loggedInUser = { ...user };
    delete loggedInUser.password;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
    
    showNotification('Login successful! Redirecting...');
    
    // Initialize wallet if not exists
    if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
      updateWalletBalance(10000); // Set initial balance for demo
    }
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } else {
    showNotification('Invalid login credentials', 'error');
  }
}

// Handle register form submission
function handleRegister(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const termsAgree = document.getElementById('termsAgree').checked;
  
  // Validation
  if (!fullName || !email || !phone || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  if (!validatePhone(phone)) {
    showNotification('Please enter a valid 10-digit phone number', 'error');
    return;
  }
  
  if (!termsAgree) {
    showNotification('Please agree to the terms and conditions', 'error');
    return;
  }
  
  // Demo registration logic - In a real app, this would be an API call
  // For demo purposes, save user to local storage
  const users = JSON.parse(localStorage.getItem('paymoney_users') || '[]');
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    showNotification('Email already registered', 'error');
    return;
  }
  
  if (users.some(u => u.phone === phone)) {
    showNotification('Phone number already registered', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: generateRandomString(),
    name: fullName,
    email,
    phone,
    password,
    createdAt: new Date().toISOString()
  };
  
  // Save to users list
  users.push(newUser);
  localStorage.setItem('paymoney_users', JSON.stringify(users));
  
  // Also log the user in
  const loggedInUser = { ...newUser };
  delete loggedInUser.password;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
  
  // Initialize wallet
  updateWalletBalance(10000); // Set initial balance for demo
  
  // Initialize empty transactions
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  
  // Initialize profile
  const profile = {
    name: fullName,
    email: email,
    phone: phone,
    address: '',
    city: '',
    state: '',
    pincode: '',
    avatar: 'img/default-avatar.png'
  };
  updateProfile(profile);
  
  showNotification('Registration successful! Redirecting...');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

// Handle password reset
function handleResetPassword(e) {
  e.preventDefault();
  
  const resetEmail = document.getElementById('resetEmail').value.trim();
  
  if (!resetEmail || !validateEmail(resetEmail)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Demo reset logic - In a real app, this would send an email
  const modal = document.getElementById('forgotPasswordModal');
  modal.style.display = 'none';
  
  showNotification('Password reset link sent to your email');
}