document.addEventListener("DOMContentLoaded", function () {
  // ควบคุมการเปิด/ปิดช่องกรอกข้อมูลย่อยเมื่อติ๊ก Checkbox
  document.querySelectorAll(".toggle-input").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const targetId = this.getAttribute("data-target");
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        targetInput.disabled = !this.checked;
        if (!this.checked) targetInput.value = "";
      }
    });
  });
});

function handleSubmit(event) {
  event.preventDefault();

  const form = document.getElementById("bookingForm");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const submitBtn = document.getElementById("submitBtn");

  if (loadingOverlay) loadingOverlay.style.display = "flex";
  if (submitBtn) submitBtn.disabled = true;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // รวมรายการสถานที่ที่เลือกด้วย Checkbox
  const selectedLocations = Array.from(
    document.querySelectorAll('input[name="location_check"]:checked')
  ).map((cb) => cb.value);
  data.locations = selectedLocations.join(", ");

  // ยิง Request ไปยัง Apps Script Web App (แก้ไขตัวแปรเป็น CONFIG.WEB_APP_URL)
  fetch(CONFIG.WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (loadingOverlay) loadingOverlay.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;

      if (result.success || result.status === "success") {
        alert("บันทึกข้อมูลเรียบร้อยแล้ว!\nรหัสคำขอ: " + (result.requestId || "-"));
        form.reset();
        
        // ล็อกช่องกรอกย่อยกลับเป็นเหมือนเดิม
        document.querySelectorAll(".toggle-input").forEach((cb) => {
          const targetId = cb.getAttribute("data-target");
          const targetInput = document.getElementById(targetId);
          if (targetInput) targetInput.disabled = true;
        });
      } else {
        alert("เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกข้อมูลได้"));
      }
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      if (loadingOverlay) loadingOverlay.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    });
}