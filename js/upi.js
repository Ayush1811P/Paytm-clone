/**
 * UPI functionality for the PayMoney application
 */

// Initialize UPI page
document.addEventListener('DOMContentLoaded', function() {
  // Require authentication
  if (!requireAuth()) return;
  
  // Load UPI status
  loadUpiStatus();
  
  // Load linked banks
  loadLinkedBanks();
  
  // Load UPI transactions
  loadUpiTransactions();
  
  // Initialize link bank button
  const linkBankBtn = document.getElementById('linkBankBtn');
  if (linkBankBtn) {
    linkBankBtn.addEventListener('click', () => {
      document.getElementById('linkBankModal').style.display = 'block';
    });
  }
  
  // Initialize link bank form
  const linkBankForm = document.getElementById('linkBankForm');
  if (linkBankForm) {
    linkBankForm.addEventListener('submit', handleLinkBank);
  }
  
  // Initialize UPI setup button
  const setupUpiBtn = document.getElementById('setupUpiBtn');
  if (setupUpiBtn) {
    setupUpiBtn.addEventListener('click', () => {
      document.getElementById('setupUpiModal').style.display = 'block';
    });
  }
  
  // Initialize UPI setup forms
  const setupBankForm = document.getElementById('setupBankForm');
  if (setupBankForm) {
    setupBankForm.addEventListener('submit', handleSetupBank);
  }
  
  const createUpiForm = document.getElementById('createUpiForm');
  if (createUpiForm) {
    createUpiForm.addEventListener('submit', handleCreateUpi);
  }
  
  // Initialize complete setup button
  const completeSetupBtn = document.getElementById('completeSetupBtn');
  if (completeSetupBtn) {
    completeSetupBtn.addEventListener('click', handleCompleteSetup);
  }
  
  // Initialize send UPI button
  const sendUpiBtn = document.getElementById('sendUpiBtn');
  if (sendUpiBtn) {
    sendUpiBtn.addEventListener('click', () => {
      initSendUpiModal();
      document.getElementById('sendUpiModal').style.display = 'block';
    });
  }
  
  // Initialize copy UPI button
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      const upiId = document.getElementById('upiIdDisplay').textContent;
      navigator.clipboard.writeText(upiId).then(() => {
        showNotification('UPI ID copied to clipboard');
      });
    });
  }
});

// Load UPI status
function loadUpiStatus() {
  const noUpiAccount = document.getElementById('noUpiAccount');
  const upiAccountSection = document.getElementById('upiAccountSection');
  const upiIdDisplay = document.getElementById('upiIdDisplay');
  
  const upiDetails = getUpiDetails();
  
  if (upiDetails) {
    // User has UPI account
    if (noUpiAccount) noUpiAccount.classList.add('hidden');
    if (upiAccountSection) upiAccountSection.classList.remove('hidden');
    if (upiIdDisplay) upiIdDisplay.textContent = upiDetails.upiId;
  } else {
    // User doesn't have UPI account
    if (noUpiAccount) noUpiAccount.classList.remove('hidden');
    if (upiAccountSection) upiAccountSection.classList.add('hidden');
  }
}

// Load linked banks
function loadLinkedBanks() {
  const noBankAccounts = document.getElementById('noBankAccounts');
  const bankAccountsList = document.getElementById('bankAccountsList');
  
  const banks = getBanks();
  
  if (banks.length > 0) {
    // User has linked banks
    if (noBankAccounts) noBankAccounts.classList.add('hidden');
    if (bankAccountsList) {
      bankAccountsList.classList.remove('hidden');
      
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
      
      bankAccountsList.innerHTML = banksHTML;
    }
  } else {
    // User doesn't have linked banks
    if (noBankAccounts) noBankAccounts.classList.remove('hidden');
    if (bankAccountsList) bankAccountsList.classList.add('hidden');
  }
}

// Load UPI transactions
function loadUpiTransactions() {
  const upiTransactionsList = document.getElementById('upiTransactionsList');
  
  if (!upiTransactionsList) return;
  
  const transactions = getTransactions().filter(tx => 
    tx.description.includes('UPI') || tx.description.includes('Bank Transfer')
  );
  
  if (transactions.length === 0) {
    upiTransactionsList.innerHTML = `
      <div class="empty-transactions">
        <p>No UPI transactions yet</p>
      </div>
    `;
    return;
  }
  
  let transactionsHTML = '';
  
  transactions.forEach(transaction => {
    const isCredit = transaction.type === 'credit';
    
    transactionsHTML += `
      <div class="transaction-item">
        <div class="transaction-icon ${transaction.type}">
          ${isCredit ? '+' : '-'}
        </div>
        <div class="transaction-details">
          <div class="transaction-title">${transaction.description}</div>
          <div class="transaction-date">${formatDateTime(transaction.timestamp)}</div>
        </div>
        <div class="transaction-amount ${transaction.type}">
          ${isCredit ? '+' : '-'} ₹${formatCurrency(transaction.amount)}
        </div>
      </div>
    `;
  });
  
  upiTransactionsList.innerHTML = transactionsHTML;
}

// Mask account number
function maskAccountNumber(accountNumber) {
  if (!accountNumber) return '';
  
  const len = accountNumber.length;
  if (len <= 4) return accountNumber;
  
  return 'XXXX' + accountNumber.slice(-4);
}

// Handle link bank form submission
function handleLinkBank(e) {
  e.preventDefault();
  
  const accountNumber = document.getElementById('accountNumber').value.trim();
  const ifscCode = document.getElementById('ifscCode').value.trim().toUpperCase();
  const accountHolderName = document.getElementById('accountHolderName').value.trim();
  const bankMobileNumber = document.getElementById('bankMobileNumber').value.trim();
  
  // Validation
  if (!accountNumber || !ifscCode || !accountHolderName || !bankMobileNumber) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Extract bank name from IFSC code
  const bankName = getBankNameFromIFSC(ifscCode);
  
  // Add bank
  const bank = {
    id: generateRandomString(),
    name: bankName,
    accountNumber,
    ifscCode,
    accountHolderName,
    mobileNumber: bankMobileNumber,
    linkedAt: new Date().toISOString()
  };
  
  addBank(bank);
  
  // Close modal
  const linkBankModal = document.getElementById('linkBankModal');
  linkBankModal.style.display = 'none';
  
  // Show notification
  showNotification('Bank account linked successfully');
  
  // Reload linked banks
  loadLinkedBanks();
}

// Get bank name from IFSC code
function getBankNameFromIFSC(ifscCode) {
  // In a real app, this would be an API call or lookup
  // For demo, extract first 4 characters as bank code and map to bank name
  const bankCode = ifscCode.slice(0, 4);
  
  const bankCodes = {
    'SBIN': 'State Bank of India',
    'HDFC': 'HDFC Bank',
    'ICIC': 'ICICI Bank',
    'PUNB': 'Punjab National Bank',
    'UTIB': 'Axis Bank',
    'IOBA': 'Indian Overseas Bank',
    'CNRB': 'Canara Bank',
    'BARB': 'Bank of Baroda'
  };
  
  return bankCodes[bankCode] || 'Bank';
}

// Handle setup bank form submission
function handleSetupBank(e) {
  e.preventDefault();
  
  const accountNumber = document.getElementById('setupAccountNumber').value.trim();
  const ifscCode = document.getElementById('setupIfscCode').value.trim().toUpperCase();
  const accountHolderName = document.getElementById('setupAccountHolderName').value.trim();
  const bankMobileNumber = document.getElementById('setupBankMobileNumber').value.trim();
  
  // Validation
  if (!accountNumber || !ifscCode || !accountHolderName || !bankMobileNumber) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Extract bank name from IFSC code
  const bankName = getBankNameFromIFSC(ifscCode);
  
  // Add bank
  const bank = {
    id: generateRandomString(),
    name: bankName,
    accountNumber,
    ifscCode,
    accountHolderName,
    mobileNumber: bankMobileNumber,
    linkedAt: new Date().toISOString()
  };
  
  addBank(bank);
  
  // Go to next step
  const setupSteps = document.querySelectorAll('.setup-step');
  setupSteps[0].classList.remove('active');
  setupSteps[1].classList.add('active');
  
  // Show notification
  showNotification('Bank account linked successfully');
}

// Handle create UPI form submission
function handleCreateUpi(e) {
  e.preventDefault();
  
  const upiPrefix = document.getElementById('upiPrefix').value.trim().toLowerCase();
  const upiPin = document.getElementById('setupUpiPin').value;
  const confirmUpiPin = document.getElementById('confirmUpiPin').value;
  
  // Validation
  if (!upiPrefix) {
    showNotification('Please enter a UPI username', 'error');
    return;
  }
  
  if (!upiPin || !confirmUpiPin) {
    showNotification('Please enter UPI PIN', 'error');
    return;
  }
  
  if (upiPin !== confirmUpiPin) {
    showNotification('UPI PINs do not match', 'error');
    return;
  }
  
  if (upiPin.length !== 6 || !/^\d+$/.test(upiPin)) {
    showNotification('UPI PIN must be 6 digits', 'error');
    return;
  }
  
  // Create UPI ID
  const upiId = `${upiPrefix}@paymoney`;
  
  // Save UPI details
  const upiDetails = {
    upiId,
    pin: upiPin, // In a real app, this would be securely stored or not stored at all
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  setUpiDetails(upiDetails);
  
  // Show UPI ID in next step
  const newUpiId = document.getElementById('newUpiId');
  if (newUpiId) newUpiId.textContent = upiId;
  
  // Go to next step
  const setupSteps = document.querySelectorAll('.setup-step');
  setupSteps[1].classList.remove('active');
  setupSteps[2].classList.add('active');
  
  // Show notification
  showNotification('UPI ID created successfully');
}

// Handle complete setup
function handleCompleteSetup() {
  // Close modal
  const setupUpiModal = document.getElementById('setupUpiModal');
  setupUpiModal.style.display = 'none';
  
  // Show notification
  showNotification('UPI setup completed successfully');
  
  // Reload UPI status
  loadUpiStatus();
}

// Initialize send UPI modal
function initSendUpiModal() {
  const sendUpiForm = document.getElementById('sendUpiForm');
  const upiPaymentSources = document.getElementById('upiPaymentSources');
  
  if (sendUpiForm) {
    sendUpiForm.addEventListener('submit', handleSendUpi);
  }
  
  if (upiPaymentSources) {
    // Populate payment sources
    const banks = getBanks();
    const upiDetails = getUpiDetails();
    
    if (banks.length > 0 && upiDetails) {
      let sourcesHTML = '';
      
      banks.forEach((bank, index) => {
        sourcesHTML += `
          <div class="payment-source ${index === 0 ? 'selected' : ''}" data-id="${bank.id}">
            <input type="radio" name="paymentSource" id="source${bank.id}" class="payment-source-radio" ${index === 0 ? 'checked' : ''}>
            <div class="payment-source-icon">${bank.name.charAt(0)}</div>
            <div class="payment-source-details">
              <div class="payment-source-name">${bank.name}</div>
              <div class="payment-source-info">A/C: ${maskAccountNumber(bank.accountNumber)}</div>
            </div>
          </div>
        `;
      });
      
      upiPaymentSources.innerHTML = sourcesHTML;
      
      // Add click event to payment sources
      const paymentSources = document.querySelectorAll('.payment-source');
      paymentSources.forEach(source => {
        source.addEventListener('click', () => {
          // Remove selected class from all sources
          paymentSources.forEach(s => s.classList.remove('selected'));
          
          // Add selected class to clicked source
          source.classList.add('selected');
          
          // Check radio
          const radio = source.querySelector('input[type="radio"]');
          radio.checked = true;
        });
      });
    }
  }
}

// Handle send UPI form submission
function handleSendUpi(e) {
  e.preventDefault();
  
  const recipientUpiId = document.getElementById('recipientUpiId').value.trim();
  const upiSendAmount = document.getElementById('upiSendAmount').value;
  const upiSendNote = document.getElementById('upiSendNote').value.trim();
  
  // Validation
  if (!recipientUpiId) {
    showNotification('Please enter recipient UPI ID or mobile number', 'error');
    return;
  }
  
  if (!upiSendAmount || parseFloat(upiSendAmount) <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  // Get current wallet balance
  const currentBalance = getWalletBalance();
  
  if (parseFloat(upiSendAmount) > currentBalance) {
    showNotification('Insufficient balance', 'error');
    return;
  }
  
  // Show UPI PIN modal
  const upiPinModal = document.getElementById('upiPinModal');
  const sendUpiModal = document.getElementById('sendUpiModal');
  const pinRecipient = document.getElementById('pinRecipient');
  const pinAmount = document.getElementById('pinAmount');
  
  if (upiPinModal && pinRecipient && pinAmount) {
    pinRecipient.textContent = recipientUpiId;
    pinAmount.textContent = `₹${upiSendAmount}`;
    
    sendUpiModal.style.display = 'none';
    upiPinModal.style.display = 'block';
    
    // Initialize UPI PIN form
    const confirmPinBtn = document.getElementById('confirmPinBtn');
    const upiPin = document.getElementById('upiPin');
    
    if (confirmPinBtn && upiPin) {
      confirmPinBtn.addEventListener('click', () => {
        const enteredPin = upiPin.value;
        const upiDetails = getUpiDetails();
        
        if (!enteredPin) {
          showNotification('Please enter UPI PIN', 'error');
          return;
        }
        
        // In a real app, PIN verification would be handled securely
        if (enteredPin !== upiDetails.pin) {
          showNotification('Invalid UPI PIN', 'error');
          return;
        }
        
        // Process payment
        const newBalance = currentBalance - parseFloat(upiSendAmount);
        updateWalletBalance(newBalance);
        
        // Add transaction
        const transaction = {
          id: generateTransactionId(),
          type: 'debit',
          amount: parseFloat(upiSendAmount),
          description: `UPI Payment to ${recipientUpiId}${upiSendNote ? ` - ${upiSendNote}` : ''}`,
          timestamp: new Date().toISOString()
        };
        
        addTransaction(transaction);
        
        // Close modal
        upiPinModal.style.display = 'none';
        
        // Show notification
        showNotification(`Payment of ₹${formatCurrency(upiSendAmount)} successful`);
        
        // Reload UPI transactions
        loadUpiTransactions();
        
        // Clear form
        document.getElementById('recipientUpiId').value = '';
        document.getElementById('upiSendAmount').value = '';
        document.getElementById('upiSendNote').value = '';
        document.getElementById('upiPin').value = '';
      });
    }
  }
}