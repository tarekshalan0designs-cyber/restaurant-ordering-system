// ===== Order form: validation + calculation + report =====
var TAX_RATE = 0.16;          // 16% sales tax
var DELIVERY_FEE = 2.0;       // JOD
var DISCOUNT_LIMIT = 25;      // discount if food subtotal >= 25 JOD
var DISCOUNT_RATE = 0.10;     // 10%

var form = document.getElementById("orderForm");
var report = document.getElementById("report");

// ---------- helpers ----------
function showError(inputId, errorId, message) {
  var input = inputId ? document.getElementById(inputId) : null;
  var span = document.getElementById(errorId);
  span.textContent = message;
  if (input) {
    input.classList.toggle("invalid", message !== "");
    input.classList.toggle("valid", message === "");
  }
  return message === "";
}

function money(n) {
  return n.toFixed(2) + " JOD";
}

function getOrderType() {
  var radios = document.getElementsByName("orderType");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return "";
}

// ---------- validation functions (one per field) ----------
function validateName() {
  var v = document.getElementById("fullName").value.trim();
  if (v === "") return showError("fullName", "fullNameError", "Please enter your name.");
  if (v.length < 3 || v.length > 40) return showError("fullName", "fullNameError", "Name must be 3 to 40 characters.");
  if (!/^[A-Za-z؀-ۿ ]+$/.test(v)) return showError("fullName", "fullNameError", "Use letters and spaces only.");
  return showError("fullName", "fullNameError", "");
}

function validatePhone() {
  var v = document.getElementById("phone").value.trim();
  if (v === "") return showError("phone", "phoneError", "Please enter your phone number.");
  if (!/^07[789][0-9]{7}$/.test(v)) return showError("phone", "phoneError", "Enter a valid mobile number like 0791234567.");
  return showError("phone", "phoneError", "");
}

function validateEmail() {
  var v = document.getElementById("email").value.trim();
  if (v === "") return showError("email", "emailError", "Please enter your email.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return showError("email", "emailError", "Enter a valid email like name@example.com.");
  return showError("email", "emailError", "");
}

function validateItems() {
  var inputs = document.querySelectorAll("input[data-price][name^='qty_']");
  var total = 0;
  var ok = true;
  for (var i = 0; i < inputs.length; i++) {
    var raw = inputs[i].value.trim();
    var q = Number(raw);
    if (raw === "" || !Number.isInteger(q) || q < 0 || q > 20) {
      inputs[i].classList.add("invalid");
      ok = false;
    } else {
      inputs[i].classList.remove("invalid");
      total += q;
    }
  }
  if (!ok) return showError(null, "itemsError", "Each quantity must be a whole number from 0 to 20.");
  if (total === 0) return showError(null, "itemsError", "Please choose at least one dish.");
  return showError(null, "itemsError", "");
}

function validateOrderType() {
  if (getOrderType() === "") return showError(null, "orderTypeError", "Please choose pick up, dine in or delivery.");
  return showError(null, "orderTypeError", "");
}

function validateDate() {
  var v = document.getElementById("date").value;
  if (v === "") return showError("date", "dateError", "Please choose a date.");
  var chosen = new Date(v + "T00:00:00");
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var max = new Date(today);
  max.setDate(max.getDate() + 30);
  if (chosen < today) return showError("date", "dateError", "The date cannot be in the past.");
  if (chosen > max) return showError("date", "dateError", "You can order up to 30 days ahead.");
  return showError("date", "dateError", "");
}

function validateSlot() {
  if (document.getElementById("slot").value === "") return showError("slot", "slotError", "Please choose a time slot.");
  return showError("slot", "slotError", "");
}

function validateDelivery() {
  var area = document.getElementById("area");
  var address = document.getElementById("address");
  if (getOrderType() !== "delivery") {
    showError("area", "areaError", "");
    area.classList.remove("valid");
    showError("address", "addressError", "");
    address.classList.remove("valid");
    return true;
  }
  var a = showError("area", "areaError", area.value.trim() === "" ? "Please enter your delivery area." : "");
  var b = true;
  var t = address.value.trim();
  if (t === "") b = showError("address", "addressError", "Please enter your address.");
  else if (t.length < 10) b = showError("address", "addressError", "Address is too short (at least 10 characters).");
  else b = showError("address", "addressError", "");
  return a && b;
}

function validatePayment() {
  if (document.getElementById("payment").value === "") return showError("payment", "paymentError", "Please choose a payment method.");
  return showError("payment", "paymentError", "");
}

function validateNotes() {
  var v = document.getElementById("notes").value;
  if (v.length > 200) return showError("notes", "notesError", "Notes are too long (" + v.length + "/200).");
  return showError("notes", "notesError", "");
}

function validateAgree() {
  if (!document.getElementById("agree").checked) return showError(null, "agreeError", "Please tick the box to confirm.");
  return showError(null, "agreeError", "");
}

// ---------- calculation + report ----------
function buildReport() {
  var type = getOrderType();
  var typeLabel = { pickup: "Pick up", dine: "Dine in", delivery: "Delivery" }[type];

  // dishes
  var lines = [];
  var subtotal = 0;
  var count = 0;
  var inputs = document.querySelectorAll("input[data-price][name^='qty_']");
  for (var i = 0; i < inputs.length; i++) {
    var q = Number(inputs[i].value);
    if (q > 0) {
      var price = Number(inputs[i].dataset.price);
      var line = q * price;
      subtotal += line;
      count += q;
      lines.push("  " + q + " x " + inputs[i].dataset.name + " @ " + price.toFixed(2) + " = " + money(line));
    }
  }

  // extras
  var extrasTotal = 0;
  var extraLines = [];
  var boxes = document.querySelectorAll("input[name='extras']:checked");
  for (var j = 0; j < boxes.length; j++) {
    var p = Number(boxes[j].dataset.price);
    extrasTotal += p;
    extraLines.push("  " + boxes[j].value + " = " + money(p));
  }

  // discount, delivery, tax, total
  var discount = subtotal >= DISCOUNT_LIMIT ? subtotal * DISCOUNT_RATE : 0;
  var taxable = subtotal + extrasTotal - discount;
  var tax = taxable * TAX_RATE;
  var delivery = type === "delivery" ? DELIVERY_FEE : 0;
  var total = taxable + tax + delivery;

  // estimated time
  var minutes = 15 + count * 2;
  if (type === "delivery") minutes += 20;

  var r = [];
  r.push("===== OLIVE & EMBER - ORDER REPORT =====");
  r.push("Customer : " + document.getElementById("fullName").value.trim());
  r.push("Phone    : " + document.getElementById("phone").value.trim());
  r.push("Email    : " + document.getElementById("email").value.trim());
  r.push("");
  r.push("Order type: " + typeLabel);
  r.push("Date      : " + document.getElementById("date").value + " (" + document.getElementById("slot").value + ")");
  if (type === "delivery") {
    r.push("Area      : " + document.getElementById("area").value.trim());
    r.push("Address   : " + document.getElementById("address").value.trim());
  }
  r.push("Payment   : " + document.getElementById("payment").value);
  r.push("");
  r.push("DISHES (" + count + " items)");
  r = r.concat(lines);
  if (extraLines.length > 0) {
    r.push("EXTRAS");
    r = r.concat(extraLines);
  } else {
    r.push("EXTRAS: none");
  }
  r.push("");
  r.push("Dishes subtotal : " + money(subtotal));
  r.push("Extras          : " + money(extrasTotal));
  r.push("Discount (10%)  : " + (discount > 0 ? "-" : "") + money(discount));
  r.push("Tax (16%)       : " + money(tax));
  r.push("Delivery fee    : " + money(delivery));
  r.push("-----------------------------------");
  r.push("TOTAL TO PAY    : " + money(total));
  r.push("");
  r.push("Estimated time  : about " + minutes + " minutes");
  var notes = document.getElementById("notes").value.trim();
  r.push("Notes           : " + (notes === "" ? "-" : notes));
  r.push("");
  r.push("Thank you for choosing Olive & Ember!");
  return r.join("\n");
}

// ---------- events ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  // run every validator (no short-circuit, so all messages show)
  var results = [
    validateName(), validatePhone(), validateEmail(), validateItems(),
    validateOrderType(), validateDate(), validateSlot(), validateDelivery(),
    validatePayment(), validateNotes(), validateAgree()
  ];
  var allValid = results.every(function (r) { return r; });
  if (allValid) {
    report.value = buildReport();
    report.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    report.value = "Please fix the errors above, then press Calculate & Review again.";
  }
});

form.addEventListener("reset", function () {
  var spans = form.querySelectorAll(".error");
  for (var i = 0; i < spans.length; i++) spans[i].textContent = "";
  var fields = form.querySelectorAll(".invalid, .valid");
  for (var k = 0; k < fields.length; k++) fields[k].classList.remove("invalid", "valid");
  report.value = "";
});

// live feedback when the user leaves a field
document.getElementById("fullName").addEventListener("blur", validateName);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("date").addEventListener("change", validateDate);
document.getElementById("slot").addEventListener("change", validateSlot);
document.getElementById("payment").addEventListener("change", validatePayment);
document.getElementById("notes").addEventListener("input", validateNotes);
var typeRadios = document.getElementsByName("orderType");
for (var t = 0; t < typeRadios.length; t++) {
  typeRadios[t].addEventListener("change", function () { validateOrderType(); validateDelivery(); });
}

// set the date input minimum to today
(function () {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  document.getElementById("date").min = d.getFullYear() + "-" + m + "-" + day;
})();
