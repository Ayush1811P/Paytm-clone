/**
 * Utility functions for the PayMoney application
 */

// Local storage keys
const STORAGE_KEYS = {
  USER: 'paymoney_user',
  WALLET: 'paymoney_wallet',
  TRANSACTIONS: 'paymoney_transactions',
  BANKS: 'paymoney_banks',
  UPI: 'paymoney_upi',
  CARDS: 'paymoney_cards',
  PROFILE: 'paymoney_profile'
};

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Format currency
function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString('en-IN');
}

// Format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-IN', options);
}

// Format time
function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('en-IN', options);
}

// Format date and time
function formatDateTime(date) {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// Generate transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// Get user from local storage
function getUser() {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return !!getUser();
}

// Redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Redirect if already logged in
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return true;
  }
  return false;
}

// Get wallet balance
function getWalletBalance() {
  const wallet = localStorage.getItem(STORAGE_KEYS.WALLET);
  return wallet ? JSON.parse(wallet).balance : 10000; // Default balance for demo
}

// Update wallet balance
function updateWalletBalance(amount) {
  const wallet = {
    balance: amount,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
}

// Add transaction
function addTransaction(transaction) {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Get transactions
function getTransactions() {
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return transactions ? JSON.parse(transactions) : [];
}

// Get banks
function getBanks() {
  const banks = localStorage.getItem(STORAGE_KEYS.BANKS);
  return banks ? JSON.parse(banks) : [];
}

// Add bank
function addBank(bank) {
  const banks = getBanks();
  banks.push(bank);
  localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(banks));
}

// Get UPI details
function getUpiDetails() {
  const upi = localStorage.getItem(STORAGE_KEYS.UPI);
  return upi ? JSON.parse(upi) : null;
}

// Set UPI details
function setUpiDetails(upiDetails) {
  localStorage.setItem(STORAGE_KEYS.UPI, JSON.stringify(upiDetails));
}

// Get saved cards
function getSavedCards() {
  const cards = localStorage.getItem(STORAGE_KEYS.CARDS);
  return cards ? JSON.parse(cards) : [];
}

// Add card
function addCard(card) {
  const cards = getSavedCards();
  cards.push(card);
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

// Get profile
function getProfile() {
  const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (profile) {
    return JSON.parse(profile);
  }
  
  // Default profile
  const user = getUser();
  return {
    name: user ? user.name : 'User',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    avatar: 'img/default-avatar.png'
  };
}

// Update profile
function updateProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Handle mobile menu toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      
      // Toggle hamburger animation
      const bars = hamburger.querySelectorAll('.bar');
      bars[0].style.transform = mobileMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
      bars[1].style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
      bars[2].style.transform = mobileMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
  }
}

// Handle logout
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogout = document.getElementById('mobileLogout');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  if (mobileLogout) {
    mobileLogout.addEventListener('click', handleLogout);
  }
}

function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem(STORAGE_KEYS.USER);
  showNotification('Logged out successfully');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// Update user info in header
function updateUserInfo() {
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  if (userName || userAvatar) {
    const profile = getProfile();
    
    if (userName) {
      userName.textContent = profile.name;
    }
    
    if (userAvatar) {
      userAvatar.src = profile.avatar;
    }
  }
}

// Initialize modals
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Close modal when clicking close button
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// Initialize common elements
function initCommon() {
  initMobileMenu();
  initLogout();
  updateUserInfo();
  initModals();
}

// Generate a random string for IDs
function generateRandomString(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Mask credit card number
function maskCardNumber(number) {
  return number.slice(0, 4) + ' **** **** ' + number.slice(-4);
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}

// Validate password strength
function checkPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
}

// Update password strength meter
function updatePasswordStrengthMeter(password, meterElement, textElement) {
  const strength = checkPasswordStrength(password);
  let width = '0%';
  let color = '';
  let text = '';
  
  switch (strength) {
    case 0:
      width = '0%';
      color = '';
      text = 'Password strength';
      break;
    case 1:
      width = '20%';
      color = 'var(--error-color)';
      text = 'Very weak';
      break;
    case 2:
      width = '40%';
      color = 'var(--error-color)';
      text = 'Weak';
      break;
    case 3:
      width = '60%';
      color = 'var(--warning-color)';
      text = 'Medium';
      break;
    case 4:
      width = '80%';
      color = 'var(--success-color)';
      text = 'Strong';
      break;
    case 5:
      width = '100%';
      color = 'var(--success-color)';
      text = 'Very strong';
      break;
  }
  
  meterElement.style.width = width;
  meterElement.style.backgroundColor = color;
  textElement.textContent = text;
}

// Load external script
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize page when DOM is ready
document.addEventListener('DOMContentLoaded', initCommon);