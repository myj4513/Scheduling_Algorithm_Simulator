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


let k = 0;

var pArray = Array.from(Array(15), () => new Array(2));
var pArray_copy = Array.from(Array(15), () => new Array(2));
var pWaitingTime = Array.from({length:15}, ()=>0);
var pTurnAroundTime = new Array(15);
var pNormalizedTT = new Array(15);
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
    isEmpty(){
        return this._arr.length === 0;
    }
}

const q = new Queue();

function getTotalTime(){
    for(var i=0;i<index;i++){
        totalTime += Number(pArray[i][2]);
    }
}

function addToQueue_rr(){
    for(var i=0;i<1000;i++){
        for(var m=index-1;m>=0;m--){
            if(i===pArray_copy[m][1]){
                q.enqueue(pArray_copy[m]);
                run();
            }
        }
    }
}

function run(){
    let remainBT
    while(!q.isEmpty()){
        x = q.dequeue();
        remainBT = x[2];
        let p = Number(k);
        if(remainBT<timeQuantum){
            for(var j=0;j<x[2];j++){
                time[k] = x[0];
                remainBT--;
                k++;
            }
        }
        else{
            for(var j=0;j<timeQuantum;j++){
                time[k] = x[0];
                remainBT--;
                k++;
            }
        }
        if(remainBT>0){
            for(var i=0;i<index;i++){
                if(x[0]==pArray_copy[i][0]){
                    pArray_copy[i][1] = p + timeQuantum; //오반데;;
                    pArray_copy[i][2] = remainBT;
                }
            }
        }  
    }  
}

function getOutputTable_rr(){
    for(var i=0;i<1000;i++){
        if(time[i]===pArray[0][0]){
            pTurnAroundTime[0] = Number(i+1);
        }
        if(time[i]===pArray[1][0]){
            pTurnAroundTime[1] = Number(i+1);
        }
        if(time[i]===pArray[2][0]){
            pTurnAroundTime[2] = Number(i+1);
        }
        if(time[i]===pArray[3][0]){
            pTurnAroundTime[3] = Number(i+1);
        }
        if(time[i]===pArray[4][0]){
            pTurnAroundTime[4] = Number(i+1);
        }
    }
    for(var i=0;i<index;i++){
        pWaitingTime[i] = pTurnAroundTime[i] - pArray[i][1] - pArray[i][2];
        pTurnAroundTime[i] = pWaitingTime[i] + pArray[i][2];
        pNormalizedTT[i] = pTurnAroundTime[i]/pArray[i][2];
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
    pArray[index][2] = Number(pBurstTime.value);
    pArray_copy[index][0] = pName.value;
    pArray_copy[index][1] = Number(pArrivalTime.value);
    pArray_copy[index][2] = Number(pBurstTime.value);
    console.log(pArray[index][0],pArray[index][1],pArray[index][2]);
    index = index + 1;
}

function addToQueue(){
    for(let i=0;i<1000;i++){
        for(let j=0;j<index;j++){
            if(i === Number(pArray[j][1])){
                q.enqueue(pArray[j]);
            }
        }
    }
}

function getProcessor(){
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
        if(table3.getElementsByTagName("td")[i].innerHTML === pArray[0][0]){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "lightpink";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === pArray[1][0]){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "lightcoral";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === pArray[2][0]){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "skyblue";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === pArray[3][0]){
            table3.getElementsByTagName("td")[i].style.backgroundColor = "yellow";
        }
        if(table3.getElementsByTagName("td")[i].innerHTML === pArray[4][0]){
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

function getTimeQuantum(){
    timeQuantum = Number(timeQuantumInput.value);
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
        getTimeQuantum();
        addToQueue_rr();
        showHiddenTables();
        getOutputTable_rr();
        addOutput();
        setInterval(addVisual, 300);
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