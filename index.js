let table1 = document.querySelector(".insert_table"); 
let table2 = document.querySelector(".output_table");  
let table3 = document.querySelector(".visual_table");   
const row2 = document.querySelector(".row:nth-of-type(2)");
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
var multiCoreNum = 1;
let currentTime = 0;
let isRunning = Array.from({length:4}, ()=>false);
let runningProcessName = new Array(4);

let runningProcessPriorCheck = new Array(4);

let runningProcessRemainBT = new Array(4);
let executeNum = Array.from({length:4}, ()=>0);

var pArray = Array.from(Array(15), () => new Array(5));
var pWaitingTime = Array.from({length:15}, ()=>0);
var pTurnAroundTime = new Array(15);
var pNormalizedTT = new Array(15);
var processor = Array.from({length:4}, ()=> Array(100).fill(""));

let row1 = table3.insertRow(0);
let rows = new Array(5);
rows[0] = table3.insertRow(1);
rows[1] = table3.insertRow(2);
rows[2] = table3.insertRow(3);
rows[3] = table3.insertRow(4);
rows[4] = table3.insertRow(0);
var z=0;

let queue = new Array();
let priorQueue = new Array();    
let isChecked = new Array();    

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
        for(let i=0;i<multiCoreNum;i++){
            if(isRunning[i] === false){
                if(!q.isEmpty()){
                    x = q.dequeue();
                    processor[i][currentTime] = x[0];
                    runningProcessName[i] = x[0];
                    runningProcessRemainBT[i] = x[2]-1;
                    if(runningProcessRemainBT[i]>0){
                        isRunning[i] = true;
                    }
                    else{
                        pNum--;
                    }
                }
            }
            else{
                processor[i][currentTime] = runningProcessName[i];
                runningProcessRemainBT[i] = runningProcessRemainBT[i]-1;
                if(runningProcessRemainBT[i]===0){
                    isRunning[i] = false;
                    pNum--;
                }
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
        
        for(let i=0;i<multiCoreNum;i++){    
            if(isRunning[i]===false){       
                if(!q.isEmpty()){           
                    runRR(i);               
                }
            }
            else{
                if(executeNum[i]<timeQuantum){ 
                    processor[i][currentTime] = runningProcessName[i];
                    runningProcessRemainBT[i] = runningProcessRemainBT[i]-1;
                    if(runningProcessRemainBT[i]>0){ 
                        executeNum[i]++;
                    }
                    else{
                        pNum--;
                        isRunning[i] = false;
                    }
                }
                else{
                    q.enqueue([runningProcessName[i],currentTime,runningProcessRemainBT[i]]);
                    runRR(i);
                }
            }
        }
        currentTime++;
    }
}

function runRR(i){ 
    x = q.dequeue();
    executeNum[i]=0;
    processor[i][currentTime] = x[0];
    runningProcessRemainBT[i] = x[2]-1;
    if(runningProcessRemainBT[i]>0){
        runningProcessName[i] = x[0];
        executeNum[i]++;
        isRunning[i] = true;
    }
    else{
        pNum--;
        isRunning[i] = false;
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
        for(let i=0;i<multiCoreNum;i++){
            if(isRunning[i]===false){
                if(SPNSET.size !== 0){
                    let Min = getMinSPN();
                    processor[i][currentTime] = pArray[Min][0];
                    runningProcessName[i] = pArray[Min][0];
                    runningProcessRemainBT[i] = pArray[Min][2]-1;
                    if(runningProcessRemainBT[i]>0){
                        isRunning[i] = true;
                    }
                    else{
                        pNum--;
                    }
                }
            }
            else{
                processor[i][currentTime] = runningProcessName[i];
                runningProcessRemainBT[i] = runningProcessRemainBT[i]-1;
                if(runningProcessRemainBT[i]===0){
                    isRunning[i] = false;
                    pNum--;
                }
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
        for(let i=0;i<multiCoreNum;i++){
            if(queue.length>0){
                getMinSRTN();
                x=queue.shift();
                processor[i][currentTime] = x[0];
                runningProcessName[i] = x[0];
                runningProcessRemainBT[i] = x[2]-1; 
            }
            else{
                runningProcessName[i]=undefined;
            }
        }
        for(let i=0;i<multiCoreNum;i++){
            if(runningProcessName[i]!==undefined){
                if(runningProcessRemainBT[i]>0){
                    queue.push([runningProcessName[i], currentTime, runningProcessRemainBT[i]]);
                }
                else{
                    pNum--;
                } 
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
        for(let i=0;i<multiCoreNum;i++){
            if(isRunning[i] === false){
                if(queue.length!==0){
                    getMaxHRRN();
                    x=queue.shift(); 
                    processor[i][currentTime] = x[0];
                    runningProcessName[i] = x[0];
                    runningProcessRemainBT[i] = x[2]-1;
                    addWaitingTime();
                    if(runningProcessRemainBT[i]>0){
                        isRunning[i] =true;
                    }
                    else{
                        pNum--;
                    }
                }
            }
            else{
                processor[i][currentTime] = runningProcessName[i];
                runningProcessRemainBT[i] = runningProcessRemainBT[i]-1;
                addWaitingTime();
                if(runningProcessRemainBT[i]===0){
                    isRunning[i] = false;
                    pNum--;
                }
            }
        }
        currentTime++;
    }
}


function solveNEW() {   
    while(pNum!==0){    
        for(let j=0;j<index;j++){               
            if(currentTime===pArray[j][1]){     
                if(pArray[j][4] === true){      
                    priorQueue.push(pArray[j]); 
                }
                else{                           
                    queue.push(pArray[j]);      
                }
            }
        }
        for(let i=0;i<multiCoreNum;i++){        
            if(isRunning[i] === true) {         
                processor[i][currentTime] = runningProcessName[i];
                runningProcessRemainBT[i] -= 1;                 
            }
            else{                                               
                if(priorQueue.length>0){                     
                    x=priorQueue.shift();                    
                    processor[i][currentTime] = x[0];        
                    runningProcessName[i] = x[0];       
                    runningProcessRemainBT[i] = x[2]-1;      
                    runningProcessPriorCheck[i] = true;      
                    isRunning[i] = true;                     
                }
                else {                                       
                    if(queue.length>0){                      
                        getMinSRTN();                        
                        x=queue.shift();                     
                        processor[i][currentTime] = x[0];    
                        runningProcessName[i] = x[0];           
                        runningProcessRemainBT[i] = x[2]-1;  
                        runningProcessPriorCheck[i] = false; 
                    }
                    else{                                    
                        runningProcessName[i]=undefined;     
                    }
                }
            }
            
        }
        for(let i=0;i<multiCoreNum;i++){                    
            if(runningProcessName[i]!==undefined){          
                if(runningProcessRemainBT[i]>0){            
                    if(!runningProcessPriorCheck[i]){    
                        queue.push([runningProcessName[i], currentTime, runningProcessRemainBT[i]]);  
                    }
                }
                else{                                    
                    isRunning[i] = false;                
                    pNum--;                              
                } 
            }
        }
        currentTime++;                                   
    }
}

function getOutputTable(){
    for(var j=0;j<index;j++){
        let max = 0;
        for(let k=0;k<multiCoreNum;k++){
            for(var i=0;i<currentTime;i++){
                if(processor[k][i]===pArray[j][0]){
                    if(i>=max){
                        max=i+1;
                    }
                }
            }            
        }
        pTurnAroundTime[j] = max;
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
        let text1 = document.createTextNode(z+1);
        cell1.appendChild(text1);
        for(let i=0;i<multiCoreNum;i++){
            let cell2 = rows[i].insertCell(z);
            let text2 = document.createTextNode(processor[i][z]);
            cell2.appendChild(text2);
        }
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
    row2.classList.remove("noShowing");
    table2.classList.remove("noShowing");
    table3.classList.remove("noShowing");
}

function getMultiCoreNum(){
    if(document.querySelector(".multiCoreNum").value===""){
        multiCoreNum=1;
    }else{
        multiCoreNum = Number(document.querySelector(".multiCoreNum").value);
    }
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
    else if(selectedAlgorithm === "new") {
        for(let i=0; i<index; i++) {                               
            if (document.querySelector("#p"+i).checked === true) { 
                pArray[i][4] = true;                               
            }
            else pArray[i][4] = false;
        }
        solveNEW();
    }
}

function handleButtonSimulate(){
    getMultiCoreNum();
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

function handleMultiCore(){
    if(document.querySelector(".multiCoreNum").classList.contains("noShowing")){
        document.querySelector(".multiCoreNum").classList.remove("noShowing");
    }
    else{
        document.querySelector(".multiCoreNum").classList.add("noShowing");
    }
}

function handleNew() {  
    const priority = document.querySelector(".priority");
    
    for(let i=0; i<index; i++) {                               
        const selectPriority = document.createElement("input");
        selectPriority.type = "checkbox";
        selectPriority.id = "p"+ i;
        let processName = document.createTextNode(pArray[i][0]);
        priority.appendChild(processName);                      
        priority.appendChild(selectPriority);
    }
}

function init(){
    button.addEventListener("click", addRow);
    button_start.addEventListener("click", handleButtonSimulate);
    rr.addEventListener("click", handleRR);
    document.querySelector("#multiCore").addEventListener("click", handleMultiCore);
    const nAlgo = document.querySelector("#new");
    nAlgo.addEventListener("click", handleNew);
}

init();

function setPColor(z){
    let colorTd = table3.getElementsByTagName("td")
    for(let i=0; i<z*(multiCoreNum+1);i++){
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
        if(colorTd[i].innerHTML === ""){
            colorTd[i].style.backgroundColor = "white";
        }
    }
}