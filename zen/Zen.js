function Zen() {

    "use strict";
   
    const BALL_RADIUS = [5, 10, 15];
    const PEG_SEP = 100;
    const FISH_TIME = 5000;

    let div = document.getElementById("FishCanvas");

    //add a new fish automatically every (5) seconds
    setInterval(addFish, FISH_TIME);

    // 'populate pond' button
    let fishbutton = document.getElementById("fishbutton");
    fishbutton.addEventListener("click", addFish);

    // add more fish when the pond is clicked
    let pond = document.getElementById("waterOverlay");
    pond.addEventListener("click", addFish);

    // add links to all decorative images
    let links = ["https://myodfw.com/articles/herman-sturgeon",
        "https://www.petsmart.com/learning-center/fish-care/koi-fish-care-and-pond-guide-tips-for-caring-for-your-koi-fish/A0017.html",
        "https://en.wikipedia.org/wiki/Special:Random",
        "https://open.spotify.com/playlist/37i9dQZF1DWVFeEut75IAL",
        "https://youtu.be/VUdhsDPujv8"];

    let img = document.getElementById("link");
    img.addEventListener("click", e => {
        img.href = links[Math.floor(Math.random() * links.length)];
    });

    
    //creating the sand garden
    let page = document.getElementById("page");
    let sandcanvas = document.createElement("canvas");
    sandcanvas.id = "sand";
    sandcanvas.width = 400;
    sandcanvas.height = 400;
    sandcanvas.className = "SandCanvas";
    let mx = sandcanvas.width/2;
    let my = sandcanvas.height/2;
    let ctx = sandcanvas.getContext("2d");

    //setting the background of the sandcanvas to sand img
    let background = document.createElement("img");
    background.src = "sand.jpg";
    background.onload = function(){
        ctx.drawImage(background, 0, 0);
    }
    

    //setting up the drawing function for the sand garden
    let isDrawing = false;
    let x = 0;
    let y = 0;

    sandcanvas.addEventListener("mousedown", e =>{
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    });

    sandcanvas.addEventListener("mousemove", e =>{
        if (isDrawing === true){
            drawLine(ctx, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
        }
    });

    window.addEventListener("mouseup", e=>{
        if (isDrawing === true){
            drawLine(ctx, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }
    });

    function drawLine(ctx, x1, y1, x2, y2){
        ctx.beginPath();
        ctx.strokeStyle = "tan";
        ctx.lineWidth = 6;
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x1 + 10, y1 - 5);
        ctx.lineTo(x2 + 10, y2 - 5);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x1 - 10, y1 + 5);
        ctx.lineTo(x2 - 10, y2 + 5);
        ctx.stroke();
        ctx.closePath();
    }
    page.appendChild(sandcanvas);

    //button for clearing the sand garden
    let clearbutton = document.getElementById("clearbutton");
    clearbutton.addEventListener("click", clear);

    function clear(){
        let sandcanvas = document.getElementById("sand");
        let ctx = sandcanvas.getContext("2d");
        ctx.clearRect(0,0,sandcanvas.width, sandcanvas.height);
        let background = document.createElement("img");
        background.src = "sand.jpg";
        background.onload = function(){
        ctx.drawImage(background, 0, 0);
        }
    }

    // make the timer function happen
    timer();

    //function to make a no-moving timer
    function timer() {
        const TIME_STEP = 1000;

        let timer = document.getElementById("timer");
        let recordDisplay = document.getElementById("record");
        let min = 0;
        let sec = 0;
        let record = 0;
        step();
        setInterval(step, TIME_STEP);

        //updating the time every second
        function step() {
            sec++;
            if (sec === 60) {
                min++;
                sec = 0;
            }
            if (min === 60) {
                timer.innerHTML = "wow!";
            }

            if (sec < 10) {
                sec = "0" + sec;
            }

            // displaying the record for longest time
            record = Math.max(min * 60 + parseInt(sec), record);
            let recordMin = Math.floor(record/60);
            let recordSec = record % 60;
            if (recordMin < 10) {
                recordMin = "0" + recordMin;
            } if (recordSec < 10) {
                recordSec = "0" + recordSec;
            }
            recordDisplay.innerHTML = recordMin + ":" + recordSec;

            // movement sensitivity
            document.body.addEventListener("mousemove", e => {
                sec = -1;
                min = 0;
            })

            // click sensitivity
            document.body.addEventListener("click", e => {
                sec = -1;
                min = 0;
            })
            if (min < 10) {
                timer.innerHTML =  "0" + min + ":" + sec;
            } else {
                timer.innerHTML =  min + ":" + sec;
            }
            
        }

    }

    function addFish() {
        let canvas = document.createElement("canvas"); 
        canvas.width = 510;
        canvas.height = 510;
        canvas.className = "FishCanvas";
        let ctx = canvas.getContext("2d");
        let r = BALL_RADIUS[Math.floor(Math.random() * BALL_RADIUS.length)];

        //random pegs for the fish to start at
        let nAcross = Math.floor(canvas.width / PEG_SEP);
        let nDown = Math.floor(canvas.height / PEG_SEP);
        let pegs = createFishpoints();
        let fishPoint = pegs[Math.floor(Math.random() * 20)];
        let bx = fishPoint.x;
        let by = fishPoint.y;

        //random x and y speeds
        let speed = [0.03, 0.02, 0.01];
        let initial_vx = speed[Math.floor(Math.random() * 3)];
        if (bx > 2 * (canvas.width / 3)) {
            initial_vx = -initial_vx;
        }
        let initial_vy = speed[Math.floor(Math.random() * 3)];
        if (by > 2 * (canvas.height / 3)) {
            initial_vy = -initial_vy;
        }

        // random color for the fish and fish outline
        let colors = ["white", "tomato", "lightsalmon", "sienna", "peru"];
        let colorFill = colors[Math.floor(Math.random() * 3)];
        let colorBorder = colors[Math.floor(Math.random() * 5)];
        

        // initializing the animation
        let vx = initial_vx;
        let vy = initial_vy;
        let lastTimestamp = 0;
        window.requestAnimationFrame(step);
        div.appendChild(canvas);
        if (div.children.length >= 100){
            alert("Please be patient.");
            alert("I'm adding fish to this pond as fast as I can!");
        }

        function step(timestamp) {
            let dt = timestamp - lastTimestamp;            
            if (lastTimestamp === 0) {
                dt = 0;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            makefish(bx, by, r, colorFill, colorBorder);
            bx += dt * vx;
            by += dt * vy;
            lastTimestamp = timestamp;

            // removing the canvas if the fish has left the screen
            if (bx < canvas.width + 2*r && bx >  - 2*r &&
                by < canvas.height + 2*r && by > - 2*r) {
                window.requestAnimationFrame(step);
            } else {
                div.removeChild(canvas);
            }
            
        }

        //drawing the fish
        function makefish(x, y, r, colorFill, colorBorder) {
            ctx.save();
            ctx.fillStyle = colorFill;
            ctx.strokeStyle = colorBorder;
            ctx.lineWidth = 2;
            ctx.beginPath();

            //making heads & tails for the fish based on direction
            if (vx > 0 && vy > 0) { // moving right and down
                ctx.arc(x, y, r, Math.PI, 1.5 * Math.PI, true);
                ctx.moveTo(x - r, y);
                ctx.lineTo(x - r * 2, y - r * 2);
                ctx.lineTo(x, y - r);
            } else if (vx > 0 && vy < 0) { // moving right and up
                ctx.arc(x, y, r, Math.PI, 0.5 * Math.PI);
                ctx.moveTo(x, y + r);
                ctx.lineTo(x - r * 2, y + r * 2);
                ctx.lineTo(x - r, y);
            } else if (vx < 0 && vy > 0) { // left and down
                ctx.arc(x, y, r, 0, 1.5 * Math.PI);
                ctx.moveTo(x, y - r);
                ctx.lineTo(x + r * 2, y - r * 2);
                ctx.lineTo(x + r, y);
            } else { // left and up
               ctx.arc(x, y, r, 0.5 * Math.PI, 0); 
               ctx.moveTo(x + r, y);
               ctx.lineTo(x + r * 2, y + r * 2);
               ctx.lineTo(x, y + r);
            }

            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        function createFishpoints() {
            let pegs = [ ];
            for (let i = 0; i < nAcross; i++) {
                pegs.push({ x : i * PEG_SEP, y : 0 });
            }
            for (let i = 0; i < nDown; i++) {
                pegs.push({ x : nAcross * PEG_SEP, y : i * PEG_SEP});
            }
            for (let i = nAcross; i > 0; i--) {
                pegs.push({ x : i * PEG_SEP, y : nDown * PEG_SEP});
            }
            for (let i = nDown; i > 0; i--) {
                pegs.push({ x : 0, y : i * PEG_SEP});
            }
            return pegs;
        }

    }

}