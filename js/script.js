document.addEventListener('DOMContentLoaded', () => {
   


    let scaledTrashItemWidth = 70; 
    let scaledTrashItemHeight = 70; 
    
    let scaleFactor = 1;


    function scaleGameArea() {
        const gameArea = document.getElementById('gameArea');
        if (!gameArea) return;
    
     
        const originalWidth = 1100;
        const originalHeight = 600;
    

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;


        const scaleX = windowWidth / originalWidth;
        const scaleY = windowHeight / originalHeight;
        scaleFactor = Math.min(scaleX, scaleY);
    
  
        gameArea.style.transform = `scale(${scaleFactor})`;
        gameArea.style.transformOrigin = 'top left';

        scaledTrashItemWidth = 70 * scaleFactor;
        scaledTrashItemHeight = 70 * scaleFactor;

    }
    

    scaleGameArea();
    


    
 
    window.addEventListener('resize', scaleGameArea);
    
   
   
   
   
   
   
   
   
    const conveyorBelt = document.getElementById('conveyorBelt');
    const bins = document.querySelectorAll('.bin');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    let draggedItem = null;
    let gameTimer = 60; // Start Sekunden für Ganzes Spiel
    let score = 0;

    let explosionSound = new Audio('sounds/explosion_louder.mp3'); 

    let backgroundMusic = document.getElementById('backgroundMusic');

    let paperSound = new Audio('sounds/Papier.mp3');
    let plasticSound = new Audio('sounds/plastik.mp3');
    let glassSound = new Audio('sounds/Glas.mp3');
    let metalSound = new Audio('sounds/Metal.mp3');
    let organicSound = new Audio('sounds/organic.mp3');    






    const shouldPlayMusic = localStorage.getItem('soundEnabled') === 'true';

   
    const soundToggleButton = document.getElementById('soundToggleGame');
    const soundIcon = document.getElementById('soundIcon');



    soundToggleButton.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.pause();
            soundIcon.src = 'img/off.png'; 
       
            const soundEnabled = localStorage.getItem('soundEnabled') === 'true';

            localStorage.setItem('soundEnabled', !soundEnabled);

            console.log("true");
        } else {
            backgroundMusic.play();
            soundIcon.src = 'img/on.png'; 
            localStorage.setItem('soundEnabled', 'true');

            console.log("else");
        }
    });








    const trashTypes = ['Paper', 'Plastic', 'Glass', 'Metal', 'Organic'];

    // Random Müllarten zuteilen
    function getRandomTrashType() {
        const randomIndex = Math.floor(Math.random() * trashTypes.length);
        return trashTypes[randomIndex];
    }

    // Müll erstellen
let positionIncrement = 1; // Speed Erhöhung GLOBAL
const positionIncrementInterval = setInterval(() => {
    positionIncrement += 0.1; 
}, 4000); // Interval Anpassen

function createTrashItem() {


    let item = document.createElement('div');
    item.className = 'trashItem';



    let trashType = getRandomTrashType(); // Ein Random Müll bekommen
    item.dataset.trashType = trashType; // den Type zuweisen
    item.style.backgroundImage = getBackgroundImageForType(trashType); // Hintergrundbild für Müll
    conveyorBelt.appendChild(item);

    item.addEventListener('mousedown', onItemMouseDown); // Eventlistener für Müllarten

    let position = 140; // Grundposition
    item.style.left = position + 'px';

    let topPosition = -90; // Grundposition Höhe
    item.style.top = topPosition + 'px'; 


    let currentItemSpeed = positionIncrement; // Momentane Geschwindigkeit für das Item LEsen


    const rightBound = 950;

    // Auf dem Fliessband laufen lassen
    const interval = setInterval(() => {
        position += currentItemSpeed; // die gelesene Geschwindigkeit benutzen
        if (position > conveyorBelt.offsetWidth || position > rightBound) {
            clearInterval(interval);
       
            if (item.parentElement) {
            
                score -= 5; // Punkte Entfernen, wenn der Müll vom Screen fällt
                updateGameTimer(-5);
                scoreDisplay.textContent = `Punkte: ${score}`;
                showExplosionAtItem(item, true);
                item.remove(); // Müll aus Spiel entfernen
            }
        } else {
            item.style.left = position + 'px';
        }
    }, 10);
    item.movementInterval = interval; // Interval ID ins Item speichern
}

    
function getBackgroundImageForType(trashType) {
    const imagePaths = {
        Paper: ['img/paper.png','img/Papiertuete.png','img/Altpapier.png' ],
        Plastic: ['img/plastic.png', 'img/PlastikSack.png' ],
        Glass: ['img/glass.png', 'img/Martini.png', 'img/Trinkglas.png' ],
        Metal: ['img/metal.png', 'img/UFO.png', 'img/Schwert.png'],
        Organic: ['img/organic.png', 'img/Fisch.png', 'img/Apfel.png', 'img/Pizza.png', 'img/Apfel1.png']
    };
    

    const randomIndex = Math.floor(Math.random() * imagePaths[trashType].length);
    const selectedImagePath = imagePaths[trashType][randomIndex];

    return `url('${selectedImagePath}')`;
}
    
    // Drag und Drop Funktion
    function onItemMouseDown(event) {


         const soundEnabled = localStorage.getItem('soundEnabled') === 'true';

    if (soundEnabled) {
        backgroundMusic.play();
        soundIcon.src = 'img/on.png'; 
    }



      //  createTrashItem();
        // Ist das Item, wo du draufklickst ein Müllitem?
        if (event.target.classList.contains('trashItem')) {
            draggedItem = event.target;


            clearInterval(draggedItem.movementInterval); // Müllitem Bewegung löschen
    


            draggedItem.style.width = scaledTrashItemWidth + 'px';
            draggedItem.style.height = scaledTrashItemHeight + 'px';



            // "Dragging State" einstellen

            draggedItem.style.position = 'absolute';
            draggedItem.style.zIndex = 1000;
            document.body.appendChild(draggedItem);
            draggedItem.style.left = event.clientX - draggedItem.offsetWidth / 2 + 'px';
            draggedItem.style.top = event.clientY - draggedItem.offsetHeight / 2 + 'px';
        }
    }
    

    // Kollisionserkennung
    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    // Ist das Item im Richtigen Mülleimer?
    function checkItemInBin(item, bin) {
        if (item.dataset.trashType.toLowerCase() === bin.id.replace('bin', '').toLowerCase()) {
            score += 10; // +10 für richtigen Müll
            updateGameTimer(5);
            playSoundForType(item.dataset.trashType);
        } else {
            score -= 5; // -5 Für Falschen Mülleimer
            updateGameTimer(-5);

            showExplosionAtItem(item);
    
        // Nach Delay entfernen
        setTimeout(() => {
            item.remove(); // item entfernen
            explosion.remove(); // GIF entfernen
        }, 600); 
    
        }
        scoreDisplay.textContent = `Punkte: ${score}`;
        item.remove(); // Item vom Spiel entfernen



    }


    function playSoundForType(trashType) {
        switch (trashType.toLowerCase()) {
            case 'paper':
                paperSound.play();
                break;
            case 'plastic':
                plasticSound.play();
                break;
            case 'glass':
                glassSound.play();
                break;
            case 'metal':
                metalSound.play();
                break;
            case 'organic':
                organicSound.play();
                break;
        }
    }



    // Mausbewegung Eventlistener
    document.addEventListener('mousemove', function(event) {
        if (draggedItem) {
            draggedItem.style.left = event.clientX - draggedItem.offsetWidth / 2 + 'px';
            draggedItem.style.top = event.clientY - draggedItem.offsetHeight / 2 + 'px';
        }
    });


    function showExplosionAtItem(item, offScreen = false) {
        let explosion = document.createElement('img');
        explosion.src = 'img/explosion.gif';
        explosion.className = 'explosion';
        explosion.style.position = 'absolute';


        const explosionSize = 80 * scaleFactor; 
        explosion.style.width = explosionSize + 'px';
        explosion.style.height = explosionSize + 'px';

      if (offScreen) { 
        const explosionRef = document.getElementById('explosionReference');
      const rect = explosionRef.getBoundingClientRect();
      explosion.style.left = `${rect.left}px`;
      explosion.style.top = `${rect.top}px`;
    } else {
        explosion.style.left = item.style.left;
        explosion.style.top = item.style.top;
    }


        explosion.style.zIndex = 1001;
        explosionSound.play();
    
        document.body.appendChild(explosion);
    
        setTimeout(() => {
            explosion.remove(); 
        }, 600); 
    }
    


    // Maus loslassen
    document.addEventListener('mouseup', function(event) {

        if (!draggedItem) return;

        let isOverBin = Array.from(bins).some(bin => isColliding(draggedItem, bin));
        if (isOverBin) {
            checkItemInBin(draggedItem, Array.from(bins).find(bin => isColliding(draggedItem, bin)));
        } else {
            score -= 5;
            updateGameTimer(-5); 
            scoreDisplay.textContent = `Punkte: ${score}`;

            showExplosionAtItem(draggedItem);
        }
        draggedItem.remove();
        draggedItem = null;
        
    });

    // Timer
    function updateGameTimer(timeChange) {
        gameTimer += timeChange;
        timerDisplay.textContent = `Zeit: ${gameTimer}s`;
        if (gameTimer <= 0) {
           // endGame();
        }
    }

    function updateTimer() {
        gameTimer--;
        timerDisplay.textContent = `Zeit: ${gameTimer}s`;
        if (gameTimer <= 0) {
            endGame();
        }
    }
    


    function endGame() {
        clearInterval(timerInterval);
        clearInterval(positionIncrementInterval);
        
        localStorage.setItem('lastScore', score);

        window.location.href = 'game-over';
    }


    let createInterval = 3000; // Startwert für das Erstellen von Müllitems (Umso geringer die Zahl, umso mehr Spawnt)



    // Game loop - Müllitems erstellen
    function startCreatingTrashItems() {
        createTrashItem(); // Erstellt ein Müllitem
    
        createInterval = Math.max(300, createInterval - 20); // Reduziert das Intervall, minimal 100 Millisekunden
        setTimeout(startCreatingTrashItems, createInterval); // Setzt das nächste Müllitem mit neuem Intervall
    }
    
    // Startet das Erstellen von Müllitems
    startCreatingTrashItems();
    
    

    const timerInterval = setInterval(updateTimer, 1000);

    // Event listener zum Erstellen von Items
    conveyorBelt.addEventListener('mousedown', onItemMouseDown);




/*--------------------------------TOUCHSCREEN--------------------------------*/

function onTouchStart(event) {

    const soundEnabled = localStorage.getItem('soundEnabled') === 'true';

    if (soundEnabled) {
        backgroundMusic.play();
        soundIcon.src = 'img/on.png'; 
    }

    if (event.target.classList.contains('trashItem')) {
        draggedItem = event.target;



        clearInterval(draggedItem.movementInterval); // Intembewegung Ausschalten


        draggedItem.style.width = scaledTrashItemWidth + 'px';
        draggedItem.style.height = scaledTrashItemHeight + 'px';




        // An Touchumgebung anpassen
        let touchLocation = event.targetTouches[0];
        draggedItem.style.position = 'absolute';
        draggedItem.style.zIndex = 1000;
        document.body.appendChild(draggedItem);
        draggedItem.style.left = touchLocation.pageX - draggedItem.offsetWidth / 2 + 'px';
        draggedItem.style.top = touchLocation.pageY - draggedItem.offsetHeight / 2 + 'px';
    }
}

function onTouchMove(event) {
    if (!draggedItem) return;
    let touchLocation = event.targetTouches[0];
    draggedItem.style.left = touchLocation.pageX - draggedItem.offsetWidth / 2 + 'px';
    draggedItem.style.top = touchLocation.pageY - draggedItem.offsetHeight / 2 + 'px';
}

function onTouchEnd(event) {
    if (!draggedItem) return;
    finalizeDrag();
}

// Geteilte Function für Maus und Touchscreen
function finalizeDrag() {
    let isOverBin = Array.from(bins).some(bin => isColliding(draggedItem, bin));
    if (isOverBin) {
        checkItemInBin(draggedItem, Array.from(bins).find(bin => isColliding(draggedItem, bin)));
    } else {
        score -= 5;
        updateGameTimer(-5);
        scoreDisplay.textContent = `Punkte: ${score}`;
        showExplosionAtItem(draggedItem);
    }
    draggedItem.remove();
    draggedItem = null;
}

// Touch Eventlistener
conveyorBelt.addEventListener('touchstart', onTouchStart);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', onTouchEnd);


document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });


});





