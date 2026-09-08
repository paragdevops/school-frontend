function showResult(text, isError) {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = text;
  resultDiv.className = "result-box " + (isError ? "error" : "success");
  resultDiv.classList.remove("hidden");
}

async function postToBackend(urlPath, data) {
  try {
    const fullUrl = window.BACKEND_URL + urlPath;
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      showResult("Error: " + (result.error || result.message || "Unknown error"), true);
      return;
    }

    showResult(result.message || "Success!", false);
  } catch (error) {
    showResult("Network error: " + error.message, true);
  }
}

async function loadStudents() {
  try {
    const response = await fetch(window.BACKEND_URL + "/api/students");
    const data = await response.json();
    const select = document.getElementById("fee-student");
    select.innerHTML = '<option value="">-- Select Student --</option>';
    for (const student of data.students) {
      const option = document.createElement("option");
      option.value = student.roll_no;
      option.textContent = student.name + " (Roll: " + student.roll_no + ")";
      select.appendChild(option);
    }
  } catch (error) {
    console.error("Failed to load students:", error.message);
  }
}

function showForm(type) {
  hideForms();
  document.getElementById("form-" + type).classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  if (type === "fee") {
    loadStudents();
  }
}

function hideForms() {
  document.getElementById("form-student").classList.add("hidden");
  document.getElementById("form-teacher").classList.add("hidden");
  document.getElementById("form-fee").classList.add("hidden");
}

function submitStudent(event) {
  event.preventDefault();
  postToBackend("/api/students", {
    name: document.getElementById("student-name").value,
    class: document.getElementById("student-class").value,
    roll_no: document.getElementById("student-roll").value,
  });
}

function submitTeacher(event) {
  event.preventDefault();
  postToBackend("/api/teachers", {
    name: document.getElementById("teacher-name").value,
    subject: document.getElementById("teacher-subject").value,
  });
}

function submitFee(event) {
  event.preventDefault();
  const select = document.getElementById("fee-student");
  postToBackend("/api/fees", {
    student_roll_no: select.value,
    amount: document.getElementById("fee-amount").value,
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("backend-url-display");
  if (display && window.BACKEND_URL) {
    display.textContent = window.BACKEND_URL;
  }
});