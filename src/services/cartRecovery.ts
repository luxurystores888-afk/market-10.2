// cartRecovery.ts - Smart Cart Abandonment Recovery

export function setupCartAbandonmentRecovery(cartNotEmpty: () => boolean) {
  // Show recovery modal or notification if user tries to leave with items in cart
  window.addEventListener('beforeunload', (e) => {
    if (cartNotEmpty()) {
      showRecoveryNotification();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Wait! Complete your order for a special discount!');
      }
      // Optionally, show a custom modal here
      // e.preventDefault(); // Uncomment if you want to block navigation
    }
  });
}

function showRecoveryNotification() {
  alert('You left items in your cart! Complete your purchase now for 10% off.');
}
// Call in recovery check