import axios from 'axios';
import { showAlert } from './alert';

//update data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8080/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:8080/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated sucessfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
