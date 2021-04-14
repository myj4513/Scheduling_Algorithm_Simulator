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
var pNum = 0;

let SPNSET = new Set();

var timeQuantum;
var selectedAlgorithm;
let currentTime = 0;
let totalTime = 0;
let isRunning = false;
let runningProcessName;
let runningProcessRemainBT;
let executeNum = 0;

var pArray = Array.from(Array(15), () => new Array(4));
var pWaitingTime = Array.from({length:15}, ()=>0);
var pTurnAroundTime = new Array(15);
var pNormalizedTT = new Array(15);
var processor = Array.from(()=>0);

let row1 = table3.insertRow(0);
let row2 = table3.insertRow(1);
var z=0;

let queue = new Array();

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
    size(){
        return this._arr.length;
    }
}

const q = new Queue();

function solveFCFS(){
    while(pNum !== 0){
        for(let j=0;j<index;j++){
            if(currentTime === Number(pArray[j][1])){
                q.enqueue(pArray[j]);
            }
        }
        if(isRunning === false){
            if(!q.isEmpty()){
                x = q.dequeue();
                processor[currentTime] = x[0];
                runningProcessName = x[0];
                runningProcessRemainBT = x[2]-1;
                if(runningProcessRemainBT>0){
                    isRunning = true;
                }
                else{
                    pNum--;
                }
            }
        }
        else{//isRunning === true;
            processor[currentTime] = runningProcessName;
            runningProcessRemainBT = runningProcessRemainBT-1;
            if(runningProcessRemainBT===0){
                isRunning = false;
                pNum--;
            }
        }
        currentTime++;
    }
}

function getTimeQuantum(){
    timeQuantum = Number(timeQuantumInput.value);
}

function solveRR(){
    while(pNum !== 0){
        for(let j=0;j<index;j++){
            if(currentTime===pArray[j][1]){
                q.enqueue(pArray[j]);
            }
        }
        if(isRunning===false){
            if(!q.isEmpty()){
                runRR();
            }
        }
        else{//isRunning === true; 이미 실행중인 프로세스가 있다면
            if(executeNum<timeQuantum){ //timequantum 횟수보다 덜 실행했다면
                processor[currentTime] = runningProcessName;
                runningProcessRemainBT = runningProcessRemainBT-1;
                if(runningProcessRemainBT>0){ //실행하고도 burstTime이 남았다면
                    executeNum++;
                }
                else{//runningProcessRemainBT===0 //실행후 burstTime이 0 이라면(프로세스 1개 완료)
                    pNum--;
                    isRunning = false;
                }
            }
            else{//executeNum === timeQuantum; timeQuantum 횟수만큼 실행했다면
                q.enqueue([runningProcessName,currentTime,runningProcessRemainBT]);
                runRR();
            }
        }
        currentTime++;
    }
}

function runRR(){ //실행중인 프로세스가 없을때 동작하는 함수
    x = q.dequeue();
    executeNum=0;
    processor[currentTime] = x[0];
    runningProcessRemainBT = x[2]-1;
    if(runningProcessRemainBT>0){// 한번에 안끝난경우
        runningProcessName = x[0];
        executeNum++;
        isRunning = true;
    }
    else{
        pNum--;
        isRunning = false;
    }
}

function getMinSPN(){
    let min = 100;
    let minIndex;
    for(let i=0;i<index;i++){
        if(SPNSET.has(pArray[i][0])){
            if(pArray[i][2]<=min){
                min = pArray[i][2];
                minIndex = Number(i);
            }
        }
    }
    SPNSET.delete(pArray[minIndex][0]);
    return minIndex;
} 

function solveSPN(){
    while(pNum !== 0){
        for(let j=0;j<index;j++){
            if(currentTime === Number(pArray[j][1])){
                SPNSET.add(pArray[j][0]);
            }
        }
        if(isRunning===false){
            if(SPNSET.size !== 0){
                let Min = getMinSPN();
                processor[currentTime] = pArray[Min][0];
                runningProcessName = pArray[Min][0];
                runningProcessRemainBT = pArray[Min][2]-1;
                if(runningProcessRemainBT>0){
                    isRunning = true;
                }
                else{
                    pNum--;
                }
            }
        }
        else{//isRunning === true;
            processor[currentTime] = runningProcessName;
            runningProcessRemainBT = runningProcessRemainBT-1;
            if(runningProcessRemainBT===0){
                isRunning = false;
                pNum--;
            }
        }
        currentTime++;
    }
}

function getMinSRTN(){
    let min = 100;
    let minIndex;
    for(let i=queue.length-1;i>=0;i--){
        if(queue[i][2]<=min){
            min = queue[i][2];
            minIndex = Number(i);
        }
    }
    let temp = queue[0];
    queue[0] = queue[minIndex];
    queue[minIndex] = temp;
}

function solveSRTN(){
    while(pNum!==0){
        for(let j=0;j<index;j++){
            if(currentTime===pArray[j][1]){
                queue.push(pArray[j]);
            }
        }
        if(queue.length!==0){
            getMinSRTN();
            x=queue.shift();
            processor[currentTime] = x[0];
            runningProcessName = x[0];
            runningProcessRemainBT = x[2]-1;
            if(runningProcessRemainBT>0){
                queue.push([runningProcessName, currentTime, runningProcessRemainBT]);
            }
            else{
                pNum--;
            }
        }
        currentTime++;
    }
}

function getMaxHRRN(){
    let max = 0;
    let maxIndex;
    for(let i=0;i<queue.length;i++){
        let responseRatio = (queue[i][3]+queue[i][2])/queue[i][2];
        if(responseRatio>=max){
            max=responseRatio;
            maxIndex = Number(i);
        }
    }
    let temp = queue[0];
    queue[0] = queue[maxIndex];
    queue[maxIndex] = temp;
}

function addWaitingTime(){
    for(let j=0;j<queue.length;j++){
        queue[j][3]++;
    }
}

function solveHRRN(){
    while(pNum !== 0){
        for(let j=0;j<index;j++){
            if(currentTime === Number(pArray[j][1])){
                queue.push(pArray[j]);
            }
        }
        if(isRunning === false){
            if(queue.length!==0){
                getMaxHRRN();
                x=queue.shift(); 
                processor[currentTime] = x[0];
                runningProcessName = x[0];
                runningProcessRemainBT = x[2]-1;
                addWaitingTime();
                if(runningProcessRemainBT>0){
                    isRunning =true;
                }
                else{
                    pNum--;
                }
            }
        }
        else{//isRunning === true;
            processor[currentTime] = runningProcessName;
            runningProcessRemainBT = runningProcessRemainBT-1;
            addWaitingTime();
            if(runningProcessRemainBT===0){
                isRunning = false;
                pNum--;
            }
        }
        currentTime++;
    }
}

function getOutputTable(){
    for(var i=0;i<currentTime;i++){
        for(var j=0;j<index;j++){
            if(processor[i]===pArray[j][0]){
                pTurnAroundTime[j] = Number(i+1);
            }
        }
    }
    for(var i=0;i<index;i++){
        pWaitingTime[i] = pTurnAroundTime[i] - pArray[i][1] - pArray[i][2];
        pTurnAroundTime[i] = pWaitingTime[i] + pArray[i][2];
        pNormalizedTT[i] = pTurnAroundTime[i]/pArray[i][2];
    }
}

function addVisual(){
    if(z<currentTime){
        let cell1 = row1.insertCell(z);
        let cell2 = row2.insertCell(z);
        let text1 = document.createTextNode(z+1);
        let text2 = document.createTextNode(processor[z]);
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
    pArray[index][3] = 0;
    index = index + 1;
    pNum = index;
}

function runAlgorithm(){
    if(selectedAlgorithm === "fcfs"){
        solveFCFS();
    }
    else if(selectedAlgorithm === "rr"){
        getTimeQuantum();
        solveRR();
    }
    else if(selectedAlgorithm === "spn"){
        solveSPN();
    }
    else if(selectedAlgorithm === "srtn"){
        solveSRTN();
    }
    else if(selectedAlgorithm === "hrrn"){
        solveHRRN();
    }
}

function handleButtonSimulate(){
    document.querySelector("#aa").style.width = 700+'px';
    getSelectedAlgorithm();
    runAlgorithm();
    showHiddenTables();
    getOutputTable();
    addOutput();
    setInterval(addVisual, 300);
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

function setPColor(z){
    let colorTd = table3.getElementsByTagName("td")
    for(let i=0; i<(z*2);i++){
        if(colorTd[i].innerHTML === pArray[0][0]){
            colorTd[i].style.backgroundColor = "lightpink";
        }
        if(colorTd[i].innerHTML === pArray[1][0]){
            colorTd[i].style.backgroundColor = "lightcoral";
        }
        if(colorTd[i].innerHTML === pArray[2][0]){
            colorTd[i].style.backgroundColor = "skyblue";
        }
        if(colorTd[i].innerHTML === pArray[3][0]){
            colorTd[i].style.backgroundColor = "yellow";
        }
        if(colorTd[i].innerHTML === pArray[4][0]){
            colorTd[i].style.backgroundColor = "paleturquoise";
        }
        if(colorTd[i].innerHTML === pArray[5][0]){
            colorTd[i].style.backgroundColor = "aquamarine";
        }
        if(colorTd[i].innerHTML === pArray[6][0]){
            colorTd[i].style.backgroundColor = "bisque";
        }
        if(colorTd[i].innerHTML === pArray[7][0]){
            colorTd[i].style.backgroundColor = "greenyellow";
        }
        if(colorTd[i].innerHTML === pArray[8][0]){
            colorTd[i].style.backgroundColor = "lightcyan";
        }
        if(colorTd[i].innerHTML === pArray[9][0]){
            colorTd[i].style.backgroundColor = "lemonchiffon";
        }
        if(colorTd[i].innerHTML === pArray[10][0]){
            colorTd[i].style.backgroundColor = "palegreen";
        }
        if(colorTd[i].innerHTML === pArray[11][0]){
            colorTd[i].style.backgroundColor = "salmon";
        }
        if(colorTd[i].innerHTML === pArray[12][0]){
            colorTd[i].style.backgroundColor = "pink";
        }
        if(colorTd[i].innerHTML === pArray[13][0]){
            colorTd[i].style.backgroundColor = "sandybrown";
        }
        if(colorTd[i].innerHTML === pArray[14][0]){
            colorTd[i].style.backgroundColor = "palegoldenred";
        }
    }
}