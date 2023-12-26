const MAX_COLUMN_SHOW = 15;

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

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Mảng lưu trữ các hàng hiện tại
const tableRows = [];

// Lắng nghe sự kiện thay đổi dữ liệu từ Realtime Database
database.ref('/').on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    // Lấy giá trị mới từ Realtime Database
    const newItem = data;

    // Thêm giá trị mới vào mảng
    tableRows.unshift(newItem);

    // Kiểm tra xem mảng có nhiều hơn 15 hàng không
    if (tableRows.length > MAX_COLUMN_SHOW) {
      // Nếu có, hãy loại bỏ hàng cuối cùng
      tableRows.pop();
    }

    // Cập nhật dữ liệu lên trang web
    const tbodyElement = document.getElementById("tbody");
    tbodyElement.innerHTML = ''; // Xóa nội dung cũ

    // Tạo dòng cho mỗi phần tử trong mảng
    tableRows.forEach((item, index) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td scope="col">${item.Vout}</td>
          <td scope="col">${item.Iout}</td> 
          <td scope="col">${item.Frequency}</td>
          <td scope="col">${item.Torque}</td>
          <td scope="col">${item.FrequencyMaximum}</td>
          <td scope="col">${item.FrequencySetting}</td>
          <td scope="col">${item.ControllFuntionDirection === 1 ? "Thuận" : "Nghịch"}</td>
          <td scope="col">${item.Start}</td>
          <td scope="col">${item.Stop}</td>
          <td scope="col">${item.AutoMannual === 1 ? "Auto" : "Manual"}</td>
          <td scope="col">${new Date().toLocaleString()}</td>
      `;

      tbodyElement.appendChild(newRow);
    });
  }
}, (error) => {
  console.log(error);
});
