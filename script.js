document.addEventListener('DOMContentLoaded', function() {
  // ผูก Event ให้กับ Checkbox ย่อยสำหรับเปิด/ปิด ช่องระบุจำนวน
  bindCheckboxToggle('eq_stage', 'qty_stage');
  bindCheckboxToggle('eq_table', 'qty_table');
  bindCheckboxToggle('eq_chair', 'qty_chair');
  bindCheckboxToggle('eq_bin', 'qty_bin');
  bindCheckboxToggle('eq_cooler', 'qty_cooler');
  bindCheckboxToggle('eq_fan', 'qty_fan');

  bindCheckboxToggle('sec_guard', 'qty_guard');
  bindCheckboxToggle('sec_tram', 'qty_tram');
  bindCheckboxToggle('sec_fence', 'qty_fence');
  bindCheckboxToggle('sec_cone', 'qty_cone');
  bindCheckboxToggle('sec_megaphone', 'qty_megaphone');
  bindCheckboxToggle('sec_other', 'detail_sec_other');

  bindCheckboxToggle('veh_small', 'reason_veh_small');
  bindCheckboxToggle('veh_large', 'reason_veh_large');

  bindCheckboxToggle('p_mok', 'qty_p_mok');
  bindCheckboxToggle('p_thian', 'qty_p_thian');
  bindCheckboxToggle('p_saow', 'qty_p_saow');
  bindCheckboxToggle('p_fueng', 'qty_p_fueng');
  bindCheckboxToggle('p_mak', 'qty_p_mak');
  bindCheckboxToggle('p_jung', 'qty_p_jung');
  bindCheckboxToggle('p_jun', 'qty_p_jun');
  bindCheckboxToggle('p_vasana', 'qty_p_vasana');
  bindCheckboxToggle('p_pilo', 'qty_p_pilo');
  bindCheckboxToggle('p_cha', 'qty_p_cha');
  bindCheckboxToggle('p_cloth', 'qty_p_cloth');
  bindCheckboxToggle('p_other', 'detail_p_other');

  // ตรวจสอบว่าเป็น Mode Edit หรือไม่
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'edit' && urlParams.get('row')) {
    loadRequestDataForEdit(urlParams.get('row'));
  }
});

function bindCheckboxToggle(chkId, inputId) {
  const chk = document.getElementById(chkId);
  const input = document.getElementById(inputId);
  if (chk && input) {
    chk.addEventListener('change', function() {
      input.disabled = !this.checked;
      if (!this.checked) input.value = '';
    });
  }
}

function loadRequestDataForEdit(row) {
  const fieldSet = document.getElementById('formFieldSet');
  const overlay = document.getElementById('loadingOverlay');
  const submitBtn = document.getElementById('submitBtn');

  // ล็อกฟิลด์ทั้งหมด + เปิดฉากทึบโหลด
  if (fieldSet) fieldSet.disabled = true;
  if (overlay) overlay.style.display = 'flex';

  const script = document.createElement('script');
  window.onRequestDataReceived = function(res) {
    if (res && res.success) {
      populateFormData(res.data);
      
      // ปลดล็อกฟิลด์ + ปิดฉากทึบโหลด เมื่อข้อมูลเติมครบเรียบร้อย
      if (fieldSet) fieldSet.disabled = false;
      if (overlay) overlay.style.display = 'none';
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="bi bi-floppy me-2"></i>บันทึกการเปลี่ยนแปลงข้อมูล';
      }
    } else {
      if (overlay) overlay.style.display = 'none';
      alert(res.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
  };
  script.src = `${CONFIG.WEB_APP_URL}?action=getRequestById&row=${encodeURIComponent(row)}&callback=onRequestDataReceived`;
  document.body.appendChild(script);
}

function populateFormData(data) {
  document.getElementById('faculty').value = data.faculty || '';
  document.getElementById('department').value = data.department || '';
  document.getElementById('requestDate').value = data.requestDate || '';
  document.getElementById('title').value = data.title || 'นาย';
  document.getElementById('requesterName').value = data.requesterName || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('pinCode').value = data.pinCode || '';
  document.getElementById('activityName').value = data.activityName || '';
  document.getElementById('participantCount').value = data.participantCount || '';

  if (data.soundUsage === 'ใช้เสียง') {
    document.getElementById('sound_yes').checked = true;
  } else if (data.soundUsage === 'ไม่ใช้เสียง') {
    document.getElementById('sound_no').checked = true;
  }

  document.getElementById('startDate').value = data.startDate || '';
  document.getElementById('startTime').value = data.startTime || '';
  document.getElementById('endDate').value = data.endDate || '';
  document.getElementById('endTime').value = data.endTime || '';

  // เติมสถานที่
  if (data.location) {
    const locs = data.location.split(', ');
    document.querySelectorAll('.loc-checkbox').forEach(cb => {
      if (locs.includes(cb.value)) cb.checked = true;
    });
  }

  document.getElementById('approverName').value = data.approverName || '';
  document.getElementById('approverPosition').value = data.approverPosition || '';
}

function handleSubmit(e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const isEdit = urlParams.get('mode') === 'edit';
  const rowIndex = urlParams.get('row');

  const selectedLocs = [];
  document.querySelectorAll('.loc-checkbox:checked').forEach(cb => {
    selectedLocs.push(cb.value);
  });

  if (selectedLocs.length === 0) {
    alert("กรุณาเลือกสถานที่ขอใช้บริการอย่างน้อย 1 รายการ");
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>กำลังบันทึกข้อมูล...';

  const payload = {
    action: isEdit ? "updateRequest" : "saveRequest",
    rowIndex: rowIndex,
    faculty: document.getElementById('faculty').value,
    department: document.getElementById('department').value,
    requestDate: document.getElementById('requestDate').value,
    title: document.getElementById('title').value,
    requesterName: document.getElementById('requesterName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    pinCode: document.getElementById('pinCode').value,
    activityName: document.getElementById('activityName').value,
    participantCount: document.getElementById('participantCount').value,
    soundUsage: document.querySelector('input[name="soundUsage"]:checked') ? document.querySelector('input[name="soundUsage"]:checked').value : '',
    startDate: document.getElementById('startDate').value,
    startTime: document.getElementById('startTime').value,
    endDate: document.getElementById('endDate').value,
    endTime: document.getElementById('endTime').value,
    location: selectedLocs.join(', '),
    approverName: document.getElementById('approverName').value,
    approverPosition: document.getElementById('approverPosition').value
  };

  fetch(CONFIG.WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert(isEdit ? "แก้ไขข้อมูลคำขอเรียบร้อยแล้ว!" : "บันทึกข้อมูลคำขอเรียบร้อยแล้ว!");
    window.location.href = "menu-common.html";
  })
  .catch(err => {
    alert("เกิดข้อผิดพลาด: " + err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = isEdit ? "บันทึกการเปลี่ยนแปลงข้อมูล" : "ส่งแบบฟอร์มขอใช้บริการ";
  });
}