/**
 * Profile functionality for the PayMoney application
 */

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
  // Require authentication
  if (!requireAuth()) return;
  
  // Load profile data
  loadProfileData();
  
  // Initialize tabs
  initProfileTabs();
  
  // Initialize avatar change
  initAvatarChange();
  
  // Initialize personal info form
  const personalInfoForm = document.getElementById('personalInfoForm');
  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', handlePersonalInfoUpdate);
  }
  
  // Initialize password change form
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', handlePasswordChange);
    
    // Password strength meter
    const newPassword = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (newPassword && strengthBar && strengthText) {
      newPassword.addEventListener('input', () => {
        updatePasswordStrengthMeter(newPassword.value, strengthBar, strengthText);
      });
    }
  }
  
  // Initialize toggles
  initToggleSwitches();
  
  // Initialize add card
  const addCardBtn = document.getElementById('addCardBtn');
  if (addCardBtn) {
    addCardBtn.addEventListener('click', () => {
      document.getElementById('addCardModal').style.display = 'block';
    });
  }
  
  // Initialize add card form
  const addCardForm = document.getElementById('addCardForm');
  if (addCardForm) {
    addCardForm.addEventListener('submit', handleAddCard);
    
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
      cardNumber.addEventListener('input', formatCardNumberInput);
    }
    
    // Card expiry formatting
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
      cardExpiry.addEventListener('input', formatCardExpiryInput);
    }
  }
  
  // Initialize KYC submit
  const submitKycBtn = document.getElementById('submitKycBtn');
  if (submitKycBtn) {
    submitKycBtn.addEventListener('click', handleKycSubmit);
  }
  
  // Initialize document uploads
  initDocumentUploads();
});

// Load profile data
function loadProfileData() {
  const profile = getProfile();
  
  // Update profile header
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileAvatar = document.getElementById('profileAvatar');
  
  if (profileName) profileName.textContent = profile.name;
  if (profileEmail) profileEmail.textContent = profile.email;
  if (profileAvatar) profileAvatar.src = profile.avatar;
  
  // Update form fields
  const fullName = document.getElementById('fullName');
  const profileEmailInput = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const profileAddress = document.getElementById('profileAddress');
  const profileCity = document.getElementById('profileCity');
  const profileState = document.getElementById('profileState');
  const profilePincode = document.getElementById('profilePincode');
  
  if (fullName) fullName.value = profile.name;
  if (profileEmailInput) profileEmailInput.value = profile.email;
  if (profilePhone) profilePhone.value = profile.phone;
  if (profileAddress) profileAddress.value = profile.address || '';
  if (profileCity) profileCity.value = profile.city || '';
  if (profileState) profileState.value = profile.state || '';
  if (profilePincode) profilePincode.value = profile.pincode || '';
  
  // Update UPI status
  const upiDetails = getUpiDetails();
  const upiStatusBadge = document.getElementById('upiStatusBadge');
  const profileUpiId = document.getElementById('profileUpiId');
  
  if (upiStatusBadge && profileUpiId) {
    if (upiDetails) {
      upiStatusBadge.textContent = 'Active';
      upiStatusBadge.className = 'status-badge success';
      profileUpiId.textContent = upiDetails.upiId;
    } else {
      upiStatusBadge.textContent = 'Not Set Up';
      upiStatusBadge.className = 'status-badge';
      profileUpiId.textContent = '-';
    }
  }
  
  // Update banks list
  loadProfileBanks();
  
  // Update cards list
  loadSavedCards();
}

// Load profile banks
function loadProfileBanks() {
  const profileBanksList = document.getElementById('profileBanksList');
  const banks = getBanks();
  
  if (!profileBanksList) return;
  
  if (banks.length === 0) {
    profileBanksList.innerHTML = `
      <div class="empty-state">
        <p>No bank accounts linked yet</p>
        <button id="profileLinkBankBtn" class="btn btn-secondary">Link Bank Account</button>
      </div>
    `;
    
    const profileLinkBankBtn = document.getElementById('profileLinkBankBtn');
    if (profileLinkBankBtn) {
      profileLinkBankBtn.addEventListener('click', () => {
        window.location.href = 'upi.html';
      });
    }
    
    return;
  }
  
  let banksHTML = '';
  
  banks.forEach(bank => {
    banksHTML += `
      <div class="bank-account">
        <div class="bank-icon">${bank.name.charAt(0)}</div>
        <div class="bank-details">
          <div class="bank-name">${bank.name}</div>
          <div class="bank-account-number">A/C: ${maskAccountNumber(bank.accountNumber)}</div>
        </div>
      </div>
    `;
  });
  
  profileBanksList.innerHTML = banksHTML;
}

// Load saved cards
function loadSavedCards() {
  const savedCardsList = document.getElementById('savedCardsList');
  const cards = getSavedCards();
  
  if (!savedCardsList) return;
  
  if (cards.length === 0) {
    savedCardsList.innerHTML = `
      <div class="empty-state">
        <p>No saved cards yet</p>
        <button id="addCardBtn" class="btn btn-secondary">Add a Card</button>
      </div>
    `;
    
    const addCardBtn = document.getElementById('addCardBtn');
    if (addCardBtn) {
      addCardBtn.addEventListener('click', () => {
        document.getElementById('addCardModal').style.display = 'block';
      });
    }
    
    return;
  }
  
  let cardsHTML = '';
  
  cards.forEach(card => {
    cardsHTML += `
      <div class="bank-account">
        <div class="bank-icon">💳</div>
        <div class="bank-details">
          <div class="bank-name">${card.cardHolderName}</div>
          <div class="bank-account-number">${maskCardNumber(card.cardNumber)}</div>
        </div>
      </div>
    `;
  });
  
  savedCardsList.innerHTML = cardsHTML;
}

// Initialize profile tabs
function initProfileTabs() {
  const profileTabs = document.querySelectorAll('.profile-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      profileTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab panes
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Show selected tab pane
      const tabId = tab.dataset.tab;
      document.getElementById(`${tabId}Tab`).classList.add('active');
    });
  });
}

// Initialize avatar change
function initAvatarChange() {
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarModal = document.getElementById('avatarModal');
  
  if (changeAvatarBtn && avatarModal) {
    changeAvatarBtn.addEventListener('click', () => {
      avatarModal.style.display = 'block';
    });
  }
  
  const avatarUpload = document.getElementById('avatarUpload');
  const avatarPreview = document.getElementById('avatarPreview');
  const saveAvatarBtn = document.getElementById('saveAvatarBtn');
  
  if (avatarUpload && avatarPreview && saveAvatarBtn) {
    // Set initial preview
    avatarPreview.src = getProfile().avatar;
    
    // Handle file selection
    avatarUpload.addEventListener('change', () => {
      if (avatarUpload.files && avatarUpload.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          avatarPreview.src = e.target.result;
          saveAvatarBtn.disabled = false;
        };
        
        reader.readAsDataURL(avatarUpload.files[0]);
      }
    });
    
    // Handle save avatar
    saveAvatarBtn.addEventListener('click', () => {
      const profile = getProfile();
      profile.avatar = avatarPreview.src;
      updateProfile(profile);
      
      // Update profile avatar
      const profileAvatar = document.getElementById('profileAvatar');
      if (profileAvatar) profileAvatar.src = profile.avatar;
      
      // Update header avatar
      const userAvatar = document.getElementById('userAvatar');
      if (userAvatar) userAvatar.src = profile.avatar;
      
      // Close modal
      avatarModal.style.display = 'none';
      
      // Show notification
      showNotification('Profile picture updated successfully');
    });
  }
}

// Handle personal info update
function handlePersonalInfoUpdate(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const profileDob = document.getElementById('profileDob').value;
  const profileEmail = document.getElementById('profileEmail').value.trim();
  const profileAddress = document.getElementById('profileAddress').value.trim();
  const profileCity = document.getElementById('profileCity').value.trim();
  const profileState = document.getElementById('profileState').value.trim();
  const profilePincode = document.getElementById('profilePincode').value.trim();
  
  // Validation
  if (!fullName || !profileEmail) {
    showNotification('Name and email are required', 'error');
    return;
  }
  
  if (!validateEmail(profileEmail)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Update profile
  const profile = getProfile();
  profile.name = fullName;
  profile.email = profileEmail;
  profile.dob = profileDob;
  profile.address = profileAddress;
  profile.city = profileCity;
  profile.state = profileState;
  profile.pincode = profilePincode;
  
  updateProfile(profile);
  
  // Update profile header
  const profileName = document.getElementById('profileName');
  const profileEmailDisplay = document.getElementById('profileEmail');
  
  if (profileName) profileName.textContent = profile.name;
  if (profileEmailDisplay) profileEmailDisplay.textContent = profile.email;
  
  // Update header user name
  const userName = document.getElementById('userName');
  if (userName) userName.textContent = profile.name;
  
  // Show notification
  showNotification('Profile updated successfully');
}

// Handle password change
function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
  // Validation
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (newPassword !== confirmNewPassword) {
    showNotification('New passwords do not match', 'error');
    return;
  }
  
  // In a real app, this would be an API call to verify current password
  // For demo, check if current password matches stored password
  const users = JSON.parse(localStorage.getItem('paymoney_users') || '[]');
  const user = getUser();
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex === -1 || users[userIndex].password !== currentPassword) {
    showNotification('Current password is incorrect', 'error');
    return;
  }
  
  // Update password
  users[userIndex].password = newPassword;
  localStorage.setItem('paymoney_users', JSON.stringify(users));
  
  // Clear form
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  
  // Reset strength meter
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  
  if (strengthBar && strengthText) {
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = '';
    strengthText.textContent = 'Password strength';
  }
  
  // Show notification
  showNotification('Password updated successfully');
}

// Initialize toggle switches
function initToggleSwitches() {
  const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const toggleName = toggle.id;
      const isChecked = toggle.checked;
      
      // In a real app, this would save the setting to the user's profile
      console.log(`Toggle ${toggleName} set to ${isChecked}`);
      
      showNotification(`Setting updated successfully`);
    });
  });
}

// Format card number input
function formatCardNumberInput(e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, '');
  let formattedValue = '';
  
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value[i];
  }
  
  input.value = formattedValue;
}

// Format card expiry input
function formatCardExpiryInput(e) {
  let input = e.target;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 2) {
    input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
  } else {
    input.value = value;
  }
}

// Handle add card
function handleAddCard(e) {
  e.preventDefault();
  
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const cardExpiry = document.getElementById('cardExpiry').value;
  const cardCvv = document.getElementById('cardCvv').value;
  const cardHolderName = document.getElementById('cardHolderName').value.trim();
  const saveCardConsent = document.getElementById('saveCardConsent').checked;
  
  // Validation
  if (!cardNumber || !cardExpiry || !cardCvv || !cardHolderName) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (!saveCardConsent) {
    showNotification('Please agree to save your card', 'error');
    return;
  }
  
  // Add card
  const card = {
    id: generateRandomString(),
    cardNumber,
    cardExpiry,
    cardHolderName,
    savedAt: new Date().toISOString()
  };
  
  addCard(card);
  
  // Close modal
  const addCardModal = document.getElementById('addCardModal');
  addCardModal.style.display = 'none';
  
  // Show notification
  showNotification('Card added successfully');
  
  // Reload saved cards
  loadSavedCards();
}

// Initialize document uploads
function initDocumentUploads() {
  const idProofUpload = document.getElementById('idProofUpload');
  const addressProofUpload = document.getElementById('addressProofUpload');
  
  if (idProofUpload) {
    idProofUpload.addEventListener('change', () => {
      if (idProofUpload.files && idProofUpload.files[0]) {
        const fileName = idProofUpload.files[0].name;
        const uploadLabel = idProofUpload.nextElementSibling;
        uploadLabel.querySelector('span').textContent = fileName;
      }
    });
  }
  
  if (addressProofUpload) {
    addressProofUpload.addEventListener('change', () => {
      if (addressProofUpload.files && addressProofUpload.files[0]) {
        const fileName = addressProofUpload.files[0].name;
        const uploadLabel = addressProofUpload.nextElementSibling;
        uploadLabel.querySelector('span').textContent = fileName;
      }
    });
  }
}

// Handle KYC submit
function handleKycSubmit() {
  const idProofUpload = document.getElementById('idProofUpload');
  const addressProofUpload = document.getElementById('addressProofUpload');
  
  if (!idProofUpload.files || !idProofUpload.files[0]) {
    showNotification('Please upload ID proof', 'error');
    return;
  }
  
  if (!addressProofUpload.files || !addressProofUpload.files[0]) {
    showNotification('Please upload address proof', 'error');
    return;
  }
  
  // In a real app, this would upload the documents to the server
  
  // Update KYC status
  const kycStatusBadge = document.getElementById('kycStatusBadge');
  if (kycStatusBadge) {
    kycStatusBadge.textContent = 'Under Review';
    kycStatusBadge.className = 'status-badge primary';
  }
  
  // Show notification
  showNotification('KYC documents submitted successfully');
}