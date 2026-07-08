/**
 * Mobile Recharge functionality for the PayMoney application
 */

// Sample recharge plans
const RECHARGE_PLANS = {
  jio: {
    popular: [
      { amount: 239, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 299, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 749, validity: '90 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 2999, validity: '365 days', data: '2.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    data: [
      { amount: 15, validity: '1 day', data: '1GB', description: 'Data only plan' },
      { amount: 61, validity: '7 days', data: '6GB', description: 'Data only plan' },
      { amount: 151, validity: '30 days', data: '8GB', description: 'Data only plan' },
      { amount: 251, validity: '30 days', data: '50GB', description: 'Data only plan' }
    ],
    talktime: [
      { amount: 10, validity: 'N/A', data: 'N/A', description: 'Talktime ₹7.47 + GST' },
      { amount: 20, validity: 'N/A', data: 'N/A', description: 'Talktime ₹14.95 + GST' },
      { amount: 50, validity: 'N/A', data: 'N/A', description: 'Talktime ₹39.37 + GST' },
      { amount: 100, validity: 'N/A', data: 'N/A', description: 'Talktime ₹81.75 + GST' }
    ],
    unlimited: [
      { amount: 179, validity: '24 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 239, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 299, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ]
  },
  airtel: {
    popular: [
      { amount: 265, validity: '28 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 299, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 719, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 2999, validity: '365 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    data: [
      { amount: 19, validity: '1 day', data: '1GB', description: 'Data only plan' },
      { amount: 58, validity: '7 days', data: '6GB', description: 'Data only plan' },
      { amount: 118, validity: '15 days', data: '12GB', description: 'Data only plan' },
      { amount: 301, validity: '30 days', data: '50GB', description: 'Data only plan' }
    ],
    talktime: [
      { amount: 10, validity: 'N/A', data: 'N/A', description: 'Talktime ₹7.47 + GST' },
      { amount: 20, validity: 'N/A', data: 'N/A', description: 'Talktime ₹14.95 + GST' },
      { amount: 50, validity: 'N/A', data: 'N/A', description: 'Talktime ₹39.37 + GST' },
      { amount: 100, validity: 'N/A', data: 'N/A', description: 'Talktime ₹81.75 + GST' }
    ],
    unlimited: [
      { amount: 179, validity: '28 days', data: '1GB', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 265, validity: '28 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 299, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 549, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ]
  },
  vi: {
    popular: [
      { amount: 199, validity: '18 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 249, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 699, validity: '90 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 2999, validity: '365 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    data: [
      { amount: 17, validity: '1 day', data: '1GB', description: 'Data only plan' },
      { amount: 57, validity: '7 days', data: '7GB', description: 'Data only plan' },
      { amount: 107, validity: '15 days', data: '15GB', description: 'Data only plan' },
      { amount: 267, validity: '30 days', data: '25GB', description: 'Data only plan' }
    ],
    talktime: [
      { amount: 10, validity: 'N/A', data: 'N/A', description: 'Talktime ₹7.47 + GST' },
      { amount: 20, validity: 'N/A', data: 'N/A', description: 'Talktime ₹14.95 + GST' },
      { amount: 50, validity: 'N/A', data: 'N/A', description: 'Talktime ₹39.37 + GST' },
      { amount: 100, validity: 'N/A', data: 'N/A', description: 'Talktime ₹81.75 + GST' }
    ],
    unlimited: [
      { amount: 149, validity: '14 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 199, validity: '18 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 249, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 479, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ]
  },
  bsnl: {
    popular: [
      { amount: 187, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 247, validity: '28 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 397, validity: '30 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 1999, validity: '365 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    data: [
      { amount: 16, validity: '1 day', data: '2GB', description: 'Data only plan' },
      { amount: 57, validity: '10 days', data: '10GB', description: 'Data only plan' },
      { amount: 98, validity: '22 days', data: '2GB/day', description: 'Data only plan' },
      { amount: 151, validity: '28 days', data: '40GB', description: 'Data only plan' }
    ],
    talktime: [
      { amount: 10, validity: 'N/A', data: 'N/A', description: 'Talktime ₹7.47 + GST' },
      { amount: 20, validity: 'N/A', data: 'N/A', description: 'Talktime ₹14.95 + GST' },
      { amount: 50, validity: 'N/A', data: 'N/A', description: 'Talktime ₹39.37 + GST' },
      { amount: 100, validity: 'N/A', data: 'N/A', description: 'Talktime ₹81.75 + GST' }
    ],
    unlimited: [
      { amount: 107, validity: '14 days', data: '1GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 187, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 247, validity: '28 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { amount: 397, validity: '30 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ]
  }
};

// Current recharge state
let currentRecharge = {
  mobileNumber: '',
  operator: '',
  circle: '',
  plan: null
};

// Initialize recharge page
document.addEventListener('DOMContentLoaded', function() {
  // Require authentication
  if (!requireAuth()) return;
  
  // Initialize form
  const viewPlansBtn = document.getElementById('viewPlansBtn');
  if (viewPlansBtn) {
    viewPlansBtn.addEventListener('click', handleViewPlans);
  }
  
  // Initialize plan tabs
  const planTabs = document.querySelectorAll('.plan-tab');
  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      planTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show plans for selected category
      const category = tab.dataset.category;
      showPlans(currentRecharge.operator, category);
    });
  });
  
  // Initialize cancel button
  const cancelRechargeBtn = document.getElementById('cancelRechargeBtn');
  if (cancelRechargeBtn) {
    cancelRechargeBtn.addEventListener('click', () => {
      document.getElementById('rechargeConfirmation').classList.add('hidden');
      document.getElementById('plansContainer').classList.remove('hidden');
    });
  }
  
  // Initialize confirm button
  const confirmRechargeBtn = document.getElementById('confirmRechargeBtn');
  if (confirmRechargeBtn) {
    confirmRechargeBtn.addEventListener('click', handleConfirmRecharge);
  }
  
  // Initialize close success button
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      document.getElementById('rechargeSuccessModal').style.display = 'none';
      resetRechargeForm();
    });
  }
  
  // Initialize download receipt button
  const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
  if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener('click', () => {
      showNotification('Receipt has been downloaded');
    });
  }
});

// Handle view plans button
function handleViewPlans(e) {
  e.preventDefault();
  
  const mobileNumber = document.getElementById('mobileNumber').value.trim();
  const operator = document.getElementById('operator').value;
  const circle = document.getElementById('circle').value;
  
  // Validate inputs
  if (!mobileNumber || mobileNumber.length !== 10) {
    showNotification('Please enter a valid 10-digit mobile number', 'error');
    return;
  }
  
  if (!operator) {
    showNotification('Please select an operator', 'error');
    return;
  }
  
  if (!circle) {
    showNotification('Please select a circle', 'error');
    return;
  }
  
  // Update current recharge
  currentRecharge.mobileNumber = mobileNumber;
  currentRecharge.operator = operator;
  currentRecharge.circle = circle;
  
  // Show plans container
  document.getElementById('plansContainer').classList.remove('hidden');
  
  // Show plans for selected operator
  showPlans(operator, 'popular');
  
  // Scroll to plans
  document.getElementById('plansContainer').scrollIntoView({ behavior: 'smooth' });
}

// Show plans for selected operator and category
function showPlans(operator, category) {
  const plansList = document.getElementById('plansList');
  
  if (!plansList) return;
  
  // Get plans for selected operator and category
  const plans = RECHARGE_PLANS[operator]?.[category] || [];
  
  if (plans.length === 0) {
    plansList.innerHTML = '<p class="empty-plans">No plans available</p>';
    return;
  }
  
  let plansHTML = '';
  
  plans.forEach(plan => {
    plansHTML += `
      <div class="plan-card" data-amount="${plan.amount}" data-validity="${plan.validity}" data-data="${plan.data}">
        <div class="plan-amount">₹${plan.amount}</div>
        <div class="plan-validity">Validity: ${plan.validity}</div>
        <div class="plan-details">
          <div><span class="plan-tag">Data</span> ${plan.data}</div>
          <div>${plan.description}</div>
        </div>
      </div>
    `;
  });
  
  plansList.innerHTML = plansHTML;
  
  // Add click event to plan cards
  const planCards = document.querySelectorAll('.plan-card');
  planCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      planCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked card
      card.classList.add('selected');
      
      // Update current recharge
      currentRecharge.plan = {
        amount: card.dataset.amount,
        validity: card.dataset.validity,
        data: card.dataset.data
      };
      
      // Show confirmation
      showRechargeConfirmation();
    });
  });
}

// Show recharge confirmation
function showRechargeConfirmation() {
  const confirmMobile = document.getElementById('confirmMobile');
  const confirmOperator = document.getElementById('confirmOperator');
  const confirmCircle = document.getElementById('confirmCircle');
  const confirmPlan = document.getElementById('confirmPlan');
  const confirmAmount = document.getElementById('confirmAmount');
  
  if (confirmMobile) confirmMobile.textContent = currentRecharge.mobileNumber;
  if (confirmOperator) confirmOperator.textContent = getOperatorName(currentRecharge.operator);
  if (confirmCircle) confirmCircle.textContent = getCircleName(currentRecharge.circle);
  if (confirmPlan) confirmPlan.textContent = `${currentRecharge.plan.data} for ${currentRecharge.plan.validity}`;
  if (confirmAmount) confirmAmount.textContent = `₹${currentRecharge.plan.amount}`;
  
  // Hide plans container
  document.getElementById('plansContainer').classList.add('hidden');
  
  // Show confirmation container
  document.getElementById('rechargeConfirmation').classList.remove('hidden');
}

// Get operator name
function getOperatorName(operator) {
  switch (operator) {
    case 'jio':
      return 'Jio';
    case 'airtel':
      return 'Airtel';
    case 'vi':
      return 'Vi';
    case 'bsnl':
      return 'BSNL';
    default:
      return operator;
  }
}

// Get circle name
function getCircleName(circle) {
  switch (circle) {
    case 'delhi':
      return 'Delhi NCR';
    case 'mumbai':
      return 'Mumbai';
    case 'karnataka':
      return 'Karnataka';
    case 'tamilnadu':
      return 'Tamil Nadu';
    case 'up':
      return 'Uttar Pradesh';
    case 'maharashtra':
      return 'Maharashtra & Goa';
    case 'gujarat':
      return 'Gujarat';
    case 'westbengal':
      return 'West Bengal';
    case 'other':
      return 'Other';
    default:
      return circle;
  }
}

// Handle confirm recharge
function handleConfirmRecharge() {
  // Get current wallet balance
  const currentBalance = getWalletBalance();
  const rechargeAmount = parseFloat(currentRecharge.plan.amount);
  
  // Check if sufficient balance
  if (rechargeAmount > currentBalance) {
    showNotification('Insufficient balance. Please add money to your wallet.', 'error');
    return;
  }
  
  // Update wallet balance
  const newBalance = currentBalance - rechargeAmount;
  updateWalletBalance(newBalance);
  
  // Add transaction
  const transactionId = generateTransactionId();
  const transaction = {
    id: transactionId,
    type: 'debit',
    amount: rechargeAmount,
    description: `Mobile Recharge - ${currentRecharge.mobileNumber} (${getOperatorName(currentRecharge.operator)})`,
    timestamp: new Date().toISOString()
  };
  
  addTransaction(transaction);
  
  // Show success modal
  const successMobile = document.getElementById('successMobile');
  const successAmount = document.getElementById('successAmount');
  const transactionIdElement = document.getElementById('transactionId');
  const transactionTime = document.getElementById('transactionTime');
  
  if (successMobile) successMobile.textContent = currentRecharge.mobileNumber;
  if (successAmount) successAmount.textContent = `₹${currentRecharge.plan.amount}`;
  if (transactionIdElement) transactionIdElement.textContent = transactionId;
  if (transactionTime) transactionTime.textContent = formatDateTime(new Date());
  
  // Hide confirmation container
  document.getElementById('rechargeConfirmation').classList.add('hidden');
  
  // Show success modal
  document.getElementById('rechargeSuccessModal').style.display = 'block';
}

// Reset recharge form
function resetRechargeForm() {
  document.getElementById('mobileNumber').value = '';
  document.getElementById('operator').value = '';
  document.getElementById('circle').value = '';
  
  document.getElementById('plansContainer').classList.add('hidden');
  document.getElementById('rechargeConfirmation').classList.add('hidden');
  
  // Reset current recharge
  currentRecharge = {
    mobileNumber: '',
    operator: '',
    circle: '',
    plan: null
  };
  
  // Show notification
  showNotification('Mobile recharge completed successfully');
}