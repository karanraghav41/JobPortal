async function testRegister() {
  try {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'testuser' + Date.now() + '@example.com');
    formData.append('password', 'password123');
    formData.append('role', 'student');

    console.log('Sending register request...');
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

testRegister();
