import toast from 'react-hot-toast';

export function handleError(response: any, showToast?: boolean) {
  let error = null;
  let result = null;
  if (response.ok) {
    if (response.status === 200 || response.status === 201) {
      result = response?.data?.data || response?.data;
    } else {
      error = response?.data?.message;
    }
  } else {
    const { data } = response;
    const { message } = data || {};
    if (showToast) {
      toast.error(message);
    }
    error = {
      value: response.problem,
      code: response.status,
      message,
      data: response.data,
    };
  }
  return { result, error };
}
