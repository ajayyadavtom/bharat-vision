const apiKey = "AQ.Ab8RN6JvFZ0lsLdd3Vpv6YB76fycOkTWtTnBRfQX5QeAB7WFoQ";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => console.log(data.models.map(m=>m.name).join('\n')));
