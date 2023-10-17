(function () {

    /*
    --------------------------------- VARIABLES ---------------------------------
     */
    const startButton = document.getElementById('startButton')
    const score = document.getElementById('score')
    const scoreNumber = document.getElementById('scoreNumber')
    const answer = document.getElementById('answer')
    const submitButton = document.getElementById('submitButton')
    const playField = document.getElementById('playField')
    const gameOverField = document.getElementById('gameOverField')
    const scoreNumberGameOver = document.getElementById('scoreNumberGameOver')
    const rightAnswer = document.getElementById('rightAnswer')
    const winField = document.getElementById('winField')
    let _score = 0
    let cantonLayers
    let currentCanton


    /*
    --------------------------------- MAP INITIATION ---------------------------------
     */

    let map = L.map('map').setView([46.8182, 8.2275], 8);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }).addTo(map);

    function style(feature) {
        return {
            fillColor: '#95b4da',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup(feature.properties.kan_name[0]);
    }


    fetch('cantons.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cantonLayers = L.geoJSON(data, {
                style: style,

            }).addTo(map);
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });

    /*
    --------------------------------- POLYGONS STYLES  ---------------------------------
     */
    const highlightedStyle = () => {
        return {
            fillColor: 'green',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    const guessedStyle = () => {
        return {
            fillColor: '#054da6',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    const wrongStyle = () => {
        return {
            fillColor: '#e30e2e',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    /*
    --------------------------------- GAME LOGIC ---------------------------------
     */

    const displayedCantons = []

    const cleanBeforeStart = () => {
        gameOverField.classList.add('hidden')
        winField.classList.add('hidden')
        displayedCantons.length = 0
        cantonLayers.eachLayer(function (layer) {
            layer.setStyle(style())
        })
        currentCanton = null
        answer.value = ''
        _score = 0
        scoreNumber.innerHTML = _score
        playField.classList.remove('hidden')
        setTimeout(() => {
            playField.classList.add('animate__pulse');

        }, 100);

    }


    const getRandomCantonIndex = () => {
        if (displayedCantons.length === 26) {
            return null
        } else {
            const randomIndex = Math.floor(Math.random() * 26);
            if (displayedCantons.includes(randomIndex)) {
                return getRandomCantonIndex();
            }
            return randomIndex;
        }

    }

    const highlightRandomCanton = () => {
        let cantonIndex = getRandomCantonIndex()
        displayedCantons.push(cantonIndex)
        const features = cantonLayers.getLayers();
        const randomFeature = features[cantonIndex];
        randomFeature.setStyle(highlightedStyle());
        currentCanton = randomFeature
        console.log(currentCanton.feature.properties.kan_name[0])

    }

    const winGame = () => {
        playField.classList.add('hidden')
        winField.classList.remove('hidden')
        setTimeout(() => {
            winField.classList.add('animate__backInUp');

        }, 10);
        const audio = new Audio('correct.wav')
        audio.play()
    }


    const gameOver = () => {
        let audio = new Audio('over.wav');
        audio.play();
        playField.classList.add('hidden')
        gameOverField.classList.remove('hidden')
        setTimeout(() => {
            gameOverField.classList.add('animate__backInUp');

        }, 10)
        scoreNumberGameOver.innerHTML = _score
        rightAnswer.innerHTML = currentCanton.feature.properties.kan_name[0]

    }

    const convertName = (answer) => {

        if (['st. gallen', 'sankt gallen', 'st gallen'].includes(answer)) {
            return 'sankt gallen'
        } else if (['basel stadt', 'basel-stadt'].includes(answer)) {
            return 'basel-stadt'
        } else if (['basel landschaft', 'basel-landschaft'].includes(answer)) {
            return 'basel-landschaft'
        } else if (['appenzell innerrhoden', 'appenzell-innerrhoden'].includes(answer)) {
            return 'appenzell innerrhoden'
        } else if (['appenzell ausserrhoden', 'appenzell-ausserrhoden'].includes(answer)) {
            return 'appenzell ausserrhoden'
        } else if (['fribourg', 'freiburg'].includes(answer)) {
            return 'fribourg'
        } else if (['genève', 'geneve'].includes(answer)) {
            return 'genève'
        } else if (['wallis', 'valais'].includes(answer)) {
            return 'valais'
        }
        else if (['neuchâtel', 'neuchatel'].includes(answer)) {
            return 'neuchâtel'
        } else {
            return answer
        }
    }

    const checkAnswer = (ev) => {
        ev.preventDefault()
        const answerValue = convertName(answer.value.toLowerCase())
        if (answerValue.toLowerCase() === currentCanton.feature.properties.kan_name[0].toLowerCase()) {
            let audio = new Audio('cor.wav');
            audio.play()
            _score++
            scoreNumber.innerHTML = _score
            currentCanton.setStyle(guessedStyle())
            answer.value = ''
            if (displayedCantons.length === 26) {
                winGame()
            } else {
                highlightRandomCanton()
            }
        } else {
            currentCanton.setStyle(wrongStyle())
            gameOver()
        }
    }


    const startGame = () => {
        cleanBeforeStart()
        highlightRandomCanton()

    }
    startButton.addEventListener('click', () => startGame())
    submitButton.addEventListener('click', (ev) => checkAnswer(ev))
})();
