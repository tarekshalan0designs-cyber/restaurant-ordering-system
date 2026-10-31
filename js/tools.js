// ===== Bill splitter =====
var splitForm = document.getElementById("splitForm");
var result = document.getElementById("splitResult");

function setError(id, message) {
  document.getElementById(id).textContent = message;
  return message === "";
}

splitForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var bill = Number(document.getElementById("bill").value);
  var billRaw = document.getElementById("bill").value.trim();
  var peopleRaw = document.getElementById("people").value.trim();
  var people = Number(peopleRaw);
  var tip = Number(document.getElementById("tip").value);

  var okBill = true;
  if (billRaw === "") okBill = setError("billError", "Please enter the bill.");
  else if (isNaN(bill) || bill < 1 || bill > 1000) okBill = setError("billError", "Bill must be between 1 and 1000 JOD.");
  else setError("billError", "");

  var okPeople = true;
  if (peopleRaw === "") okPeople = setError("peopleError", "Please enter the number of people.");
  else if (!Number.isInteger(people) || people < 1 || people > 20) okPeople = setError("peopleError", "Enter a whole number from 1 to 20.");
  else setError("peopleError", "");

  if (!okBill || !okPeople) {
    result.hidden = true;
    return;
  }

  var tipAmount = bill * tip / 100;
  var total = bill + tipAmount;
  var each = total / people;
  result.innerHTML = "Bill: <strong>" + bill.toFixed(2) + " JOD</strong><br>" +
    "Tip (" + tip + "%): <strong>" + tipAmount.toFixed(2) + " JOD</strong><br>" +
    "Total: <strong>" + total.toFixed(2) + " JOD</strong><br>" +
    "Each person pays: <strong>" + each.toFixed(2) + " JOD</strong>";
  result.hidden = false;
});

splitForm.addEventListener("reset", function () {
  setError("billError", "");
  setError("peopleError", "");
  result.hidden = true;
});
