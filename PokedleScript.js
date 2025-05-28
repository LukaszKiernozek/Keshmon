async function getPokemonData(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) throw new Error("Pokemon not found");

        const data = await response.json();
        console.log(data);
        return data;
    }   catch (error) {
        console.error(error);
    }
}

function hashStringToIndex(str, max) {
    let hash = 0;
    for (let i =0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) % max;
}

let answer = "";
let allFiveLetterNames = [];

async function getFiveLetterPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await response.json();

        allFiveLetterNames = data.results
            .map(p => p.name)
            .filter(name => name.length === 5);

            const today = new Date().toISOString().split("T")[0];

            const index = hashStringToIndex(today, allFiveLetterNames.length);
            answer = allFiveLetterNames[index];

            console.log("Answer is:", answer);
    }   catch (error) {
        console.error("Error fetching pokemon list:", error);
    }
}
let currentRow = 0;

document.querySelector("form").addEventListener("submit", function (e) {e.preventDefault();

    const guess = document.getElementById("text").value.toLowerCase();
    if (guess.length !== 5) return alert("must be 5 letters long!");

    const row = document.querySelector(`.row-${currentRow}`);
    const boxes = row.querySelectorAll(".letter-box");

    for (let i = 0; i < 5; i++) {
        const letter = guess[i];
        boxes[i].textContent = letter;

        if (letter === answer[i]) {
            boxes[i].style.backgroundColor = "green";
        }   else if (answer.includes(letter)) {
            boxes[i].style.backgroundColor = "gold";
        }   else {
            boxes[i].style.backgroundColor = "lightgray";
        }
    }

    
    document.getElementById("text").value = "";

    if (guess == answer) {
        setTimeout(() => {
            alert("Congratulations! You guessed the correct Pokemon.");

            getPokemonData(guess).then(data => {
                if(data) {
                    const spriteUrl = data.sprites.front_default;
                    const spriteImg = document.createElement("img");
                    spriteImg.src = spriteUrl;
                    spriteImg.alt = data.name;
                    spriteImg.style.width = "100px";
                    const container = document.getElementById("poke-info");
                    container.innerHTML = "";
                    container.appendChild(spriteImg);


                    const cryUrl = data.cries?.latest;
                    if (cryUrl) {
                        const audio = new Audio(cryUrl);
                        audio.play();
                    } else {
                        console.log("no cries sadge");
                    }

                }
            })
        }, 10);
        
        return;
    }
    currentRow++;
});



window.addEventListener("DOMContentLoaded", getFiveLetterPokemon);

    