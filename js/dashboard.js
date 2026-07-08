/**
 * Dashboard functionality for the PayMoney application
 */

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Require authentication
  if (!requireAuth()) return;
  
  // Load wallet data
  loadWalletData();
  
  // Load transactions
  loadTransactions();
  
  // Initialize modals
  initAddMoneyModal();
  initSendMoneyModal();
});

// Load wallet data
function loadWalletData() {
  const walletBalanceElement = document.getElementById('walletBalance');
  const lastUpdatedElement = document.getElementById('lastUpdated');
  
  if (walletBalanceElement) {
    const walletData = localStorage.getItem(STORAGE_KEYS.WALLET);
    if (walletData) {
      const wallet = JSON.parse(walletData);
      walletBalanceElement.textContent = formatCurrency(wallet.balance);
      
      if (lastUpdatedElement && wallet.lastUpdated) {
        const lastUpdated = new Date(wallet.lastUpdated);
        const now = new Date();
        
        if (lastUpdated.toDateString() === now.toDateString()) {
          lastUpdatedElement.textContent = 'Today';
        } else {
          lastUpdatedElement.textContent = formatDate(lastUpdated);
        }
      }
    } else {
      // Initialize wallet with default balance for demo
      updateWalletBalance(10000);
      walletBalanceElement.textContent = '10,000';
      
      if (lastUpdatedElement) {
        lastUpdatedElement.textContent = 'Today';
      }
    }
  }
}

// Load transactions
function loadTransactions() {
  const transactionsList = document.getElementById('transactionsList');
  
  if (transactionsList) {
    const transactions = getTransactions();
    
    if (transactions.length === 0) {
      transactionsList.innerHTML = `
        <div class="empty-transactions">
          <p>No transactions yet</p>
        </div>
      `;
      return;
    }
    
    let transactionsHTML = '';
    const recentTransactions = transactions.slice(0, 5); // Show only the latest 5
    
    recentTransactions.forEach(transaction => {
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
    
    transactionsList.innerHTML = transactionsHTML;
  }
}

// Initialize Add Money modal
function initAddMoneyModal() {
  const addMoneyBtn = document.getElementById('addMoneyBtn');
  const addMoneyModal = document.getElementById('addMoneyModal');
  const addMoneyForm = document.getElementById('addMoneyForm');
  
  if (addMoneyBtn && addMoneyModal && addMoneyForm) {
    addMoneyBtn.addEventListener('click', function() {
      addMoneyModal.style.display = 'block';
    });
    
    addMoneyForm.addEventListener('submit', handleAddMoney);
  }
}

// Handle Add Money form submission
function handleAddMoney(e) {
  e.preventDefault();
  
  const addAmount = document.getElementById('addAmount').value;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  if (!addAmount || parseFloat(addAmount) <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  // Get current wallet balance
  const currentBalance = getWalletBalance();
  const newBalance = currentBalance + parseFloat(addAmount);
  
  // Update wallet balance
  updateWalletBalance(newBalance);
  
  // Add transaction
  const transaction = {
    id: generateTransactionId(),
    type: 'credit',
    amount: parseFloat(addAmount),
    description: `Added money via ${getPaymentMethodName(paymentMethod)}`,
    timestamp: new Date().toISOString()
  };
  
  addTransaction(transaction);
  
  // Close modal
  const addMoneyModal = document.getElementById('addMoneyModal');
  addMoneyModal.style.display = 'none';
  
  // Show notification
  showNotification(`Added ₹${formatCurrency(addAmount)} successfully`);
  
  // Reload wallet data
  loadWalletData();
  
  // Reload transactions
  loadTransactions();
}

// Get payment method name
function getPaymentMethodName(method) {
  switch (method) {
    case 'upi':
      return 'UPI';
    case 'card':
      return 'Card';
    case 'netbanking':
      return 'Net Banking';
    default:
      return method;
  }
}

// Initialize Send Money modal
function initSendMoneyModal() {
  const sendMoneyBtn = document.getElementById('sendMoneyBtn');
  const sendMoneyModal = document.getElementById('sendMoneyModal');
  const sendMoneyForm = document.getElementById('sendMoneyForm');
  
  if (sendMoneyBtn && sendMoneyModal && sendMoneyForm) {
    sendMoneyBtn.addEventListener('click', function() {
      sendMoneyModal.style.display = 'block';
    });
    
    sendMoneyForm.addEventListener('submit', handleSendMoney);
  }
}

// Handle Send Money form submission
function handleSendMoney(e) {
  e.preventDefault();
  
  const recipientMobile = document.getElementById('recipientMobile').value.trim();
  const sendAmount = document.getElementById('sendAmount').value;
  const sendNote = document.getElementById('sendNote').value.trim();
  
  if (!recipientMobile) {
    showNotification('Please enter recipient mobile number or UPI ID', 'error');
    return;
  }
  
  if (!sendAmount || parseFloat(sendAmount) <= 0) {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  // Get current wallet balance
  const currentBalance = getWalletBalance();
  
  if (parseFloat(sendAmount) > currentBalance) {
    showNotification('Insufficient balance', 'error');
    return;
  }
  
  const newBalance = currentBalance - parseFloat(sendAmount);
  
  // Update wallet balance
  updateWalletBalance(newBalance);
  
  // Add transaction
  const transaction = {
    id: generateTransactionId(),
    type: 'debit',
    amount: parseFloat(sendAmount),
    description: `Sent to ${recipientMobile}${sendNote ? ` - ${sendNote}` : ''}`,
    timestamp: new Date().toISOString()
  };
  
  addTransaction(transaction);
  
  // Close modal
  const sendMoneyModal = document.getElementById('sendMoneyModal');
  sendMoneyModal.style.display = 'none';
  
  // Show notification
  showNotification(`Sent ₹${formatCurrency(sendAmount)} successfully`);
  
  // Reload wallet data
  loadWalletData();
  
  // Reload transactions
  loadTransactions();
}