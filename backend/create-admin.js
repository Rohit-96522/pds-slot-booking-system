const axios = require('axios');

async function createAdmin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'System Admin',
      email: 'admin@pds.gov.in',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890'
    });
    console.log('Admin created successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

createAdmin();
