export function customConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('cb');
    const msgBox = document.getElementById('cb-message');
    const btnAccept = document.getElementById('cb-btn-accept');
    const btnCancel = document.getElementById('cb-btn-cancel');
    const overlay = document.getElementById('overlay');

    msgBox.textContent = message;
    modal.style.display = 'flex';
    overlay.style.display = 'flex';

    //Listeners
    const accept = () => {
      cleanup();
      resolve(true);
    };

    const cancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      btnAccept.removeEventListener('click', accept);
      btnCancel.removeEventListener('click', cancel);
      modal.style.display = 'none';
      overlay.style.display = 'none';
    };

    btnAccept.addEventListener('click', accept);
    btnCancel.addEventListener('click', cancel);
  });
}
