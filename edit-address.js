// js/edit-address.js
const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const BASE_ID = 'YOUR_BASE_ID';
const TABLE = 'Subscribers';

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  document.getElementById('result').innerHTML = '<p style="color:red;">Invalid link.</p>';
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = document.getElementById('result');
  result.textContent = 'Updating...';

  const data = {
    Name: document.getElementById('name').value,
    Address1: document.getElementById('address1').value,
    Address2: document.getElementById('address2').value,
    City: document.getElementById('city').value,
    State: document.getElementById('state').value,
    Postal: document.getElementById('postal').value,
    Country: document.getElementById('country').value
  };

  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula={EditToken}='${token}'`, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
    });
    const json = await res.json();
    const record = json.records[0];
    if (!record) throw new Error();

    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}/${record.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });

    result.style.color = 'green';
    result.textContent = 'Address updated!';
  } catch (err) {
    result.style.color = 'red';
    result.textContent = 'Error. Try again.';
  }
});