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

const SECOND_TO_DRAW = 5 // tính là giây
const MAX_COLUMN_SHOW = 20 // số cột thời gian hiển thị

// ------------------------------------------------------------
var dataLocalV = []

firebase.initializeApp(firebaseConfig);

var chartFrequency = null

const initChart = () => {
  const ctxFrequency = document.getElementById('canvas');

  let dataFrequency = {
    labels: [],
    datasets: [{
      label: 'Frequency',
      data: [],
      fill: false,
      borderColor: '#FF6000',
      tension: 0.4

    }]
  };
  chartFrequency = new Chart(ctxFrequency, {
    type: 'line', 
    data: dataFrequency,
  });

  
}

initChart()

const updateChart = (dataRealtime) => {
  if (chartFrequency === null ) initChart()

  const resultChainFrequency = []


  dataRealtime.forEach(item => {
    const date = new Date(item.time)
    resultChainFrequency.push({
      value: item.Frequency,
      date: `0${date.getHours()}`.slice(-2) + ':' + `0${date.getMinutes()}`.slice(-2) + ":" + `0${date.getSeconds()}`.slice(-2)
    })
  });

  let labelsFrequency = []
  let datasFrequency = []
  resultChainFrequency.forEach(item => {
    labelsFrequency.push(item.date)
    datasFrequency.push(item.value)
  });
  var chart_data_Frequency = chartFrequency.config.data
  chart_data_Frequency.datasets[0].data = datasFrequency
  chart_data_Frequency.labels = labelsFrequency
  chartFrequency.update()

}

var ref = firebase.database().ref('/');
var firestore = firebase.firestore()
var renderCount = 0

const getRowsData = async (number) => {
  const response = await new Promise((resolve, reject) => {
    firestore.collection("data")
      .orderBy("time", "desc")
      .limit(number)
      .get()
      .then((querySnapshot) => {
        const data = []
        querySnapshot.forEach((doc) => {
          data.push(doc.data())
          console.log(doc.id, " => ", doc.data())
        });
        resolve(data)
      });
  })

  return response.reverse()
}

const updateToFireStore = (data) => {  
  try {
    firestore.collection("data").add({
      ...data,
      time: new Date().getTime()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
  } catch (error) {
    console.log(error)    
  }  
}

const insertDataToLocal = (data) => {
  if (dataLocalV.length < MAX_COLUMN_SHOW)
    dataLocalV.push({
      ...data,
      time: new Date().getTime()
    })
  else {
    for (let i = 0; i < dataLocalV.length - 1; i++) {
      dataLocalV[i] = dataLocalV[i + 1]
    }
    dataLocalV[MAX_COLUMN_SHOW - 1] = {
      ...data,
      time: new Date().getTime()
    }
  }
}

const fetchDataAndUpdateChart = async () => {
  const response = await getRowsData(MAX_COLUMN_SHOW);
  dataLocalV = response;
  updateChart(dataLocalV);
}

fetchDataAndUpdateChart();


ref.on('value', async(snapshot) => {
  renderCount++
  if (renderCount === 1) return
  const data = snapshot.val();
  const currentData = await getRowsData(1)
  if (currentData && currentData.length > 0) {
    const miliseconds = currentData[0].time
    let date = new Date(miliseconds).setSeconds(new Date(miliseconds).getSeconds() + SECOND_TO_DRAW)
    date = new Date(date)
    if (date.getTime() <= new Date().getTime()) {
      insertDataToLocal(data)
      updateChart(dataLocalV)
      updateToFireStore(data)
    }
  } else {
    insertDataToLocal(data)
    updateChart(dataLocalV)
    updateToFireStore(data)
  }
});



