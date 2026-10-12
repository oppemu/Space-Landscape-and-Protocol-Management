// script.js

const ELEC_LIMITS = {
  library: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> สามารถเชื่อมต่อไฟฟ้าได้ขนาดไม่เกิน 70 แอมป์ จำนวน 2 ชุด',
  mahidol: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> สามารถเชื่อมต่อไฟฟ้าได้ขนาดไม่เกิน 50 แอมป์ จำนวน 1 ชุด',
  white_duck: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> สามารถเชื่อมต่อไฟฟ้าได้ขนาดไม่เกิน 50 แอมป์ จำนวน 1 ชุด',
  walk_a: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> สามารถเชื่อมต่อไฟฟ้าได้ขนาดไม่เกิน 50 แอมป์ (มีไฟฟ้าแสงสว่างตามปกติ)',
  walk_b: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> มีไฟฟ้าแสงสว่างตามปกติ (ไม่อนุญาตให้ติดตั้งระบบไฟฟ้าเพิ่ม)',
  walk_c: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> มีไฟฟ้าแสงสว่างตามปกติ (ไม่อนุญาตให้ติดตั้งระบบไฟฟ้าเพิ่ม)',
  walk_d: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> มีไฟฟ้าแสงสว่างตามปกติ (ไม่อนุญาตให้ติดตั้งระบบไฟฟ้าเพิ่ม)',
  water_rec: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> มีไฟฟ้าแสงสว่างตามปกติ (ไม่อนุญาตให้ติดตั้งระบบไฟฟ้าเพิ่ม)',
  multi_purpose: '⚡ <strong>ข้อจำกัดไฟฟ้า:</strong> สามารถเชื่อมต่อไฟฟ้าได้ตามระบบมาตรฐานอาคาร'
};

let isEditMode = false;
let editRowIndex = null;

// ฟังก์ชันตรวจสอบ PIN 4 หลัก
function validatePinCode(pin) {
  var cleanPin = String(pin || '').replace(/\D/g, '');

  if (cleanPin.length !== 4) {
    return { valid: false, message: 'กรุณากรอกรหัสลับเป็นตัวเลข 4 หลักเท่านั้น (เช่น 5824)' };
  }

  // 1. ตรวจสอบรหัสซ้ำกันทุกตัว
  if (/^(\d)\1{3}\$/.test(cleanPin)) {
    return { valid: false, message: 'รหัสลับห้ามใช้ตัวเลขซ้ำกันทุกหลัก (เช่น 1111, 0000)' };
  }

  // 2. ตรวจสอบรหัสเรียงลำดับ
  const sequentialAsc = "0123456789";
  const sequentialDesc = "9876543210";
  
  if (sequentialAsc.includes(cleanPin) || sequentialDesc.includes(cleanPin)) {
    return { valid: false, message: 'รหัสลับห้ามใช้ตัวเลขเรียงลำดับ (เช่น 1234, 4321)' };
  }

  return { valid: true, cleanPin: cleanPin };
}

function checkElectricityWarnings() {
  const elecCheck = document.getElementById('eq_elec');
  const isElecChecked = elecCheck ? elecCheck.checked : false;
  const locCheckboxes = document.querySelectorAll('.loc-checkbox');

  locCheckboxes.forEach(cb => {
    const key = cb.getAttribute('data-loc-key');
    const warnDiv = document.getElementById('elec_warn_' + key);
    
    if (warnDiv) {
      if (cb.checked && isElecChecked && ELEC_LIMITS[key]) {
        warnDiv.innerHTML = ELEC_LIMITS[key];
        warnDiv.classList.remove('d-none');
      } else {
        warnDiv.classList.add('d-none');
        warnDiv.innerHTML = '';
      }
    }
  });
}

function setupCheckboxToggle(checkboxId, inputId) {
  const checkbox = document.getElementById(checkboxId);
  const input = document.getElementById(inputId);
  if (!checkbox || !input) return;

  checkbox.addEventListener('change', function () {
    input.disabled = !this.checked;
    if (this.checked) {
      input.focus();
    } else {
      input.value = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const togglePairs = [
    ['eq_stage', 'qty_stage'],
    ['eq_table', 'qty_table'],
    ['eq_chair', 'qty_chair'],
    ['eq_bin', 'qty_bin'],
    ['eq_cooler', 'qty_cooler'],
    ['eq_fan', 'qty_fan'],
    ['sec_guard', 'qty_guard'],
    ['sec_tram', 'qty_tram'],
    ['sec_fence', 'qty_fence'],
    ['sec_cone', 'qty_cone'],
    ['sec_megaphone', 'qty_megaphone'],
    ['sec_other', 'detail_sec_other'],
    ['veh_small', 'reason_veh_small'],
    ['veh_large', 'reason_veh_large'],
    ['p_mok', 'qty_p_mok'],
    ['p_thian', 'qty_p_thian'],
    ['p_saow', 'qty_p_saow'],
    ['p_fueng', 'qty_p_fueng'],
    ['p_mak', 'qty_p_mak'],
    ['p_jung', 'qty_p_jung'],
    ['p_jun', 'qty_p_jun'],
    ['p_vasana', 'qty_p_vasana'],
    ['p_pilo', 'qty_p_pilo'],
    ['p_cha', 'qty_p_cha'],
    ['p_cloth', 'qty_p_cloth'],
    ['p_other', 'detail_p_other']
  ];

  togglePairs.forEach(pair => setupCheckboxToggle(pair[0], pair[1]));

  document.querySelectorAll('.loc-checkbox').forEach(cb => {
    cb.addEventListener('change', checkElectricityWarnings);
  });
  
  const elecCheck = document.getElementById('eq_elec');
  if (elecCheck) {
    elecCheck.addEventListener('change', checkElectricityWarnings);
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'edit' && urlParams.get('row')) {
    isEditMode = true;
    editRowIndex = urlParams.get('row');
    loadRecordForEdit(editRowIndex);
  }
});

window.onRecordForEditReceived = function(data) {
  if (data && data.success && data.record) {
    fillFormForEdit(data.record);
  } else {
    alert('ไม่พบข้อมูลคำขอ หรือลิงก์ไม่ถูกต้อง');
  }
};

function loadRecordForEdit(rowIndex) {
  const btn = document.getElementById('submitBtn');
  if (btn) btn.innerText = 'กำลังโหลดข้อมูลเดิม...';

  const script = document.createElement('script');
  script.src = `${CONFIG.WEB_APP_URL}?action=getRecordByRow&row=${rowIndex}&callback=onRecordForEditReceived`;
  document.body.appendChild(script);
}

function fillFormForEdit(data) {
  const btn = document.getElementById('submitBtn');
  if (btn) btn.innerText = 'อัปเดตการแก้ไขข้อมูล';

  const headerBox = document.querySelector('.header-box');
  if (headerBox) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning mt-2 mb-0 fw-bold';
    alertDiv.innerHTML = `<i class="bi bi-pencil-square"></i> กำลังแก้ไขข้อมูลคำขอ ID: ${data.id}`;
    headerBox.appendChild(alertDiv);
  }

  setVal('faculty', data.faculty);
  setVal('department', data.department);
  setVal('requestDate', formatDateForInput(data.requestDate));
  setVal('title', data.title || 'นาย');
  setVal('requesterName', data.requesterName);
  setVal('phone', data.phone);
  setVal('email', data.email);
  setVal('pinCode', data.pinCode);
  setVal('activityName', data.activityName);
  setVal('participantCount', data.participantCount);

  if (data.soundUsage) {
    const soundRadio = document.querySelector(`input[name="soundUsage"][value="${data.soundUsage}"]`);
    if (soundRadio) soundRadio.checked = true;
  }

  setVal('startDate', formatDateForInput(data.startDate));
  setVal('startTime', data.startTime);
  setVal('endDate', formatDateForInput(data.endDate));
  setVal('endTime', data.endTime);

  if (data.location) {
    const locs = data.location.split(', ');
    document.querySelectorAll('input[name="location_check"]').forEach(cb => {
      if (locs.includes(cb.value)) cb.checked = true;
    });
  }

  setVal('approverName', data.approverName);
  setVal('approverPosition', data.approverPosition);

  checkElectricityWarnings();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  dateStr = String(dateStr).trim();

  if (dateStr.match(/^\d{4}-\d{2}-\d{2}\$/)) return dateStr;

  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return dateStr;
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');

  const rawPin = document.getElementById('pinCode') ? document.getElementById('pinCode').value : '';
  const pinCheck = validatePinCode(rawPin);

  if (!pinCheck.valid) {
    alert(pinCheck.message);
    document.getElementById('pinCode').focus();
    return;
  }

  const selectedLocations = Array.from(document.querySelectorAll('input[name="location_check"]:checked'))
                                 .map(el => el.value);

  if (selectedLocations.length === 0) {
    alert('กรุณาเลือกสถานที่อย่างน้อย 1 แห่ง');
    return;
  }

  btn.disabled = true;
  btn.innerText = isEditMode ? 'กำลังอัปเดตข้อมูล...' : 'กำลังบันทึกข้อมูล...';

  let eqList = [];
  if(document.getElementById('eq_stage').checked) eqList.push('เวที (' + document.getElementById('qty_stage').value + ')');
  if(document.getElementById('eq_table').checked) eqList.push('โต๊ะ ' + document.getElementById('qty_table').value + ' ตัว');
  if(document.getElementById('eq_chair').checked) eqList.push('เก้าอี้ ' + document.getElementById('qty_chair').value + ' ตัว');
  if(document.getElementById('eq_bin').checked) eqList.push('ถังขยะ ' + document.getElementById('qty_bin').value + ' ใบ');
  if(document.getElementById('eq_cooler').checked) eqList.push('คูลเลอร์ ' + document.getElementById('qty_cooler').value + ' ใบ');
  if(document.getElementById('eq_fan').checked) eqList.push('พัดลม ' + document.getElementById('qty_fan').value + ' ตัว');

  let utilityList = [];
  if(document.getElementById('eq_elec').checked) utilityList.push('อำนวยความสะดวกงานไฟฟ้า');
  if(document.getElementById('eq_water').checked) utilityList.push('อำนวยความสะดวกงานประปา');

  let secList = [];
  if(document.getElementById('sec_p1').checked) secList.push('Parking 1');
  if(document.getElementById('sec_p3').checked) secList.push('Parking 3');
  if(document.getElementById('sec_guard').checked) secList.push('รปภ. ' + document.getElementById('qty_guard').value + ' นาย');
  if(document.getElementById('sec_tram').checked) secList.push('รถราง ' + document.getElementById('qty_tram').value + ' คัน');
  if(document.getElementById('sec_fence').checked) secList.push('แผงกั้น ' + document.getElementById('qty_fence').value + ' แผง');
  if(document.getElementById('sec_cone').checked) secList.push('กรวยยาง ' + document.getElementById('qty_cone').value + ' อัน');
  if(document.getElementById('sec_megaphone').checked) secList.push('โทรโข่ง ' + document.getElementById('qty_megaphone').value + ' ตัว');
  if(document.getElementById('sec_other').checked) secList.push('อื่น ๆ: ' + document.getElementById('detail_sec_other').value);

  let vehList = [];
  if(document.getElementById('veh_small').checked) vehList.push('รถกระบะเล็ก (เพื่อ: ' + document.getElementById('reason_veh_small').value + ')');
  if(document.getElementById('veh_large').checked) vehList.push('รถกระบะใหญ่ (เพื่อ: ' + document.getElementById('reason_veh_large').value + ')');

  let plantList = [];
  if(document.getElementById('p_mok').checked) plantList.push('ต้นโมกข์ ' + document.getElementById('qty_p_mok').value + ' กระถาง');
  if(document.getElementById('p_thian').checked) plantList.push('ต้นเทียนทอง ' + document.getElementById('qty_p_thian').value + ' กระถาง');
  if(document.getElementById('p_saow').checked) plantList.push('ต้นสาวน้อยประแป้ง ' + document.getElementById('qty_p_saow').value + ' กระถาง');
  if(document.getElementById('p_fueng').checked) plantList.push('ต้นเฟื่องฟ้า ' + document.getElementById('qty_p_fueng').value + ' กระถาง');
  if(document.getElementById('p_mak').checked) plantList.push('ต้นหมากเหลือง ' + document.getElementById('qty_p_mak').value + ' กระถาง');
  if(document.getElementById('p_jung').checked) plantList.push('ต้นจั๋ง ' + document.getElementById('qty_p_jung').value + ' กระถาง');
  if(document.getElementById('p_jun').checked) plantList.push('ต้นจันทร์ผา ' + document.getElementById('qty_p_jun').value + ' กระถาง');
  if(document.getElementById('p_vasana').checked) plantList.push('ต้นวาสนา ' + document.getElementById('qty_p_vasana').value + ' กระถาง');
  if(document.getElementById('p_pilo').checked) plantList.push('ต้นพิโลทอง ' + document.getElementById('qty_p_pilo').value + ' กระถาง');
  if(document.getElementById('p_cha').checked) plantList.push('ต้นชาฮกเกี้ยน ' + document.getElementById('qty_p_cha').value + ' กระถาง');
  if(document.getElementById('p_cloth').checked) plantList.push('ผ้าปิดกระถาง ' + document.getElementById('qty_p_cloth').value + ' ผืน');
  if(document.getElementById('p_other').checked) plantList.push('อื่น ๆ: ' + document.getElementById('detail_p_other').value);

  const soundUsageEl = document.querySelector('input[name="soundUsage"]:checked');

  const formData = {
    action: isEditMode ? 'updateRecord' : 'createRecord',
    rowIndex: editRowIndex,
    faculty: document.getElementById('faculty').value,
    department: document.getElementById('department').value,
    requestDate: document.getElementById('requestDate').value,
    title: document.getElementById('title').value,
    requesterName: document.getElementById('requesterName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    pinCode: pinCheck.cleanPin,
    activityName: document.getElementById('activityName').value,
    participantCount: document.getElementById('participantCount').value,
    soundUsage: soundUsageEl ? soundUsageEl.value : '',
    startDate: document.getElementById('startDate').value,
    startTime: document.getElementById('startTime').value,
    endDate: document.getElementById('endDate').value,
    endTime: document.getElementById('endTime').value,
    location: selectedLocations.join(', '),
    equipmentDetails: eqList.join(', '),
    utilityDetails: utilityList.join(', '),
    securityDetails: secList.join(', '),
    vehicleDetails: vehList.join(', '),
    plantDetails: plantList.join(', '),
    approverName: document.getElementById('approverName').value,
    approverPosition: document.getElementById('approverPosition').value
  };

  fetch(CONFIG.WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(formData)
  })
  .then(() => {
    btn.disabled = false;
    btn.innerText = isEditMode ? 'อัปเดตการแก้ไขข้อมูล' : 'ส่งแบบฟอร์มขอใช้บริการ';
    alert(isEditMode ? 'อัปเดตการแก้ไขข้อมูลเรียบร้อยแล้ว!' : 'บันทึกข้อมูลเรียบร้อยแล้ว!');
    window.location.href = './index.html';
  })
  .catch(err => {
    btn.disabled = false;
    btn.innerText = isEditMode ? 'อัปเดตการแก้ไขข้อมูล' : 'ส่งแบบฟอร์มขอใช้บริการ';
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  });
}
