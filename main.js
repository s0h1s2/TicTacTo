let currentPlayer="x";
let playerMark="x";
let aiMark="o";

const markers=document.querySelectorAll(".marker");
const menu=document.getElementById("menu");
const game=document.getElementById("game");
const cells=document.querySelectorAll(".cell");
const board=[
    -1,-1,-1,
    -1,-1,-1,
    -1,-1,-1
];
let scoreTable={
    [aiMark]:10,
    [playerMark]:-10
}
const cpuBtn=document.getElementById("cpu");
const playerBtn=document.getElementById("player");

markers.forEach(function(e){
    e.onclick=function(){
        markers[0].classList.remove("select","dark");
        markers[1].classList.remove("select","dark");
        e.classList.add("select","dark");
    }
});
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
    against="player";
    hideMenu();
    showGame();
}
function placeMark(element){
    const index=element.dataset.index;
    if(board[index]==-1){
        const color=currentPlayer=="x"?"bluesky":"gold";
        element.textContent=currentPlayer;
        element.classList.add(color,"f64");
        element[index]=currentPlayer;        
        board[index]=currentPlayer;
        if(checkWinner(currentPlayer) || isTie()){
            location.reload();
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
function onCellClick(ev){
    const element=ev.target;
    placeMark(element);
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