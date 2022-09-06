class Game {
    constructor() {
        this.answer = null;
        this.hint = "";
        this.displayedWord = [];
        this.guessedLetters = [];
        this.invalidGuesses = 6;
        this.gameOver = false;
        this.winLose = 0;
        this.firstLoop = true;
        this.rl = false;
        this.readline = false;
    }

    init() {
        this.readline = require('readline');
        this.gameLoop();
    }
    async gameLoop() {

        if (this.firstLoop) {
            this.firstLoop = false;
            this.rl = this.readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            await this.getWord();
            await this.getHint();
        }

        if (!this.gameOver) {
            await this.getInput();
            await this.gameLoop();
        } else {
            this.endGameMessage();
            this.rl.close();
        }
        return;
    }

    async getWord() {
        console.log("Please choose a word: ")

        const answer = await new Promise(resolve => {
            this.rl.question("Word: ", resolve)
        });

        if (!this.isValidWord(answer)) {
            await this.getWord()
            return;
        } else {
            this.answer = answer.toLowerCase()
            this.displayedWord = this.answer.split("").map(x => "_");
        }
    }
    async getHint() {

        const hint = await new Promise(resolve => {
            this.rl.question("Want to provide a hint? ", resolve)
        });

        this.hint = hint;

    }

    isValidWord(word) {
        if (!word) {
            console.log("Please provide a valid word.")
            return false
        } else if (word.match(/\d/g)) {
            console.log("Can't contain a digit")
            return false
        } else if (word.match(/\s/g)) {
            console.log("Can't contain a white space")
            return false
        } else if (word.match(/[^\w]/g)) {
            console.log("Can't contain none word characters")
            return false
        } else {
            return true
        }

    }


    async getInput() {
        console.log("Hint is: " + this.hint)
        const letter = await new Promise(resolve => {
            this.rl.question("Guess a letter: ", resolve)
        });


        if (!this.isValidLetter(letter)) {
            await this.getInput()
            return;
        } else {
            if (this.answer.split("").indexOf(letter) > -1) {

                if (this.guessedLetters.indexOf(letter) > -1) {

                    console.log("Letter already guessed!")
                    this.printHangman()
                    this.invalidGuesses -= 1

                } else {
                    console.log("Found Letter!")
                    const answerArray = this.answer.split("");
                    for (let i = 0; i < answerArray.length; i++) {
                        let l = answerArray[i]
                        if (l == letter) {
                            this.displayedWord[i] = letter
                        }
                    }
                }
            } else {
                console.log("Letter Not Found")
                this.printHangman()
                this.invalidGuesses -= 1

            }
        }
        this.guessedLetters.push(letter)
        console.log(this.displayedWord)
        if (this.invalidGuesses == 0) {
            this.gameOver = true
            this.winLose = 2
            return
        } else {
            this.checkWin()
        }


    }

    isValidLetter(letter) {
        if (!letter) {
            console.log("Please provide a letter")
            return false
        } else if (letter.length > 1) {
            console.log("Can't contain more than one letter")
            return false
        } else {
            return true
        }
    }

    checkWin() {
        const answerLength = this.answer.length
        let checking = 0
        for (let i = 0; i < answerLength; i++) {
            if (this.displayedWord[i] == this.answer[i]) {
                checking += 1
            }
        }
        if (checking == answerLength) {
            this.gameOver = true
            this.winLose = 1
        }

    }
    printHangman() {
        const h = [
            [
                [" ----"],
                ["|    |"],
                ["|    O"],
                ["|   "],
                ["|   "],
                ["|_  "],
            ],
            [
                [" ----"],
                ["|    |"],
                ["|    O"],
                ["|    |"],
                ["|   "],
                ["|_   "],
            ],
            [
                [" ----"],
                ["|    |"],
                ["|    O"],
                ["|    |"],
                ["|   "],
                ["|_  "],
            ],
            [
                [" ----"],
                ["|    |"],
                ["|    O"],
                ["|   /|\\"],
                ["|   "],
                ["|_  "],
            ],
            [
                [" ----"],
                ["|     |"],
                ["|     O"],
                ["|    /|\\"],
                ["|    /"],
                ["|_   "],
            ],
            [
                [" ----"],
                ["|     |"],
                ["|     O"],
                ["|    /|\\"],
                ["|    / \\"],
                ["|_   "],
            ],
        ]

        let index = h.length - this.invalidGuesses
        let str1 = ""
        for (let a of h[index]) {
            for (let b of a) {
                str1 += b + "\n"
            }
        }
        console.log(str1)
    }

    endGameMessage() {
        if (this.winLose == 2) {

            console.log(`You lost... word was ${this.answer}`)
        } else {
            console.log(`You WON!!! word was ${this.answer}`)
        }
    }


}


function _Main() {
    const game = new Game()
    game.init()
}

_Main();
