export function updateTotalPayments(transferCount) {
  try {
    const totalPayments = document.getElementById('total-payments-display');
    
    if (!totalPayments) return;

    if (transferCount !== undefined && transferCount !== null) {
      totalPayments.textContent = `Total Payments: ${transferCount}`;
    } else {
      totalPayments.textContent = 'Total Payments: Not available';
    }

  } catch (error) {
    console.error('Error updating total payments:', error);
  }
}