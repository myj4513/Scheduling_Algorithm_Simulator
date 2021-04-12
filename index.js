let table1 = document.querySelector(".insert_table");
let table2 = document.querySelector(".output_table");
let table3 = document.querySelector(".visual_table");
const button = document.getElementById("btn_addRow");
const button_start = document.getElementById("btn_simulate");
const rr = document.querySelector("#rr");
const timeQuantumInput = document.querySelector("#timeQuantum-input");
var pName = document.getElementById("pName");
var pArrivalTime = document.getElementById("pArrivalTime");
var pBurstTime = document.getElementById("pBurstTime");
var index = 0;

var pArray = Array.from(Array(15), () => new Array(2));
var pWaitingTime = Array.from({length:10}, ()=>0);
var pTurnAroundTime = new Array(10);
var pNormalizedTT = new Array(10);
var time = new Array(1000);
var selectedAlgorithm;
var totalTime = 0;

let row1 = table3.insertRow(0);
let row2 = table3.insertRow(1);
var z=0;

var timeQuantum;

class Queue {
    constructor(){
        this._arr = [];
    }
    enqueue(item){
        this._arr.push(item);
    }
    dequeue(){
        return this._arr.shift();
    }
}

const q = new Queue();

function getTotalTime(){
    for(var i=0;i<index;i++){
        totalTime += Number(pArray[i][2]);
    }
}

function addRow(){
    let row = table1.insertRow(index+1);
    let cell1 = row.insertCell(0);
    let text1 = document.createTextNode(pName.value);
    let cell2 = row.insertCell(1);
    let text2 = document.createTextNode(pArrivalTime.value);
    let cell3 = row.insertCell(2);
    let text3 = document.createTextNode(pBurstTime.value);
    cell1.appendChild(text1);
    cell2.appendChild(text2);
    cell3.appendChild(text3);
    pArray[index][0] = pName.value;
    pArray[index][1] = Number(pArrivalTime.value);
    pArray[index][2] = pBurstTime.value;
    index = index + 1;
}

function addToQueue(){
    for(let i=0;i<20;i++){
        for(let j=0;j<index;j++){
            if(i === Number(pArray[j][1])){
                q.enqueue(pArray[j]);
            }
        }
    }
}

function getProcessor(){
    let k = 0;
    for(let j = 0;j<index;j++){
        let x = q.dequeue(); 
        for(let i=0;i<x[2];i++){
            time[k] = x[0];
            k++;
        }
    }
}

function getPWT(){
    for(var i=1;i<index;i++){
        for(var j=0;j<i;j++){
            pWaitingTime[i] += Number(pArray[j][2]);
        }
        pWaitingTime[i] -= pArray[i][1];
    }
}
function getPTAT(){
    for(var i=0;i<index;i++){
        pTurnAroundTime[i] = Number(pArray[i][2])+pWaitingTime[i];
    }
}

function getPNTT(){
    for(var i=0;i<index;i++){
        pNormalizedTT[i] = pTurnAroundTime[i]/Number(pArray[i][2]);
    }
}

function addVisual(){
    if(z<totalTime){
        let cell1 = row1.insertCell(z);
        let cell2 = row2.insertCell(z);
        let text1 = document.createTextNode(z+1);
        let text2 = document.createTextNode(time[z]);
        cell1.appendChild(text1);
        cell2.appendChild(text2);
        z++;
    }
    setPColor(z);
}

function addOutput(){
    for(var i=0;i<index;i++){
        let row = table2.insertRow(i+1);
        let cell1 = row.insertCell(0);
        let text1 = document.createTextNode(pArray[i][0]);
        let cell2 = row.insertCell(1);
        let text2 = document.createTextNode(pArray[i][1]);
        let cell3 = row.insertCell(2);
        let text3 = document.createTextNode(pArray[i][2]);
        let cell4 = row.insertCell(3);
        let text4 = document.createTextNode(pWaitingTime[i]);
        let cell5 = row.insertCell(4);
        let text5 = document.createTextNode(pTurnAroundTime[i]);
        let cell6 = row.insertCell(5);
        let text6 = document.createTextNode(pNormalizedTT[i].toFixed(1));
        cell1.appendChild(text1);
        cell2.appendChild(text2);
        cell3.appendChild(text3);
        cell4.appendChild(text4);
        cell5.appendChild(text5);
        cell6.appendChild(text6);
    }
}

function setPColor(z){
    for(let i=0; i<(z*2);i++){
        if(table3.getElementsByTagName("td")[i].innerHTML === "p1"){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "lightpink";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === "p2"){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "lightcoral";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === "p3"){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "skyblue";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === "p4"){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "salmon";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === "p5"){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "paleturquoise";
        }
    }
}

function showHiddenTables(){
    table2.classList.remove("noShowing");
    table3.classList.remove("noShowing");
}

function getSelectedAlgorithm(){
    const algorithmNodeList = document.getElementsByName("schedulingAlgorithm");
    algorithmNodeList.forEach((node)=>{
        if(node.checked){
            selectedAlgorithm = node.value;
        }
    })
}

function sortArray(){
    pArray.sort(function(a,b){
        return a[1] - b[1];
    });
}

function runAlgorithm(){
    if(selectedAlgorithm === "fcfs"){
        addToQueue();
        getProcessor();
        getPWT();
        getPTAT();
        getPNTT();
        showHiddenTables();
        addOutput();
        setInterval(addVisual, 300);

    }
    else if(selectedAlgorithm === "rr"){
        timeQuantum = timeQuantumInput.value;
        console.log(timeQuantum);
    }
}

function handleButtonSimulate(){
    getSelectedAlgorithm();
    sortArray();
    getTotalTime();
    runAlgorithm();
}

function handleRR(){
    document.querySelector(".timeQuantum").classList.remove("noShowing");
}

function init(){
    button.addEventListener("click", addRow);
    button_start.addEventListener("click", handleButtonSimulate);
    rr.addEventListener("click", handleRR);
}

init();