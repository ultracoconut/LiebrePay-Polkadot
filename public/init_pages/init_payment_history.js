import { paymentHistoryController } from '../payment_history/payment_history_controller.js';
import { updateHistory } from '../payment_history/update_history.js';
import { updateControls } from '../update_ui/update_controls.js';
import { paginationState } from '../payment_history/pagination_state.js';


export function initPaymentHistory(){
   
   //DOM elements
   const prevBtn = document.getElementById('prev-page-btn');
   const nextBtn = document.getElementById('next-page-btn');
   
   //Setup buttons
   prevBtn.addEventListener('click', async () => {
    try {

      if (paginationState.currentPage > 0) {
          paginationState.currentPage--;
          await updateHistory(paginationState.currentPage);
          updateControls();
      }

     } catch (error) {
      console.error('Error loading previous page:', error);
       }
   });


  nextBtn.addEventListener('click', async () => {
    try {
      
      if (paginationState.currentPage < paginationState.totalPages - 1) {
          paginationState.currentPage++;
          await updateHistory(paginationState.currentPage);
          updateControls();
      }
     } catch (error) {
      console.error('Error loading next page:', error);
       }
  });

    //Call paymentHistory Controller at start
     paymentHistoryController();
}