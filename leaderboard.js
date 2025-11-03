// js/leaderboard.js
const AIRTABLE_TOKEN = 'patexRIpq121dAkNv.c89f5acafb91f5cb2cae096a0be786633f4a2d814208c8c2cd8b2a667436255a';
const BASE_ID = 'appvRPSQFOT42Xbo5';
const TABLE = 'Solutions';
const CURRENT_MONTH = 'Nov 2025';
const CORRECT_KILLER = "john doe";
const CORRECT_MOTIVE = "jealousy";

async function loadLeaderboard() {
  const res = await fetch(`https://api.airtable.com/v3/bases/${BASE_ID}/tables/${TABLE}/records?filterByFormula=AND({CorrectAnswer}=TRUE(), {CaseMonth}='${CURRENT_MONTH}')&sort[0][field]=TimeMins&sort[0][direction]=asc`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
  });
  const data = await res.json();
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = '';

  data.records.forEach((r, i) => {
    const row = document.createElement('tr');
    if (i < 3) row.classList.add(`rank-${i+1}`);
    row.innerHTML = `
      <td>#${i+1}</td>
      <td>${r.fields.DetectiveName}</td>
      <td>${r.fields.TimeMins}m</td>
      <td>${r.fields.Badge}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById('submitBtn').addEventListener('click', async () => {
  const name = document.getElementById('detectiveName').value.trim();
  const killer = document.getElementById('killer').value.trim().toLowerCase();
  const motive = document.getElementById('motive').value.trim().toLowerCase();
  const result = document.getElementById('result');

  if (!name || !killer || !motive) {
    result.textContent = "Fill all fields!";
    return;
  }

  const payload = {
    fields: {
      DetectiveName: name,
      Killer: killer,
      Motive: motive,
      CaseMonth: CURRENT_MONTH,
      Submitted: new Date().toISOString()
    }
  };

  await fetch(`https://api.airtable.com/v3/bases/${BASE_ID}/tables/${TABLE}/records`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const isCorrect = killer === CORRECT_KILLER && motive === CORRECT_MOTIVE;
  result.style.color = isCorrect ? 'lime' : 'red';
  result.textContent = isCorrect ? 'CORRECT! Check leaderboard.' : 'Wrong. Try again.';
  setTimeout(loadLeaderboard, 2000);
});

loadLeaderboard();
setInterval(loadLeaderboard, 30000);