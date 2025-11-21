export function customMessage(message) {

    const modal = document.getElementById("mb");
    const msgBox = document.getElementById("mb-message");
    const btnClose = document.getElementById("mb-btn-close");
    const overlay = document.getElementById("overlay");

    msgBox.textContent = message;

    overlay.style.display = "flex";
    modal.style.display = "flex";

    btnClose.onclick = () => {
        overlay.style.display = "none";
        modal.style.display = "none";
    };
}
