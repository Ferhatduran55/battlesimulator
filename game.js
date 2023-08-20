$(document).ready(initGame);

function initGame() {
    const options = {
        attackersCount: 0,
        defendersCount: 0,
        gameEnded: true,
        updateInterval: 500,
        logLimit: 10,
    };

    const game = {
        data: {
            randomValue1: 0,
            randomValue2: 0,
            attackerStrength: 0,
            defenderStrength: 0,
            barWidth: 0,
            barWidthPlus: 0,
            barWidthMinus: 0,
            resultText: '',
        },
        tiers: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
        units: ['I', 'II', 'III'],
        terrains: ['plain', 'desert', 'mountain', 'hill', 'swamp', 'valley'],
        buildings: ['village', 'castle', 'town'],
        score: 0,
        attackerAction: null,
        defenderAction: null,
        winner: null,
        attackersLog: [],
        winnersLog: [],
        defendersLog: [],
        modifiers: {
            attackerTier: null,
            defenderTier: null,
            attackerUnit: null,
            defenderUnit: null,
            selectedTerrain: null,
            selectedBuilding: null,
        },
        options: options,
    };

    window.game = game;

    function updateGameInfo() {
        const { options, modifiers } = game;
        $(".attackerCount").text(`${options.attackersCount}(${modifiers.attackerUnit})`);
        $(".defenderCount").text(`(${modifiers.defenderUnit})${options.defendersCount}`);
        $(".terrain").text(modifiers.selectedTerrain);
        $(".build").text(modifiers.selectedBuilding);
        $("#attackerUnit").text(modifiers.attackerUnit);
        $("#attackerTier").text(modifiers.attackerTier);
        $("#defenderUnit").text(modifiers.defenderUnit);
        $("#defenderTier").text(modifiers.defenderTier);
        $(".score").text(game.score);
        updateResult();
    }

    function addToLog(logArray, options) {
        let {
            message = '',
            className = '',
            style = '',
            logLimit = game.options.logLimit
        } = options;

        let classAndStyle = `class='${className}' style='${style}'`;

        let logEntry = `<li ${classAndStyle}>${message}</li>`;

        logArray.push(logEntry);

        if (logArray.length > logLimit) {
            logArray.shift();
        }
    }

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    let updateGameInterval = null;
    function updateGame() {
        const { options, modifiers, data } = game;
        
        if (!options.gameEnded) {
            let attackerMultiplier = getUnitMultiplier(modifiers.attackerUnit);
            let defenderMultiplier = getUnitMultiplier(modifiers.defenderUnit);

            data.randomValue1 = Math.random();
            data.randomValue2 = Math.random();
            data.attackerStrength = calculateStrength(data.randomValue1, attackerMultiplier, options.attackersCount);
            data.defenderStrength = calculateStrength(data.randomValue2, defenderMultiplier, options.defendersCount);
            data.barWidth = $("#bar").width();
            data.barWidthPlus = data.barWidth + 2.5;
            data.barWidthMinus = data.barWidth - 2.5;
            data.resultText = $(".result").text();

            if (game.attackerAction !== null) {
                data.attackerStrength += game.attackerAction;
                addToLog(game.attackersLog, {
                    message: `${data.attackerStrength.toFixed(4)}`,
                    className: 'attackersLog',
                    style: 'color: var(--bs-attacker-color-dark);'
                });
                game.attackerAction = null;
            } else {
                addToLog(game.attackersLog, {
                    message: `${data.attackerStrength.toFixed(4)}`,
                    className: 'attackersLog',
                    style: 'color: var(--bs-attacker-color);'
                });
            }

            if (game.defenderAction !== null) {
                data.defenderStrength += game.defenderAction;
                addToLog(game.defendersLog, {
                    message: `${data.defenderStrength.toFixed(4)}`,
                    className: 'defendersLog',
                    style: 'color: var(--bs-defender-color-dark);'
                });
                game.defenderAction = null;
            } else {
                addToLog(game.defendersLog, {
                    message: `${data.defenderStrength.toFixed(4)}`,
                    className: 'defendersLog',
                    style: 'color: var(--bs-defender-color);'
                });
            }

            if (data.attackerStrength > data.defenderStrength && !options.gameEnded) {
                if (data.barWidth <= 497.5 && data.barWidth >= 2.5) {
                    $("#bar").css({ "width": data.barWidthPlus });
                    game.score -= 1;
                    $(".score").text(game.score);
                    updateResult();
                    addToLog(game.winnersLog, {
                        message: `<span class="attackers"></span>`,
                        className: 'winnersLog',
                    });
                } else if (data.barWidth >= 500 && !options.gameEnded) {
                    if (data.resultText !== "Attackers Won!") {
                        $(".result").text("Attackers Won!");
                        $("title").text("Attackers Won!");
                        $(".defenderCount").css({ "text-decoration": "line-through red 5px" });
                        $(".build").css({ "color": "rgb(255,0,0)" });
                        $(".result").css({ "color": "red", "text-shadow": "0 0 20px black" });
                    }
                    data.barWidth = null;
                    options.gameEnded = true;
                    determineWinner();
                }
            } else if (data.defenderStrength > data.attackerStrength && !options.gameEnded) {
                if (data.barWidth >= 2.5 && data.barWidth <= 497.5) {
                    $("#bar").css({ "width": data.barWidthMinus });
                    game.score += 1;
                    $(".score").text(game.score);
                    updateResult();
                    addToLog(game.winnersLog, {
                        message: `<span class="defenders"></span>`,
                        className: 'winnersLog',
                    });
                } else if (data.barWidth <= 0 && !options.gameEnded) {
                    if (data.resultText !== "Defenders Won!") {
                        $(".result").text("Defenders Won!");
                        $("title").text("Defenders Won!");
                        $(".attackerCount").css({ "text-decoration": "line-through blue 5px" });
                        $(".result").css({ "color": "blue", "text-shadow": "0 0 20px black" });
                    }
                    data.barWidth = null;
                    options.gameEnded = true;
                    determineWinner();
                }
            }

            $(".log .attackerLogs").html(game.attackersLog.join(''));
            $(".log .roundWinner").html(game.winnersLog.join(''));
            $(".log .defenderLogs").html(game.defendersLog.join(''));
        }
    }

    function getUnitMultiplier(unitType) {
        switch (unitType) {
            case "I":
                return 1.2;
            case "II":
                return 1.6;
            case "III":
                return 2.0;
            default:
                return 1;
        }
    }

    function calculateStrength(randomValue, unitMultiplier, unitCount) {
        return ((randomValue * 5) * unitMultiplier) * (unitCount / (Math.random() * 100));
    }

    function determineWinner() {
        const { options, data } = game;

        if (!options.gameEnded) {
            if (data.resultText === "Attackers Won!") {
                game.winner = "Attackers";
            } else if (data.resultText === "Defenders Won!") {
                game.winner = "Defenders";
            }
        }
    }

    function updateResult() {
        const { options, data, winner, score } = game;

        if (winner === null && !options.gameEnded) {
            if (score > 0 && score <= 99) {
                if (data.resultText !== "Attackers Won!" && data.resultText !== "Attackers Losing!") {
                    $(".result").text("Attackers Losing!");
                    $("title").text("Attackers Losing!");
                }
            } else if (score < 0 && score >= -99) {
                if (data.resultText !== "Defenders Won!" && data.resultText !== "Defenders Losing!") {
                    $(".result").text("Defenders Losing!");
                    $("title").text("Defenders Losing!");
                }
            } else if (score === 0) {
                $(".result").text("Draw");
                $("title").text("Draw");
            }
        }
    }

    function performAction(actionType, actionValue) {
        const { options, modifiers, data } = game;

        if (!options.gameEnded && actionType === "Attack" && game.attackerAction === null) {
            let attackerMultiplier = getUnitMultiplier(modifiers.attackerUnit);
            let beforeAttack = data.attackerStrength;
            game.attackerAction = calculateStrength(Math.random(), attackerMultiplier, options.attackersCount);
            data.attackerStrength += game.attackerAction;
        }

        if (!options.gameEnded && actionType === "Defend" && game.defenderAction === null) {
            let defenderMultiplier = getUnitMultiplier(modifiers.defenderUnit);
            let beforeDefend = data.defenderStrength;
            game.defenderAction = calculateStrength(Math.random(), defenderMultiplier, options.defendersCount);
            data.defenderStrength += game.defenderAction;
        }
    }

    $(document).on('keyup', function (event) {
        if (event.keyCode === 65 || event.keyCode === 37) {
            performAction("Attack");
        }
        if (event.keyCode === 68 || event.keyCode === 39) {
            performAction("Defend");
        }
    });

    $(".attacker, .defender").on("click", function () {
        let actionType = $(this).hasClass("attacker") ? "Attack" : "Defend";
        performAction(actionType);
    });

    $(".startButton").on("click", function () {
        if (!game.options.gameEnded) return;
        startGame();
    });

    $(".restartButton").on("click", function () {
        restartGame();
    });

    function startGame() {
        const {options, modifiers } = game;
        options.attackersCount = Math.floor(Math.random() * 100);
        options.defendersCount = Math.floor(Math.random() * 100);
        options.gameEnded = false;
    
        game.attackerAction = null;
        game.defenderAction = null;
        game.winner = null;

        modifiers.attackerTier = getRandomElement(game.tiers);
        modifiers.defenderTier = getRandomElement(game.tiers);
        modifiers.attackerUnit = getRandomElement(game.units);
        modifiers.defenderUnit = getRandomElement(game.units);
        modifiers.selectedTerrain = getRandomElement(game.terrains);
        modifiers.selectedBuilding = getRandomElement(game.buildings);
        
        game.score = 0;

        updateGameInfo();

        game.attackersLog = [];
        game.winnersLog = [];
        game.defendersLog = [];

        $("#bar").css({ "width": "250px" });

        $(".result").text("");
        $("title").text("BattleSimulator");

        clearInterval(updateGameInterval);
        updateGameInterval = setInterval(updateGame, options.updateInterval);
    }

    function restartGame() {
        startGame();

        $(".log .attackerLogs, .log .roundWinner, .log .defenderLogs").html("");

        updateResult();
    }
}

var notifyText = `Notes:<br>
-x random number<br>
-y unit bonus<br>
-z number of sides<br>
<br>Score Formula:<br>
( ( x * 5 ) * y ) * ( z / ( x * 100 ) )<br>
<br>Unit Bonuses:<br>
I. x1.2<br>
II. x1.6<br>
III. x2.0<br>
<br>Shortcuts:<br>
A&Left arrow key - Attackers<br>
D&Right arrow key - Defenders`;
$(".notify").append(notifyText);
var modal = $(".modal");
var btn = $(".notifyButton");
var span = $(".close");
btn.on("click", function () {
    modal.css({ "display": "block" });
    btn.toggleClass("toggle");
});
span.on("click", function () {
    modal.css({ "display": "none" });
    btn.toggleClass("toggle");
});
modal.on("click", function (event) {
    if (event.target == modal) {
        modal.css({ "display": "none" });
    }
});
