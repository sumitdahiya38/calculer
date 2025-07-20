document.addEventListener('DOMContentLoaded', function() {
  calculateBMI();
  const popup = document.getElementById('popup');
  const closeBtn = document.getElementById('closePopup');
  const countdownEl = document.getElementById('countdown');
  const mainContent = document.getElementById('main');
  const headerContent = document.getElementById('header');
  const userAgent = navigator.userAgent || window.opera;

  const params = new URLSearchParams(window.location.search);
  const target = params.get("l");

  // Change this to match the referrer you want to check
  if (target) {
    popup.style.display = 'flex';
    mainContent.classList.add('blur');
    headerContent.classList.add('blur');
    const webUrl = `https://www.youtube.com/watch?v=${target}`;

    let secondsLeft = 5;
    const interval = setInterval(() => {
      secondsLeft--;
      countdownEl.textContent = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(interval);

        if (/android/i.test(userAgent)) {
          const intentUrl = `intent://${webUrl}#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=${encodeURIComponent(webUrl)};end;`;
          window.location.href = intentUrl;
        }
        else if(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
          window.location.href = `youtube://www.youtube.com/watch?v=${target}`;
        else window.location.href = webUrl;
      }
    }, 1000);
  }

  // Close popup
  // closeBtn.addEventListener('click', () => {
  //   popup.style.display = 'none';
  // });
});

function selectUnit(unit) {
  const pills = document.querySelectorAll('.pill');
  pills.forEach(p => p.classList.remove('active'));

  const cmInput = document.getElementById('cmInput');
  const ftinInput = document.getElementById('ftinInput');
  const weightInput = document.getElementById('weightField');

  if (unit === 'cm') {
    pills[0].classList.add('active');
    cmInput.style.display = 'block';
    ftinInput.style.display = 'none';
    weightInput.placeholder = 'kg';
    weightInput.value = "75";
    document.getElementById('weightLabel').innerHTML = "Weight (kg)";
  } else {
    pills[1].classList.add('active');
    cmInput.style.display = 'none';
    ftinInput.style.display = 'block';
    weightInput.placeholder = 'lbs';
    weightInput.value = "166";
    document.getElementById('weightLabel').innerHTML = "Weight (lbs)";
    // calculateBMI();
  }
  calculateBMI();
}

function calculateBMI() {
  const colorBMI = {
    'severeThickness': '#bc2020',
    'moderateThickness': '#d38888',
    'mildThickness':'#ffe400',
    'normal': '#028137',
    'overweight': '#ffe400',
    'obeseClassI': '#d38888',
    'obeseClassII':'#bc2020',
    'obeseClassIII': '#8a0002'
  }
  const resultBMI = document.getElementById('resultBMI');
  const resultBMISpecifier = document.getElementById('resultBMISpecifier');
  const resultText = document.getElementById('resultText');
  const healthWeightRange = document.getElementById('healthWeightRange');
  const loseOrGainWeight = document.getElementById('loseOrGainWeight');
  const unit = document.querySelector('.pill.active').innerText === 'cm' ? 'cm' : 'ftin';

  const weight = parseFloat(document.getElementById('weightField').value);
  let bmi = 0;
  let minHealthyWeight, maxHealthyWeight;

  if (unit === 'cm') {
    const heightCm = parseFloat(document.getElementById('heightCms').value);
    if (heightCm > 0 && weight > 0) {
      const heightM = heightCm / 100;
      bmi = weight / (heightM * heightM);
      minHealthyWeight = 18.5 * (heightM * heightM);
      maxHealthyWeight = 25 * (heightM * heightM);
      healthWeightRange.innerHTML = `Healthy weight for your height: ${minHealthyWeight.toFixed(1)} kg - ${maxHealthyWeight.toFixed(1)} kg`;
      healthWeightRange.style.display = 'list-item';
    }
  } else {
    const feet = parseFloat(document.getElementById('heightFeet').value);
    const inches = parseFloat(document.getElementById('heightInches').value);
    const heightInches = (feet * 12) + inches;
    if (heightInches > 0 && weight > 0) {
      // Assuming weight in lbs for ft/in mode
      bmi = (weight * 703) / (heightInches * heightInches);
      minHealthyWeight = 18.5 * (heightInches * heightInches) / 703;
      maxHealthyWeight = 25 * (heightInches * heightInches) / 703;
      healthWeightRange.innerHTML = `Healthy weight for your height: ${minHealthyWeight.toFixed(1)} lbs - ${maxHealthyWeight.toFixed(1)} lbs`;
      healthWeightRange.style.display = 'list-item';
    }
  }

  bmi = Math.round((parseFloat(bmi.toFixed(1))) * 10) / 10;

  if( bmi > 25 ) {
    loseOrGainWeight.innerHTML = `Lose ${(weight - maxHealthyWeight).toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'} to reach a BMI of 25 kg/m2.`
    loseOrGainWeight.style.display = 'list-item';
  }else if( bmi < 18.5 ) {
    loseOrGainWeight.innerHTML = `Gain ${(minHealthyWeight - weight).toFixed(1)} ${unit === 'cm' ? 'kg' : 'lbs'} to reach a BMI of 18.5 kg/m2.`
    loseOrGainWeight.style.display = 'list-item';
  }else loseOrGainWeight.style.display = 'none';

  resultBMI.innerText = `${bmi}`;

  if(bmi > 0) resultBMISpecifier.innerHTML = 'kg/m²';

  switch(true) {
    case (bmi < 16 ) :
      resultText.innerText = 'Severe Thickness';
      resultBMI.style.color = colorBMI.severeThickness;
      resultText.style.color = colorBMI.severeThickness;
      break;
    case ( bmi >= 16 && bmi < 17 ) :
      resultText.innerText = 'Moderate Thickness';
      resultBMI.style.color = colorBMI.moderateThickness;
      resultText.style.color = colorBMI.moderateThickness;
      break;
    case ( bmi >= 17 && bmi < 18.5 ) :
      resultText.innerText = 'Mild Thickness';
      resultBMI.style.color = colorBMI.mildThickness;
      resultText.style.color = colorBMI.mildThickness;
      break;
    case ( bmi >= 18.5 && bmi < 25 ) :
      resultText.innerText = 'Normal';
      resultBMI.style.color = colorBMI.normal;
      resultText.style.color = colorBMI.normal;
      break;
    case ( bmi >= 25 && bmi < 30 ) :
      resultText.innerText = 'Overweight';
      resultBMI.style.color = colorBMI.overweight;
      resultText.style.color = colorBMI.overweight;
      break;
    case ( bmi >= 30 && bmi < 35 ) :
      resultText.innerText = 'Obese Class I';
      resultBMI.style.color = colorBMI.obeseClassI;
      resultText.style.color = colorBMI.obeseClassI;
      break;
    case ( bmi >= 35 && bmi < 40 ) :
      resultText.innerText = 'Obese Class II';
      resultBMI.style.color = colorBMI.obeseClassII;
      resultText.style.color = colorBMI.obeseClassII;
      break;
    case ( bmi > 40 ) :
      resultText.innerText = 'Obese Class III';
      resultBMI.style.color = colorBMI.obeseClassIII;
      resultText.style.color = colorBMI.obeseClassIII;
      break;
  }

  
}

function clearFields() {
  document.getElementById('age').value = "";
  document.getElementById('heightCms').value = "";
  document.getElementById('heightFeet').value = "";
  document.getElementById('heightInches').value = "";
  document.getElementById('weightField').value = "";
  document.getElementById('resultBMI').innerText = "";
  document.getElementById('healthWeightRange').style.display = 'none';
  document.getElementById('loseOrGainWeight').style.display = 'none';
  document.getElementById('resultBMISpecifier').innerHTML = "";
  document.getElementById('resultBMI').innerHTML = "-";
  document.getElementById('resultBMI').style.color = "black";
  document.getElementById('resultText').innerHTML = "Result";
  document.getElementById('resultText').style.color = "black";
}