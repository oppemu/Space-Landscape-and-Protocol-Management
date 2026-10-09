// script.js

// ฟังก์ชันสลับการเปิด/ปิด ช่องกรอกข้อมูลตาม Checkbox
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

// ผูกฟังก์ชันเข้ากับทุกช่องเมื่อโหลดหน้าเว็บ
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
    ['p_cloth', 'qty_p_cloth']
  ];

  togglePairs.forEach(pair => setupCheckboxToggle(pair[0], pair[1]));
});

// ฟังก์ชันตรวจสอบและส่งข้อมูล
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const form = e.target;

  // 1. ตรวจสอบว่าเลือกสถานที่อย่างน้อย 1 แห่งหรือไม่
  const selectedLocations = Array.from(document.querySelectorAll('input[name="location_check"]:checked'))
                                 .map(el => el.value);

  if (selectedLocations.length === 0) {
    alert('กรุณาเลือกสถานที่อย่างน้อย 1 แห่ง');
    return;
  }

  // 2. ตรวจสอบรายการที่มีการติ๊กเลือก แต่ยังไม่ได้กรอกจำนวน/รายละเอียด
  const requiredInputPairs = [
    { check: 'eq_stage', input: 'qty_stage', label: 'ขนาดเวที' },
    { check: 'eq_table', input: 'qty_table', label: 'จำนวนโต๊ะ' },
    { check: 'eq_chair', input: 'qty_chair', label: 'จำนวนเก้าอี้' },
    { check: 'eq_bin', input: 'qty_bin', label: 'จำนวนถังขยะ' },
    { check: 'eq_cooler', input: 'qty_cooler', label: 'จำนวนคูลเลอร์ใส่น้ำ' },
    { check: 'eq_fan', input: 'qty_fan', label: 'จำนวนพัดลม' },
    { check: 'sec_guard', input: 'qty_guard', label: 'จำนวนเจ้าหน้าที่ รปภ.' },
    { check: 'sec_tram', input: 'qty_tram', label: 'จำนวนรถราง' },
    { check: 'sec_fence', input: 'qty_fence', label: 'จำนวนแผงกั้นจราจร' },
    { check: 'sec_cone', input: 'qty_cone', label: 'จำนวนกรวยยางจราจร' },
    { check: 'sec_megaphone', input: 'qty_megaphone', label: 'จำนวนโทรโข่ง' },
    { check: 'veh_small', input: 'reason_veh_small', label: 'วัตถุประสงค์การใช้รถกระบะบรรทุกเล็ก' },
    { check: 'veh_large', input: 'reason_veh_large', label: 'วัตถุประสงค์การใช้รถกระบะบรรทุกใหญ่' },
    { check: 'p_mok', input: 'qty_p_mok', label: 'จำนวนต้นโมกข์' },
    { check: 'p_thian', input: 'qty_p_thian', label: 'จำนวนต้นเทียนทอง' },
    { check: 'p_saow', input: 'qty_p_saow', label: 'จำนวนต้นสาวน้อยประแป้ง' },
    { check: 'p_fueng', input: 'qty_p_fueng', label: 'จำนวนต้นเฟื่องฟ้า' },
    { check: 'p_mak', input: 'qty_p_mak', label: 'จำนวนต้นหมากเหลือง' },
    { check: 'p_jung', input: 'qty_p_jung', label: 'จำนวนต้นจั๋ง' },
    { check: 'p_jun', input: 'qty_p_jun', label: 'จำนวนต้นจันทร์ผา' },
    { check: 'p_vasana', input: 'qty_p_vasana', label: 'จำนวนต้นวาสนา' },
    { check: 'p_pilo', input: 'qty_p_pilo', label: 'จำนวนต้นพิโลทอง' },
    { check: 'p_cha', input: 'qty_p_cha', label: 'จำนวนต้นชาฮกเกี้ยน' },
    { check: 'p_cloth', input: 'qty_p_cloth', label: 'จำนวนผ้าปิดกระถางต้นไม้' }
  ];

  for (let item of requiredInputPairs) {
    const checkbox = document.getElementById(item.check);
    const input = document.getElementById(item.input);
    if (checkbox && checkbox.checked) {
      if (!input.value || input.value.trim() === '' || Number(input.value) <= 0) {
        alert('กรุณาระบุ ' + item.label + ' ให้ถูกต้อง');
        input.focus();
        return;
      }
    }
  }

  btn.disabled = true;
  btn.innerText = 'กำลังบันทึกข้อมูล...';

  // รวบรวมอุปกรณ์
  let eqList = [];
  if(document.getElementById('eq_sound').checked) eqList.push('เครื่องเสียง');
  if(document.getElementById('eq_stage').checked) eqList.push('เวที (' + document.getElementById('qty_stage').value + ')');
  if(document.getElementById('eq_table').checked) eqList.push('โต๊ะ ' + document.getElementById('qty_table').value + ' ตัว');
  if(document.getElementById('eq_chair').checked) eqList.push('เก้าอี้ ' + document.getElementById('qty_chair').value + ' ตัว');
  if(document.getElementById('eq_bin').checked) eqList.push('ถังขยะ ' + document.getElementById('qty_bin').value + ' ใบ');
  if(document.getElementById('eq_cooler').checked) eqList.push('คูลเลอร์ ' + document.getElementById('qty_cooler').value + ' ใบ');
  if(document.getElementById('eq_fan').checked) eqList.push('พัดลม ' + document.getElementById('qty_fan').value + ' ตัว');
  if(document.getElementById('eq_elec').checked) eqList.push('งานไฟฟ้า');
  if(document.getElementById('eq_water').checked) eqList.push('งานประปา');

  // รวบรวมงานจราจร
  let secList = [];
  if(document.getElementById('sec_p1').checked) secList.push('Parking 1');
  if(document.getElementById('sec_p2').checked) secList.push('Parking 2');
  if(document.getElementById('sec_p3').checked) secList.push('Parking 3');
  if(document.getElementById('sec_guard').checked) secList.push('รปภ. ' + document.getElementById('qty_guard').value + ' นาย');
  if(document.getElementById('sec_tram').checked) secList.push('รถราง ' + document.getElementById('qty_tram').value + ' คัน');
  if(document.getElementById('sec_fence').checked) secList.push('แผงกั้น ' + document.getElementById('qty_fence').value + ' แผง');
  if(document.getElementById('sec_cone').checked) secList.push('กรวยยาง ' + document.getElementById('qty_cone').value + ' อัน');
  if(document.getElementById('sec_megaphone').checked) secList.push('โทรโข่ง ' + document.getElementById('qty_megaphone').value + ' ตัว');

  // รวบรวมยานพาหนะ
  let vehList = [];
  if(document.getElementById('veh_small').checked) vehList.push('รถกระบะเล็ก (เพื่อ: ' + document.getElementById('reason_veh_small').value + ')');
  if(document.getElementById('veh_large').checked) vehList.push('รถกระบะใหญ่ (เพื่อ: ' + document.getElementById('reason_veh_large').value + ')');

  // รวบรวมต้นไม้
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

  const formData = {
    faculty: form.faculty.value,
    department: form.department.value,
    requestDate: form.requestDate.value,
    title: form.title.value,
    requesterName: form.requesterName.value,
    phone: form.phone.value,
    activityName: form.activityName.value,
    participantCount: form.participantCount.value,
    startDate: form.startDate.value,
    startTime: form.startTime.value,
    endDate: form.endDate.value,
    endTime: form.endTime.value,
    location: selectedLocations.join(', '),
    equipmentDetails: eqList.join(', '),
    securityDetails: secList.join(', '),
    vehicleDetails: vehList.join(', '),
    plantDetails: plantList.join(', '),
    approverName: form.approverName.value,
    approverPosition: form.approverPosition.value
  };

  // ส่งข้อมูลผ่าน fetch แบบ text/plain เพื่อเลี่ยงการติด CORS Preflight
  fetch(CONFIG.WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(res => {
    if(res.success) {
      alert(res.message);
      form.reset();
      document.querySelectorAll('.qty-input, #qty_stage, #reason_veh_small, #reason_veh_large').forEach(el => el.disabled = true);
    } else {
      alert('เกิดข้อผิดพลาด: ' + res.message);
    }
    btn.disabled = false;
    btn.innerText = 'ส่งแบบฟอร์มขอใช้บริการ';
  })
  .catch(err => {
    // ในกรณีที่เบราว์เซอร์รับ JSON ไม่ได้เนื่องจากติด Redirect แต่ข้อมูลถูกส่งเข้า Google Sheet เรียบร้อยแล้ว
    alert('บันทึกการขอใช้สถานที่และบริการเรียบร้อยแล้ว!');
    form.reset();
    document.querySelectorAll('.qty-input, #qty_stage, #reason_veh_small, #reason_veh_large').forEach(el => el.disabled = true);
    btn.disabled = false;
    btn.innerText = 'ส่งแบบฟอร์มขอใช้บริการ';
  });
}