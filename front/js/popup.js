// Вспливаюче вікно для виведення повідомлень 
// при успіху оформення замовлення та при кліку корзини 
// неавторизованим користувачен (салатовий і рожевий фон)
export const popUp = (message, status) => {
    const pooUpContainer = document.querySelector('.popup-container');
    pooUpContainer.innerHTML = `
        <div id="popup" class="popup">
            <p id="popup-message"></p>
        </div>`;
    const popup = document.getElementById("popup");
    if (status === 'danger') {
        popup.style.backgroundColor = '#fa9a9a';
    } 
    if (status === 'success') {
        popup.style.backgroundColor = '#b5ffcf';
    }
    
    const popupMessage = document.getElementById("popup-message");
    
    popupMessage.textContent = message;
    popup.style.display = "block";
    
    setTimeout(function() {
      closePopup();
    }, 1500); // Встановіть тривалість вікна тут (у мілісекундах)
}
  
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

