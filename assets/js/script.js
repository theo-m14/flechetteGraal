let getLaunchBtn = document.getElementById('launchGame');
let getHideGame = document.getElementById('hideGame');
let getGameBoard = document.getElementById('gameBoard');
let getBackBtn = document.getElementById('backBtn');
let getNumberPlayer = document.getElementById('selectPlayer');
let getNumberPoint = document.getElementById('selectPoints');
let getAllPlayer = document.querySelectorAll('#playerPoint > div');
let getAllDisplayPoint = document.querySelectorAll('#playerPoint .displayPoint');
let getDisplayError = document.querySelector('#displayError p');
let getAllCase = document.querySelectorAll('#number div');
let getCloseModal = document.querySelector('#caseModal .fa-times-circle');
let getPointModal = document.getElementById('backgroundModal');
let getBtnSendPoint = document.querySelector('#gameBoard #caseModal .btn');
let getNbrPointModal = document.querySelector("#caseModal > p");
let getAllMultiplicator = document.querySelectorAll('#caseModal div p');
let getErrorSentScore = document.querySelector('#sendScoreError');
let getDisplayRank = document.getElementById('rankingMessage');
let getTypeOfGame = document.getElementById('typeOfGame');
let getAllCricketCase = Array.from(document.querySelectorAll('.cricket p'));
let gameArray = [];
let playerArray = [];
let oneMultiplicatorSelected = false;
let actualMultiplicator;
let win = false;
let cricketRound = 20;
let playerInGameArray;
let actualPlayer;
let actualCase;
let getCricketArrow;

getTypeOfGame.addEventListener('change',function(e){
    if(getTypeOfGame.value == 'cricket'){
        getNumberPoint.style.display = 'none';
        getNumberPoint.previousSibling.previousElementSibling.style.display = 'none';
    }else{
        getNumberPoint.style.display = 'block';
        getNumberPoint.previousSibling.previousElementSibling.style.display = 'block';
    }
});

getLaunchBtn.addEventListener('click',function(e){
    e.preventDefault();
    if(initializeGame()){
        getHideGame.style.display = 'none';
        getGameBoard.style.display = 'block';
        if(getTypeOfGame.value == 'cricket'){
            changeDisplayCricket();
        }
        playGame();
    }else{
        getDisplayError.innerText = 'Veuillez choisir un nombre de joueurs et/ou de points valide';
    }
});

getBackBtn.addEventListener('click', function(e){
    getHideGame.style.display = 'block';
    getGameBoard.style.display = 'none';
});

function changeDisplayCricket(){
    getAllCase.forEach(eachCase =>{
        if(!eachCase.classList.contains('cricket')){
            eachCase.style.display = 'none';
        }else{
            eachCase.classList.remove('redCase');
            eachCase.classList.add('cricketCase');
        }
        if(eachCase.innerText == '25'){
            eachCase.children[0].innerText = 'BULL';
        }
    });
    document.getElementById('number').classList.add('cricketMode');
    document.getElementById('numberInfoContainer').classList.add('cricketMode');
    document.getElementById('cricketInfo').classList.remove('none');
}

function initializeGame(){
    let nbrplayer = parseInt(getNumberPlayer.value);
    if(nbrplayer>=1 && nbrplayer<=4){
        for(let i = 0;i<nbrplayer;i++){
            getAllPlayer[i].style.display = 'block';
        }
        //If game is cricket
        if(getTypeOfGame.value == 'cricket'){
            getAllDisplayPoint.forEach(displayPoint => {displayPoint.innerText = '0';});
            createGameArray(nbrplayer,0);
            getBackBtn.style.marginBottom = '3.2em';
            return true;
        }
    }else return false;
    if(getNumberPoint.value == '301' || getNumberPoint.value == '501' || getNumberPoint.value == '701' || getNumberPoint.value == '1001'){
        getAllDisplayPoint.forEach(displayPoint => {displayPoint.innerText = getNumberPoint.value; });
        createGameArray(nbrplayer,parseInt(getNumberPoint.value));
        return true;
    }else return false;
}

function createGameArray(nbrplayer,nbrPoint){
    if(getTypeOfGame.value == 'cricket'){
        for(let i=0;i<nbrplayer;i++){
            playerArray.push({'actualPlayer' : false,'score' : 0,'throw': 3});
        }
        playerArray[0].actualPlayer=true;
        getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].classList.add('active');
        getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.add('active');
        gameArray = [
            {'case':'20','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'19','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'18','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'17','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'16','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'15','player1':0,'player2':0,'player3':0,'player4':0,'open':false},
            {'case':'25','player1':0,'player2':0,'player3':0,'player4':0,'open':false}
        ];
    }else{
        for(let i = 0; i<nbrplayer;i++){
            gameArray.push({'actualPlayer' : false,'score' : nbrPoint,'throw': 3});
        }
        gameArray[0].actualPlayer=true;
        //Change style of actual player
        getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].classList.add('active');
        getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.add('active');
    }
}

function registerPoint(){
    oneMultiplicatorSelected = false;
    getAllMultiplicator.forEach(multiplicator => {
        if(multiplicator.classList.contains('clicked')){
             oneMultiplicatorSelected = true;
        }
    });
    if(oneMultiplicatorSelected){
        calculPoint();
        getPointModal.style.display = 'none';
        changeMultiplicator('reset');
        getErrorSentScore.innerText = '';
    }else{
        getErrorSentScore.innerText = 'Veuillez sélectionner un multiplicateur';
    }
}

function cricketCalcul(actualCase,actualPlayer,multiplicator){
    if(getNbrPointModal.innerText !== '0'){
        playerInGameArray = 'player' + (playerArray.findIndex(player => player.actualPlayer === true)+1);
        if(actualCase[0].open == false && actualCase[0].open != -1){
            if(actualCase[0][playerInGameArray]+multiplicator>=3){
                actualCase[0].open = true;
                actualCase[0][playerInGameArray]=3;
                updateCricketDisplay(actualCase,playerInGameArray,'open');
            }else{
                actualCase[0][playerInGameArray]+=multiplicator;
                updateCricketDisplay(actualCase,playerInGameArray,'increment');
            }
        }else{
            //open area
            if(actualCase[0][playerInGameArray]==3 && actualCase[0].open !== -1){
                //if player have this area
                actualPlayer.score+=parseInt(actualCase[0].case)*multiplicator;
            }else{
                if(actualCase[0][playerInGameArray]+multiplicator>=3){
                    //closing area           
                    actualCase[0].open = -1;
                    actualCase[0][playerInGameArray]=3;
                    //Check if all case is close
                    if(gameArray.findIndex(eachCase => eachCase.open == true) == -1 && gameArray.findIndex(eachCase => eachCase.open == false) == -1){
                        cricketGameFinished();
                    }else{
                        updateCricketDisplay(actualCase,playerInGameArray,'close');
                    }
                }else{
                    //update area
                    actualCase[0][playerInGameArray]+=multiplicator;
                    updateCricketDisplay(actualCase,playerInGameArray,'increment');
                }
            }
        }
    }
}

function updateCricketDisplay(actualCase,playerInGameArray,action){
    let infoPlayer = 'infoPlayer' + (playerArray.findIndex(player => player.actualPlayer === true)+1);
    let indexOfArrow = gameArray.findIndex(eachCase => eachCase.case == actualCase[0].case);
    let playerColor;
    switch(playerInGameArray){
        case 'player1':
            playerColor = 'red';
            break;
        case 'player2':
            playerColor = 'green';
            break;
        case 'player3':
            playerColor = 'blue';
            break;
        default:
            playerColor = '#fd00b6';
    }
    getCricketArrow = document.querySelectorAll('#' + infoPlayer + ' .arrowPlayer > div')[indexOfArrow];
    switch(action){
        case 'open':
            //On ouvre la zone visuellement -> ajout de la croix complete + changement couleur joueur
            for(let i=0;i<getCricketArrow.children.length;i++){
                getCricketArrow.children[i].style.opacity = '1';
            }
            if(actualCase[0].case !== '25'){
                getAllCricketCase.filter(cricketCase => cricketCase.innerText == actualCase[0].case)[0].parentElement.style.backgroundColor = playerColor;
            }else{
                getAllCricketCase.filter(cricketCase => cricketCase.innerText == 'BULL')[0].parentElement.style.backgroundColor = playerColor;
            }
            break;
        case 'increment':
            //On update la croix en fonction de actualCase[0][playerInGameArray]
            for(let i=0;i<actualCase[0][playerInGameArray];i++){
                getCricketArrow.children[i].style.opacity = '1';
            }
            break;
        case 'close':
            //On ferme la zone visuellement -> ajout croix + changement couleur gris
            for(let i=0;i<getCricketArrow.children.length;i++){
                getCricketArrow.children[i].style.opacity = '1';
            }
            if(actualCase[0].case !== '25'){
                getAllCricketCase.filter(cricketCase => cricketCase.innerText == actualCase[0].case)[0].parentElement.style.backgroundColor = 'grey';
            }else{
                getAllCricketCase.filter(cricketCase => cricketCase.innerText == 'BULL')[0].parentElement.style.backgroundColor = 'grey';
            }
            break;
    }
}

function calculPoint(){
    if(getTypeOfGame.value !== 'cricket'){
        actualPlayer = gameArray.filter(player => player.actualPlayer == true)[0];
        switch(actualMultiplicator){
            case 'x1':
                if(actualPlayer.score - parseInt(getNbrPointModal.innerText)>0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText);
                }else if(actualPlayer.score - parseInt(getNbrPointModal.innerText) == 0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText);
                    playerWin(actualPlayer);
                }
                break;
            case 'x2':
                if(actualPlayer.score - parseInt(getNbrPointModal.innerText)*2 >0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText)*2;
                }else if(actualPlayer.score - parseInt(getNbrPointModal.innerText)*2 == 0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText)*2;
                    playerWin(actualPlayer);
                }
                break;
            case 'x3':
                if(actualPlayer.score - parseInt(getNbrPointModal.innerText)*3 >0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText)*3;
                }else if(actualPlayer.score - parseInt(getNbrPointModal.innerText)*3 == 0){
                    actualPlayer.score-=parseInt(getNbrPointModal.innerText)*3;
                    playerWin(actualPlayer);
                }
                break;
            default:
                console.log('Une erreur est survenue');
        }
    }else{
        //If cricket mod is one
        if(getNbrPointModal.innerText !== 'BULL'){
            actualCase = gameArray.filter(actualCase => actualCase.case == getNbrPointModal.innerText);
        }else{
            actualCase = gameArray.filter(actualCase => actualCase.case == '25');
        }
        actualPlayer = playerArray.filter(player => player.actualPlayer == true)[0];
        switch(actualMultiplicator){
            case 'x1':
                //getNbrPointModal.innerText -> point de la case cliqué
                cricketCalcul(actualCase,actualPlayer,1);
                break;
            case 'x2':
                cricketCalcul(actualCase,actualPlayer,2);
                break;
            case 'x3':
                cricketCalcul(actualCase,actualPlayer,3);
                break;
            default:
                console.log('Une erreur est survenue');
        }
    }
    //refresh display score
    if(!win){
        if(getTypeOfGame.value !== 'cricket'){
            getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].innerText = actualPlayer.score;
        }else{
            getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].innerText = actualPlayer.score;
        }
    }
    //check if they are more one player
    if(gameArray.length>1){
        if(getTypeOfGame.value != 'cricket'){
            checkPlayerThrow(actualPlayer);
        }else if(playerArray.length>1){
            checkPlayerThrow(actualPlayer);
        }else{
            cricketRound--;
            if(cricketRound==0){
                cricketGameFinished();
            }
        }
    }
}

function playerWin(actualPlayer){
    getDisplayRank.classList.add('active');
    win = true;
    let WinnerNumber = gameArray.findIndex(player => player == actualPlayer)+1;
    getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].innerText = actualPlayer.score;
    let winString = `<h1>Félicitations le Joueur ${WinnerNumber} gagne !</h1>`;
    if(gameArray.length>2){
        let registerPlayerScore = [];
        for(let i=0;i<gameArray.length;i++){
            registerPlayerScore.push({'score' : gameArray[i].score, 'player' : i+1})
        }
        registerPlayerScore.sort(function compare(a, b) {
            if (a.score < b.score)
               return -1;
            if (a.score > b.score)
               return 1;
            return 0;
          });
        for(let j=1;j<registerPlayerScore.length;j++){
            winString+=`<p class='rankPlayer'>#${j+1} : Joueur ${registerPlayerScore[j].player}</p><p>${registerPlayerScore[j].score} Points</p>`;
        }
        getDisplayRank.innerHTML = winString;
    }else{
          getDisplayRank.innerHTML = winString;
      }
}

function cricketGameFinished(){
    console.log('ca win');
    getDisplayRank.classList.add('active');
    getDisplayRank.style.display = 'block';
    document.getElementById('number').style.width='100%';
    document.getElementById('cricketInfo').style.display='none';
    win = true;
    winString = '<h1>Fin de Partie !</h1>';
    if(playerArray.length>1){
        let registerPlayerScore = [];
        for(let i=0;i<playerArray.length;i++){
            registerPlayerScore.push({'score' : playerArray[i].score, 'player' : i+1});   
        }
        registerPlayerScore.sort(function compare(a, b) {
            if (a.score < b.score)
               return 1;
            if (a.score > b.score)
               return -1;
            return 0;
        });
        for(let j=0;j<registerPlayerScore.length;j++){
            winString+=`<p class='rankPlayer'>#${j+1} : Joueur ${registerPlayerScore[j].player}</p><p>${registerPlayerScore[j].score} Points</p>`;
        }
        getDisplayRank.innerHTML = winString;
    }else{
        getDisplayRank.innerHTML = winString;
    }
}

function checkPlayerThrow(actualPlayer){
    if(actualPlayer.throw > 1){
        actualPlayer.throw--;
    }else{
        actualPlayer.throw = 3;
        //remove style previous active player
        if(getTypeOfGame.value !== 'cricket'){
            getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].classList.remove('active');
            getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.remove('active');
            //update next active player
            if(gameArray.findIndex(player => player.actualPlayer == true) == gameArray.length-1){
                gameArray.filter(player => player.actualPlayer == false)[0].actualPlayer = true;
            }else{
                gameArray[gameArray.findIndex(player => player.actualPlayer == true)+1].actualPlayer = true;
            }
            actualPlayer.actualPlayer = false;
            //adding style active player
            getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].classList.add('active');
            getAllDisplayPoint[gameArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.add('active');
        }else{
            getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].classList.remove('active');
            getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.remove('active');
            //update next active player
            if(playerArray.findIndex(player => player.actualPlayer == true) == playerArray.length-1){
                playerArray.filter(player => player.actualPlayer == false)[0].actualPlayer = true;
            }else{
                playerArray[playerArray.findIndex(player => player.actualPlayer == true)+1].actualPlayer = true;
            }
            actualPlayer.actualPlayer = false;
            //adding style active player
            getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].classList.add('active');
            getAllDisplayPoint[playerArray.findIndex(player => player.actualPlayer == true)].previousSibling.previousElementSibling.classList.add('active');
        }
    }
    cricketRound--;
    if(cricketRound==0){
        cricketGameFinished();
    }
}

function playGame(){
    getAllCase.forEach(caseClicked => 
        {
            caseClicked.addEventListener('click',function(e){
                if(win==false){
                    getPointModal.style.display = 'block';
                    getNbrPointModal.innerText = caseClicked.innerText;
                    if(caseClicked.innerText == '25' || caseClicked.innerText == '50' || caseClicked.innerText == '0'){
                        getAllMultiplicator.forEach(multiplicator =>{
                            if(multiplicator.innerText == 'x2' || multiplicator.innerText == 'x3'){
                                multiplicator.style.display = 'none';
                            }
                        });
                    }else if(caseClicked.innerText == 'BULL'){
                        getAllMultiplicator.forEach(multiplicator =>{
                            if(multiplicator.innerText == 'x3'){
                                multiplicator.style.display = 'none';
                            }
                        });
                    }else{
                        getAllMultiplicator.forEach(multiplicator =>{
                            if(multiplicator.innerText == 'x2' || multiplicator.innerText == 'x3' || multiplicator.innerText == 'x1'){
                                multiplicator.style.display = 'block';
                            }
                        });
                    }
                }
            });
        });
    getAllMultiplicator.forEach(multiplicator =>{
        multiplicator.addEventListener('click', function(event){
            changeMultiplicator(event.target);
        });
    });
    getBtnSendPoint.addEventListener('click', registerPoint);
}

function changeMultiplicator(target){
    getAllMultiplicator.forEach(multiplicator => {
        if(multiplicator === target){
            multiplicator.classList.toggle('clicked');
            actualMultiplicator = target.innerText;
        }else{
            multiplicator.classList.remove('clicked');
        }
    })
}

getCloseModal.addEventListener('click',function(){
    getPointModal.style.display = 'none';
    getErrorSentScore.innerText = '';
    changeMultiplicator('reset');
});

//Close modal of point on background click
getPointModal.addEventListener('click', function(event){
    //check if isn't on modal child
    let notChildrenModal = true;
    if(event.target == document.getElementById('caseModal').children.item(4) || event.target == document.getElementById('caseModal').children.item(1) || event.target == document.getElementById('caseModal').children.item(2) || event.target == document.getElementById('caseModal').children.item(3)){
        notChildrenModal = false;
    }
    //Check if isn't on multiplicator
    let notMultiplicator = true;
    getAllMultiplicator.forEach(multiplicator => {if(event.target == multiplicator)notMultiplicator=false;})
    if(event.target != document.getElementById('caseModal') && notChildrenModal && notMultiplicator && event.target != getBtnSendPoint && event.target != document.querySelector('#gameBoard #caseModal .btn i')){
        getPointModal.style.display = 'none';
        getErrorSentScore.innerText = '';
    }
});