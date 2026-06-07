const API_URL = 'https://fitgo-backend-production-03ee.up.railway.app/api';

export const api = {
  getUserByEmail: async (email: string) => {
  const res = await fetch(`${API_URL}/users/email/${encodeURIComponent(email)}`);
  return res.json();
},
  // Products
  getProducts: async (category?: string, search?: string) => {
    let url = `${API_URL}/products`;
    const params = [];
    if (category && category !== 'All') params.push(`category=${category}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) url += `?${params.join('&')}`;
    const res = await fetch(url);
    return res.json();
  },

  getProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
  },

  createProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Stores
  getStores: async () => {
    const res = await fetch(`${API_URL}/stores`);
    return res.json();
  },

  getStore: async (id: string) => {
    const res = await fetch(`${API_URL}/stores/${id}`);
    return res.json();
  },

 createStore: async (data: any) => {
  const res = await fetch(`${API_URL}/stores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
},

  // Users
  getUser: async (firebase_uid: string) => {
    const res = await fetch(`${API_URL}/users/${firebase_uid}`);
    return res.json();
  },

  createUser: async (data: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateUserStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Orders
  createOrder: async (data: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCustomerOrders: async (customer_id: string) => {
    const res = await fetch(`${API_URL}/orders/customer/${customer_id}`);
    return res.json();
  },

  getOrder: async (id: string) => {
    const res = await fetch(`${API_URL}/orders/${id}`);
    return res.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  // Auth / OTP
sendOTP: async (email: string, name: string) => {
  const res = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
},

verifyOTP: async (email: string, code: string) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return res.json();
},

resendOTP: async (email: string, name: string) => {
  const res = await fetch(`${API_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
},
approveUser: async (email: string) => {
  const res = await fetch(`${API_URL}/auth/approve-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
},
deleteAccount: async (firebase_uid: string) => {
  const res = await fetch(`${API_URL}/users/${firebase_uid}`, {
    method: 'DELETE',
  });
  return res.json();
},
updateUserStore: async (firebase_uid: string, store_id: string) => {
  const res = await fetch(`${API_URL}/users/${firebase_uid}/store`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_id }),
  });
  return res.json();
},

sendPhoneOTP: async (phone: string, role: string) => {
  const res = await fetch(`${API_URL}/auth/send-phone-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, role }),
  });
  return res.json();
},

verifyPhoneOTP: async (phone: string, code: string, role: string) => {
  const res = await fetch(`${API_URL}/auth/verify-phone-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code, role }),
  });
  return res.json();
},
initiatePayment: async (data: {
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  phone_number: string;
}) => {
  const res = await fetch(`${API_URL}/orders/initiate-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
},
rateStore: async (store_id: string, rating: number, customer_id: string) => {
  const res = await fetch(`${API_URL}/stores/${store_id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, customer_id }),
  });
  return res.json();
},

getTopStores: async () => {
  const res = await fetch(`${API_URL}/stores/top`);
  return res.json();
},
calculateRevenue: async (data: any) => {
  const res = await fetch(`${API_URL}/revenue/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
},

getRevenueSummary: async () => {
  const res = await fetch(`${API_URL}/revenue/summary`);
  return res.json();
},

checkTrial: async (user_id: string) => {
  const res = await fetch(`${API_URL}/revenue/check-trial/${user_id}`);
  return res.json();
},
reportDispute: async (data: {
  order_id: string;
  reported_by: string;
  reported_against: string;
  type: string;
  description: string;
}) => {
  const res = await fetch(`${API_URL}/disputes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
},

savePushToken: async (firebase_uid: string, push_token: string) => {
  const res = await fetch(`${API_URL}/users/${firebase_uid}/push-token`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ push_token }),
  });
  return res.json();
},

};
