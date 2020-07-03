

//Get chart from canvas in html
var ctx = document.getElementById('myChart').getContext('2d');

//establish global variables
let globalNumPoints=300;
let globalNumGroups=document.getElementById('k-options').value;
let labelsList=["Group:1","Group:2","Group:3","Group:4","Group:5","Group:6"];
let backgroundColorList=['rgb(200, 99, 255, 0.5)','rgb(0, 99, 255, 0.5)','rgba(100, 200, 132, 0.5)','rgb(255, 0,255, 0.5)','rgb(255, 255, 0, 0.5)','rgb(100, 100, 100, 0.75)']

//initialize chart labels and points
let labels= fillxlabel(globalNumPoints);
let listed=filllabels(globalNumPoints,globalNumGroups);
let dataset=generateDataSet(globalNumGroups);


myData = {
        labels: labels,
        datasets: dataset
    };

// Default chart defined with type: 'line'
Chart.defaults.global.defaultFontFamily = "monospace";
Chart.defaults.global.animation.duration=1000;


var myChart = new Chart(ctx, {
    type: 'line',
    data: myData
});


//called when datapoints are reset by user
function changeK(){
  //creates an entirely new Chart object with new data and updates k, if changed.
  globalNumGroups=document.getElementById('k-options').value;
  myChart.destroy();
  labels=fillxlabel(globalNumPoints);
  listed=filllabels(globalNumPoints,globalNumGroups);
  dataset=generateDataSet(globalNumGroups);
  myData = {
          labels: labels,
          datasets: dataset
      };
      myChart = new Chart(ctx, {
          type: 'line',
          data: myData
      });
      myChart.update();
}

//generates initial random datasets dependent on k groups
function generateDataSet(numGroups){
let data=[];

data.push({
  label: "Random-ish Data",
  fill: false,
  showLine:false,
  backgroundColor: 'rgb(255, 0, 0, 0.25)',
  borderColor: 'rgb(255, 0, 0)',
  data: listed[0],
})
for (let i=0;i<numGroups;i++){
  data.push({
    label: labelsList[i],
    fill: false,
    showLine:false,
    radius:6,
    backgroundColor: backgroundColorList[i],
    borderColor: 'rgb(190, 99, 255)',
    data: listed[i+1],
  })
}
  return data;
}


function fillxlabel(numPoints){
  const labels= [];
  for (let i=0;i<numPoints;i++){
    labels.push(i);
  }
  return labels;
}

//creates random-ish dataset and initial k values
function filllabels(numPoints, numGroups) {
  let listedGroups=[];
  for (let z=0;z<numGroups+1;z++){
    listedGroups.push([]);
  }
  for (var i=1;i<listedGroups.length;i++){
    let a=Math.floor(Math.random() * numPoints);
    let b=Math.floor(Math.random() * 150);
    listedGroups[i].push({x:a,y:b});
}
let point;
  for (var i=1;i<numPoints;i++){
  /*  if (i<numPoints/4){
      point=Math.floor(Math.random() * 150)
      while (point<50){
        point=Math.floor(Math.random() * 150)
      }
    }else if (i<numPoints/2){
      point=Math.floor(Math.random() * 100)

    }else{
      point=Math.floor(Math.random() * 150)
      while (point<20){
      point=Math.floor(Math.random() * 150)
      }
    }*/
    point=randomizing(i,numPoints);
      listedGroups[0].push({x:i,y:point});
  }
  return listedGroups;
};


function addData(numPoints,numGroups,chart) {
  for (var i=1;i<numGroups+1;i++){
    let a=Math.floor(Math.random() * numPoints);
    let b=Math.floor(Math.random() * 150);
    chart.data.datasets[i].data.push({x:a,y:b});
}
for (let i=0;i<numPoints;i++){
  chart.data.datasets[0].data.push({x:i,y:randomizing(i,numPoints)});
}

  chart.update();
}
//helper function to make random dataset
function randomizing(i,numPoints){
    let point;
      if (i<numPoints/4){
        point=Math.floor(Math.random() * 150)
        while (point<50){
          point=Math.floor(Math.random() * 150)
        }
      }else if (i<numPoints/2){
        point=Math.floor(Math.random() * 100)

      }else{
        point=Math.floor(Math.random() * 150)
        while (point<20){
        point=Math.floor(Math.random() * 150)
        }
      }
        return point;
    }


function removeData(chart) {
  let numGroups=chart.data.datasets.length;
  for (let z=0;z<numGroups;z++){
    let length=chart.data.datasets[z].data.length;
    for (let i=0;i<length;i++){
      chart.data.datasets[z].data.pop();
    }
  }

}
function groupPoints(){
   document.getElementById("messageID").innerText="All points are assigned to the closest grouping, calculated from their coordinates";
let length=myChart.data.datasets[0].data.length;
let count=0;
    for (let i=0;i<length;i++){

    setTimeout(() => {
        let y=myChart.data.datasets[0].data.pop();
        let group=findGroup(y.x,y.y);
        myChart.data.datasets[group].data.push({x:y.x,y:y.y});
      myChart.update();
    }, 5*i);

  }
}


function resetMeans(){
    let pointsInGroups=0;
    for (let i=1;i<myChart.data.datasets.length;i++){
        pointsInGroups+=myChart.data.datasets[i].data.length;
      }
    if (pointsInGroups>myChart.data.datasets.length-1){
    document.getElementById("messageID").innerText="Starting Points are then reset to the average of all points in the group";
}else{
    document.getElementById("messageID").innerText="Whoops! Try grouping the points first";
}

  let changed=false;
  let newx=0;
  let newy=0;
  let count=0;

  for (let z=1;z<myChart.data.datasets.length;z++){
    for (let i=1;i<myChart.data.datasets[z].data.length;i++){
        newx+=myChart.data.datasets[z].data[i].x;
        newy+=myChart.data.datasets[z].data[i].y;
        count++;
    }
    if (count!=0){
      newx=Math.round(newx/count);
      newy=Math.round(newy/count);
      if (myChart.data.datasets[z].data[0].x!=newx||myChart.data.datasets[z].data[0].y!=newy){
        changed=true;
      }
      myChart.data.datasets[z].data[0].x=newx;
      myChart.data.datasets[z].data[0].y=newy;
    }
    newx=0;
    newy=0;
    count=0;
  }

if (changed==false&&pointsInGroups>myChart.data.datasets.length-1){
  document.getElementById("messageID").innerText="Means have stabilized!";
}

myChart.update();

//shows animation for moving k-means before resetting data
setTimeout(() => {  resetpoints();
return changed;

}, 500);

}


function resetpoints(){
let point;
let length;
for (let z=1;z<myChart.data.datasets.length;z++){
  length=myChart.data.datasets[z].data.length-1
    for (let i=0;i<length;i++){
        point=myChart.data.datasets[z].data.pop();
        myChart.data.datasets[0].data.push(point);
        myChart.update();
    }
}
  myChart.update();
}

function findGroup(x,y){
  let minimum=10000;
  let group;
  let k2x;
  let k2y;

for (let z=1;z<myChart.data.datasets.length;z++){
  k2x=myChart.data.datasets[z].data[0].x;
  k2y=myChart.data.datasets[z].data[0].y;
  value=(x-k2x)*(x-k2x)+(y-k2y)*(y-k2y);
  if (value<0){
    value+=-1;
  }
  value=Math.sqrt(value);

  if (value<minimum){
    minimum =value;
    group=z
  }
}
return group;
}


function randomizeData() {
  changeK();
  document.getElementById("messageID").innerText="";
  document.getElementById("messageBottomID").innerText="";
  // Randomize data button function
//removeData(myChart);
//addData(globalNumPoints,myChart);

};
