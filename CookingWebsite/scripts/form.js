let ingreCount = 1;
let direcCount = 1;

function addIngre(){
    if (ingreCount < 15){
        document.getElementById("ingreBox").insertAdjacentHTML("beforeend", "<input type='text' id='ingredients' name='ingredients'>");
        ingreCount += 1;
    }
}

function addDirec(){
    if (direcCount < 15){
        document.getElementById("direcBox").insertAdjacentHTML("beforeend", "<input type='text' id='ingredients' name='ingredients'>");
        document.getElementById("direcBox").insertAdjacentHTML("beforeend", "<br>");
        direcCount += 1;
    }
}
