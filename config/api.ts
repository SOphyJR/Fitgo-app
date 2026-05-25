const API_URL = 'http://localhost:3000/api';

export const api = {
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
};

