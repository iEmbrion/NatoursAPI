import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_51JFEBTLfS6qfeIIIAva0NMMYowiEKnbuLywtmTz7HPbVuTRbiHyb7WnSRnmsd16F0bO7cnybQtk2pplyf7e79KDO00Qthx8PFs'
    );

    // Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    // Create checkout form + Charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
