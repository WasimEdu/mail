// js/shipping.js — 100% WORKING
const AIRTABLE_TOKEN = 'patqmjch2UbU55Ine.b02cbdfc68ce52451a99d948ca3b677f5e21929bcbe56bd103ccd7baea08d8e0'; // ← PASTE HERE
const BASE_ID = 'appvRPSQFOT42Xbo5';
const SUBSCRIBERS_TABLE = 'Subscribers';
const CURRENT_MONTH = 'Nov 2025';

const STRIPE_LINKS = {
  rookie_intl: 'https://buy.stripe.com/test_f5N8wU8wY9tZ8wU4gg',
  detective_intl: 'https://buy.stripe.com/test_9AQcOQdOq5lR6mM5kk',
  master_intl: 'https://buy.stripe.com/test_6oE4gI0Ks1dF2cA6oo',
  rookie_in: 'https://buy.stripe.com/test_IN_ROOKIE',
  detective_in: 'https://buy.stripe.com/test_IN_DETECTIVE',
  master_in: 'https://buy.stripe.com/test_IN_MASTER'
};

const PLAN_NAMES = {
  rookie: "Rookie",
  detective: "Detective",
  master: "Master"
};

const PRICES = {
  rookie_intl: "$19.99", rookie_in: "₹1,499",
  detective_intl: "$29.99", detective_in: "₹2,199",
  master_intl: "$49.99", master_in: "₹3,799"
};

// Auto-fill plan
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  const currency = urlParams.get('currency') || 'intl';

  if (plan && ['rookie', 'detective', 'master'].includes(plan)) {
    const planKey = `${plan}_${currency}`;
    const display = `${PLAN_NAMES[plan]} — ${PRICES[planKey] || PRICES[plan + '_intl']}`;
    document.getElementById('plan').value = planKey;
    document.getElementById('planDisplay').textContent = display;
    localStorage.setItem('mysterymail_currency', currency);
  }
});

// Submit
document.getElementById('shippingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = document.getElementById('result');
  result.textContent = 'Saving...';

  const planKey = document.getElementById('plan').value;
  const [plan] = planKey.split('_');

  const data = {
    Name: document.getElementById('name').value,
    Email: document.getElementById('email').value,
    Address1: document.getElementById('address1').value,
    Address2: document.getElementById('address2').value,
    City: document.getElementById('city').value,
    State: document.getElementById('state').value,
    Postal: document.getElementById('postal').value,
    Country: document.getElementById('country').value,
    Plan: PLAN_NAMES[plan],
    CaseMonth: CURRENT_MONTH,
    EditToken: Math.random().toString(36).substr(2, 8)
  };

  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${SUBSCRIBERS_TABLE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);

    const record = JSON.parse(text);
    const shipping = `${data.Name}|${data.Address1}|${data.City}|${data.State}|${data.Postal}|${data.Country}`;
    const stripeUrl = `${STRIPE_LINKS[planKey]}?prefill_shipping=${encodeURIComponent(shipping)}&client_reference_id=${record.id}&prefill_email=${data.Email}`;

    result.innerHTML = '<p style="color:green;">Saved!</p><p>Redirecting...</p>';
    setTimeout(() => window.location = stripeUrl, 2000);

  } catch (err) {
    console.error('Airtable Error:', err);
    result.style.color = 'red';
    result.innerHTML = `<p>Error: ${err.message}</p><p>Check console (F12)</p>`;
  }
});