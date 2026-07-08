/**
 * Utility functions for the PayMoney application (Supabase Integrated)
 */

// Show notification
function showNotification(message, type = 'success', position = '') {
  const notification = document.getElementById('notification');
  if(!notification) return;
  notification.textContent = message;
  notification.className = `notification ${type}`;
  if (position) {
    notification.classList.add(position);
  }
  notification.classList.add('show');
  
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

// Generate transaction ID (Local mock, optionally we can use DB uuid)
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// Get user from local session and database
async function getUser() {
  const userId = localStorage.getItem('paymoney_user_id');
  if (!userId) return null;
  
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error || !data) {
    localStorage.removeItem('paymoney_user_id');
    return null;
  }
  return data;
}

// Check if user is logged in
async function isLoggedIn() {
  const user = await getUser();
  return !!user;
}

// Redirect if not logged in
async function requireAuth() {
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Redirect if already logged in
async function redirectIfLoggedIn() {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    window.location.href = 'dashboard.html';
    return true;
  }
  return false;
}

// Get user profile from Supabase
async function getProfile() {
  const user = await getUser();
  if (!user) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

// Get wallet balance
async function getWalletBalance() {
  const profile = await getProfile();
  return profile ? parseFloat(profile.wallet_balance) : 0;
}

// Update wallet balance
async function updateWalletBalance(newBalance) {
  const user = await getUser();
  if (!user) return;
  
  const { error } = await supabaseClient
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', user.id);
    
  if (error) {
    console.error('Error updating wallet:', error);
  }
}

// Add transaction
async function addTransaction(amount, type, description, receiverId = null) {
  const user = await getUser();
  if (!user) return;

  const { error } = await supabaseClient
    .from('transactions')
    .insert([{
      sender_id: user.id,
      receiver_id: receiverId,
      amount: amount,
      transaction_type: type,
      description: description
    }]);

  if (error) {
    console.error('Error adding transaction:', error);
  }
}

// Get transactions
async function getTransactions() {
  const user = await getUser();
  if (!user) return [];

  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  return data;
}

// Handle mobile menu toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      
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

async function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('paymoney_user_id');
  showNotification('Logged out successfully');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

// Update user info in header
async function updateUserInfo() {
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  if (userName || userAvatar) {
    const profile = await getProfile();
    if(profile) {
      if (userName) {
        userName.textContent = profile.full_name;
      }
      if (userAvatar) {
        userAvatar.src = profile.avatar_url || 'img/default-avatar.png';
      }
    }
  }
}

// Initialize modals
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// Initialize common elements
async function initCommon() {
  initMobileMenu();
  initLogout();
  await updateUserInfo();
  initModals();
}

// Utility formatting
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
}

// Hash a password using SHA-256
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

document.addEventListener('DOMContentLoaded', initCommon);