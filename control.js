

  const firebaseConfig = {
    apiKey: "AIzaSyBufFmFd5fOEht84Z5TDIyyo5CFPg0Q3rM",
    authDomain: "fir-esp32inverter3g3mx2.firebaseapp.com",
    databaseURL: "https://fir-esp32inverter3g3mx2-default-rtdb.firebaseio.com",
    projectId: "fir-esp32inverter3g3mx2",
    storageBucket: "fir-esp32inverter3g3mx2.appspot.com",
    messagingSenderId: "663774859222",
    appId: "1:663774859222:web:dcb02e6c83255da41f1e77",
    measurementId: "G-WNTN1VB9EP"
  };  

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();


  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var runningIcon = document.querySelector(".status-icon.running");
  var stoppedIcon = document.querySelector(".status-icon.stopped");
  var AutoIcon = document.querySelector(".status-icon.Auto");
  var ManualIcon = document.querySelector(".status-icon.Manual");
  var statusText = document.getElementById("statusText");
  var autoButton= document.getElementById("flexRadioDefault1");
  var manualButton= document.getElementById("flexRadioDefault2");
  var Forward= document.getElementById("flexRadioDefault11");
  var Reverse= document.getElementById("flexRadioDefault22");

  
  Forward.onclick=function(){
    console.log("On")
      const data = {
        ControllFuntionDirection:1
      }
      database.ref().update(data)
  }
  Reverse.onclick=function(){
    console.log("On")
      const data = {
        ControllFuntionDirection:0
      }
      database.ref().update(data)
  }
  // cập nhật ControllFuntionDirection firebase 
  database.ref('/ControllFuntionDirection').on('value', function (snapshot) {
    const direction = snapshot.val();
    if (direction === 1) {
      Forward.checked = true
    } else {
      Reverse.checked = true   }
  });
  

  
  database.ref("/AutoMannual").on("value", function (snapshot) {
    var AutoManual= snapshot.val();
    if( AutoManual== "1"){
      autoButton.checked = true
      AutoIcon.style.display = "none";
      ManualIcon.style.display = "block";
      startButton.onclick=function(){
      console.log("On")
        const data = {
          Start: 1,
          Stop: 0
        }
        database.ref().update(data)
        statusText.textContent = "Running"; 
        statusText.style.color = "green";
        runningIcon.style.display = "block";
        stoppedIcon.style.display = "none";
    }
    stopButton.onclick=function(){
      console.log("On")
        const data = {
          Start: 0,
          Stop: 0
        }
        database.ref().update(data)
        statusText.textContent = "Stopped";
        statusText.style.color = "red";
        runningIcon.style.display = "none";
        stoppedIcon.style.display = "block";
    }
  } else {
    manualButton.checked = true
    ManualIcon.style.display = "none";
    AutoIcon.style.display = "block";
    startButton.onclick=function(){ alert('Vui lòng chuyển sang chế độ Auto')}
    stopButton.onclick=function(){ alert('Vui lòng chuyển sang chế độ Auto')} 
  
  } });

  autoButton.onclick=function(){
    console.log("On")
      const data = {
        AutoMannual:1
      }
      database.ref().update(data)
      AutoIcon.style.display = "none";
      ManualIcon.style.display = "block";
  }
  manualButton.onclick=function(){
    console.log("On")
      const data = {
        AutoMannual:0
      }
      database.ref().update(data)
      ManualIcon.style.display = "none";
      AutoIcon.style.display = "block";
  }
// cập nhật Start Stop firebase 
  
database.ref('/Start').on('value', function (snapshot) {
  const start = snapshot.val();
  if (start === 1) {
    statusText.textContent = "Running"; 
    statusText.style.color = "green";
    runningIcon.style.display = "block";
    stoppedIcon.style.display = "none";
  } else {
    statusText.textContent = "Stopped";
    statusText.style.color = "red";
    runningIcon.style.display = "none";
    stoppedIcon.style.display = "block";
  }
});

// cập nhật Start Stop firebase 

  startButton.onclick = function(){
      
  }


  database.ref("/Frequency").on("value", function (snapshot) {
    var frequency = snapshot.val();
    if (frequency !== null) {
      // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
      var formattedFrequency = parseFloat(frequency).toFixed(2);
      document.getElementById("Frequency").innerHTML = formattedFrequency;
    }
  });
  database.ref("/Frequency").on("value", function (snapshot) {
    var frequency = snapshot.val();
    if (frequency !== null) {
      // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
      var formattedFrequency = parseFloat(frequency).toFixed(2);
      document.getElementById("Frequence1").innerHTML = formattedFrequency;
    }
  });

  database.ref("/Vout").on("value", function (snapshot) {
    var Vout = snapshot.val();
    if (Vout !== null) {
      // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
      var formattedVout = parseFloat(Vout).toFixed(2);
      document.getElementById("Voltage").innerHTML = formattedVout;
    }
  });
  
  database.ref("/Iout").on("value", function (snapshot) {
    var Iout = snapshot.val();
    if (Iout !== null) {
      // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
      var formattedIout = parseFloat(Iout).toFixed(2);
      document.getElementById("Ampe").innerHTML = formattedIout;
    }
  });
  database.ref("/RPM").on("value", function (snapshot) {
    var RPM = snapshot.val();
    if (RPM !== null) {
      // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
      var formattedRPM = parseFloat(RPM).toFixed(2);
      document.getElementById("RPM").innerHTML = formattedRPM;
    }
  });
// setF
// Lắng nghe sự kiện khi người dùng nhấn nút "Cài đặt tần số"
document.getElementById("setFrequencyButton").addEventListener("click", function () {
  // Lấy giá trị tần số từ người dùng
  const newFrequency = parseFloat(document.getElementById("frequencyInput").value);

  // Lưu tần số vào Firebase Realtime Database
  firebase.database().ref('FrequencySetting').set(newFrequency);
});
// Lắng nghe thay đổi trong Firebase Realtime Database
const frequencyRef = firebase.database().ref('FrequencySetting');
frequencyRef.on("value", function (snapshot) {
  const frequency = snapshot.val();
  // Cập nhật giao diện người dùng với tần số mới.
  document.getElementById("frequencyInput").value = frequency;
});


////
// Lắng nghe sự kiện thay đổi từ Firebase và cập nhật giao diện người dùng
const frequencyRef1 = firebase.database().ref('FrequencyMaximum');
frequencyRef1.on("value", function (snapshot) {
  const frequency1 = snapshot.val();
  // Cập nhật giao diện người dùng với tần số mới.
  document.getElementById("frequencyInputMaximum").value = frequency1;
});

// Lắng nghe sự kiện khi người dùng nhấn nút "Cài đặt tần số tối đa"
document.getElementById("setFrequencyButtonMaximum").addEventListener("click", function () {
  // Lấy giá trị tần số từ người dùng
  const newFrequency1 = parseFloat(document.getElementById("frequencyInputMaximum").value);

  // Lưu tần số vào Firebase Realtime Database
  firebase.database().ref('FrequencyMaximum').set(newFrequency1);
});

// Lắng nghe sự kiện khi tần số tối đa thay đổi trong Firebase
firebase.database().ref("/FrequencyMaximum").on("value", function (snapshot) {
  var FrequencyMaximum = snapshot.val();
  if (FrequencyMaximum !== null) {
    // Làm tròn và định dạng tần số với 2 chữ số sau dấu phẩy
    var formattedFrequency1 = parseFloat(FrequencyMaximum).toFixed(2);
    document.getElementById("frequencyInputMaximum").innerHTML = formattedFrequency1;
  }
});

