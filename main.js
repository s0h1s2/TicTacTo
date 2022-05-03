const markers=document.querySelectorAll(".marker");
let currentPlayer="x";
let playerMark="x";
let aiMark="o";
const winnerSpan=document.getElementById("winner");
const menu=document.getElementById("menu");
const game=document.getElementById("game");
const cells=document.querySelectorAll(".cell");
const resultOverlay=document.getElementById("resultOverlay");
const winnerContainer=document.getElementById("winnerContainer");
const quitBtn=document.getElementById("quitBtn");
const nextRoundBtn=document.getElementById("nextRoundBtn");
const retryBtn=document.getElementById("retryBtn");
const xSelection=document.getElementById("xSelection");
const oSelection=document.getElementById("oSelection");
const xScoreEl=document.getElementById("xScore");
const oScoreEl=document.getElementById("oScore");
const tieScoreEl=document.getElementById("tieScore");


const board=[
    -1,-1,-1,
    -1,-1,-1,
    -1,-1,-1
];
let scoreTable={
    [aiMark]:10,
    [playerMark]:-10
}

const playersScore={
    x:0,
    o:0,
    tie:0
};
const cpuBtn=document.getElementById("cpu");
const playerBtn=document.getElementById("player");

markers.forEach(function(e){
    e.onclick=function(){
        markers[0].classList.remove("select","dark");
        markers[1].classList.remove("select","dark");
        e.classList.add("select","dark");        
        if(oSelection.classList.contains("select")){
            playerMark="o";
            aiMark="x";
        }else{
            playerMark="x";
            aiMark="o";
        }
        scoreTable[aiMark]=10;
        scoreTable[playerMark]=-10;
    }
});
function showWinner(text){
    if(currentPlayer=="x"){
        winnerContainer.classList.add("bluesky");
    }else{
        winnerContainer.classList.add("gold");
    }
    resultOverlay.style.display="block";
    winnerSpan.textContent=text;

}
function hideMenu(){
    menu.style.display="none";
}
function showGame(){
    game.style.display="block";
    cells.forEach(function(cell){
        cell.onclick=onCellClick
    });    
}
cpuBtn.onclick=function(){ 
    hideMenu();
    showGame();
    against="ai";
    if(aiMark==currentPlayer){
        let bestIndex=bestAiMove();
        setTimeout(function(){
            placeMark(document.querySelector(`[data-index='${bestIndex}']`));
        },500);
    }

    
}
playerBtn.onclick=function(){
    hideMenu();
    showGame();
    against="player";
}
function placeMark(element){
    const index=element.dataset.index;
    if(board[index]==-1){
        const color=currentPlayer=="x"?"bluesky":"gold";
        element.textContent=currentPlayer;
        element.classList.add(color,"f64");
        element[index]=currentPlayer;        
        board[index]=currentPlayer;
        if(checkWinner(currentPlayer)){
            const text=`${currentPlayer} takes the round`;
            showWinner(text);
            updatePlayersScore();
            return ;
        }else if(isTie()){
            const text=`Tie`;
            showWinner(text);
            playersScore.tie+=1;
            tieScoreEl.textContent=playersScore.tie;
            return ;

        }
        currentPlayer=currentPlayer=="x"?"o":"x";
        if(currentPlayer==aiMark && against=="ai")
        {
            const bestIndex=bestAiMove();
            placeMark(document.querySelector(`[data-index='${bestIndex}']`));
        }
    }  
}
function updatePlayersScore(){
    if(currentPlayer=="x"){
        playersScore.x+=1;
        xScoreEl.textContent=playersScore.x;

    }else if(currentPlayer=="o")
    {
        playersScore.o+=1;
        oScoreEl.textContent=playersScore.o;
    }
}
function onCellClick(ev){
    const element=ev.target;
    placeMark(element);
}
quitBtn.onclick=function(){
    location.reload();
}
nextRoundBtn.onclick=function(){
    resetWhole();
}
retryBtn.onclick=function(){
    location.reload();
}
function resetWhole(){
    resetBoard();
    resetCells();
    resetPlayer();
    hideWinner();
}
function hideWinner(){
    resultOverlay.style.display="none";
}
function resetBoard(){
    for(let i=0;i<board.length;i++){
        board[i]=-1;
    }
}
function resetCells(){
    for(let i=0;i<cells.length;i++){
        cells[i].textContent="";
        cells[i].classList.remove("bluesky","gold");
    }
}
function resetPlayer(){
    currentPlayer="x";
    if(aiMark==currentPlayer && against=="ai"){
        let bestIndex=bestAiMove();
        placeMark(document.querySelector(`[data-index='${bestIndex}']`));
    }
    
}
function checkWinner(player){
    const postions=[[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]];
    for(let i=0;i<postions.length;i++){
        if(equals3(player,postions[i])){
            return true;
        }
    }
    return false;
}
function equals3(player,postions)
{
    for(let i=0;i<postions.length;i++){
        if(board[postions[i]]!=player){
            return false;
        }
    }
    return true;
}
function bestAiMove(){
    let bestScore=-Infinity;
    let move;
    for(let i=0;i<board.length;i++){
        if(board[i]==-1){
            board[i]=aiMark;
            let score=minimax(board,10,false,currentPlayer);
            board[i]=-1;
            if(bestScore<score){
                bestScore=score;
                move=i;
            }
        }
    }
    return move;
}
function isTie(){
    return board.filter(i=>i==-1).length==0;
}
function minimax(board,depth,isMax,currPlayer){
    if(isTie() || depth==0){
        return 0;
    }
    if(checkWinner(currPlayer)){
        return scoreTable[currPlayer];
    }
    if(isMax){
        let bestScore=-Infinity;
        for(let i=0;i<board.length;i++){
            if(board[i]==-1){
                board[i]=aiMark;
                let score=minimax(board,depth-1,false,currPlayer=playerMark);
                board[i]=-1;
                bestScore=Math.max(bestScore,score);
            }
        }
        return bestScore;
    }else{
        let bestScore=Infinity;
        for(let i=0;i<board.length;i++){
            if(board[i]==-1){
                board[i]=playerMark;
                let score=minimax(board,depth-1,true,currPlayer=aiMark);
                board[i]=-1;
                bestScore=Math.min(bestScore,score);
            }
        }
        return bestScore;
    }

}
