import { initSinglePayment } from './init_pages/init_single_payment.js';
import { initMultiPayment } from './init_pages/init_multi_payment.js';
import { initPaymentHistory } from './init_pages/init_payment_history.js';
import { initFiatRamp } from './init_pages/init_fiat_ramp.js';
import { initAccountInfo } from './init_pages/init_account_info.js';

export const pageHandlers = {
  'single-payment': initSinglePayment,
  'multi-payment': initMultiPayment,
  'fiat-ramp': initFiatRamp,
  'payment-history': initPaymentHistory,
  'account-info': initAccountInfo
};
