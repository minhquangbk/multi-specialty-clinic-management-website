import React, { useState } from 'react';

export default function Chonsize() {
  const [height, setHeight] = useState(170); // Chiều cao mặc định
  const [weight, setWeight] = useState(57); // Cân nặng mặc định
  const [gender, setGender] = useState(''); // Giới tính mặc định (trống)
  const [suggestion, setSuggestion] = useState('Vui lòng điều chỉnh thông số để nhận gợi ý'); // Gợi ý mặc định

// Hàm tính gợi ý cân nặng, bao gồm thông số cho cả nam và nữ
const calculateSuggestion = (height, weight, gender) => {
    const bmi = weight / ((height / 100) * (height / 100)); // Tính chỉ số BMI
  
    if (gender === 'nam') {
      if (bmi < 18.5) return 'Cân nặng hơi thấp ';
      if (bmi >= 18.5 && bmi <= 24.9) return 'Cân nặng ổn định ';
      if (bmi >= 25 && bmi <= 29.9) return 'Cân nặng hơi cao ';
      return 'Cân nặng quá cao (Nam)';
    } else if (gender === 'nu') {
      if (bmi < 17) return 'Cân nặng hơi thấp (Nữ)';
      if (bmi >= 17 && bmi <= 22.9) return 'Cân nặng ổn định ';
      if (bmi >= 23 && bmi <= 26.9) return 'Cân nặng hơi cao ';
      return 'Cân nặng quá cao (Nữ)';
    }
  
    return 'Vui lòng chọn giới tính để nhận gợi ý phù hợp';
  };
  
  // Xử lý thay đổi chiều cao
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    setHeight(newHeight);
    setSuggestion(calculateSuggestion(newHeight, weight, gender));
  };
  
  // Xử lý thay đổi cân nặng
  const handleWeightChange = (e) => {
    const newWeight = parseInt(e.target.value, 10);
    setWeight(newWeight);
    setSuggestion(calculateSuggestion(height, newWeight, gender));
  };
  
  // Xử lý thay đổi giới tính
  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
    setSuggestion(calculateSuggestion(height, weight, selectedGender));
  };
  

  return (
    <div style={{ width: '1280px', margin: '150px auto 0px' }}>
      <h2 style={{ textAlign: 'center', margin: '40px 0', fontWeight: '500' }}>Tư vấn cân nặng</h2>
      <div className="step">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
      <div className="row">
        <div className="col p-4">
          <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>Giới Tính</p>
          <div className="size-left" style={{ position: 'sticky', top: '10px' }}>
            <div className="choose-product">
              <select value={gender} onChange={handleGenderChange} style={{ padding: '10px', fontSize: '14px' }}>
                <option value="">-- Chọn giới tính --</option>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col p-8">
          <div className="row" style={{ borderBottom: '1px solid #d9d9d9', paddingBottom: '35px' }}>
            <div className="col p-6">
              <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>Thông số cơ thể</p>
              <div className="size-center">
                <div style={{ marginTop: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      marginBottom: '10px',
                    }}
                  >
                    <span>Chiều cao</span>
                    <span className="cm">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    name="c-height"
                    step="1"
                    min="20"
                    max="200"
                    value={height}
                    onChange={handleHeightChange}
                    id="input-cm"
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '700',
                      marginBottom: '10px',
                    }}
                  >
                    <span>Cân nặng</span>
                    <span className="kg">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    name="c-weight"
                    step="1"
                    min="10"
                    max="150"
                    value={weight}
                    onChange={handleWeightChange}
                    id="input-kg"
                  />
                </div>
              </div>
            </div>
            <div className="col p-6">
              <p style={{ textAlign: 'center', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>Phòng khám gợi ý</p>
              <div className="size-result">{suggestion}</div>
            </div>
          </div>
          <h3 style={{ textAlign: 'center', fontSize: '20.5px', margin: '30px 0 30px', fontWeight: '500' }}>Thông số cân nặng</h3>
          <div style={{ marginBottom: '40px' }}>
            {gender === 'nam' && <img src="../Images/tuvan.jpg" alt="Tư vấn Nam" className="size-table" />}
            {gender === 'nu' && <img src="../Images/tuvannu.jpg" alt="Tư vấn Nữ" className="size-table" />}
            {!gender && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Vui lòng chọn giới tính để hiển thị hình ảnh tư vấn.</p>}
            </div>

        </div>
      </div>
    </div>
  );
}
