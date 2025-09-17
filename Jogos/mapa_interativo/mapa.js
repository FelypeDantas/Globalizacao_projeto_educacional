const levels = [
  { connections: { "China": "Smartphones", "EUA": "Redes Sociais", "Brasil": "Soja" } },
  { connections: { "China": "Smartphones", "EUA": "Redes Sociais", "Brasil": "Soja", "Japão": "Videogames", "Alemanha": "Carros" } },
  { connections: { "China": "Smartphones", "EUA": "Redes Sociais", "Brasil": "Soja", "Japão": "Videogames", "Alemanha": "Carros", "Índia": "Serviços de TI", "França": "Perfumes" } },
  { connections: { "China": "Smartphones", "EUA": "Redes Sociais", "Brasil": "Soja", "Japão": "Videogames", "Alemanha": "Carros", "Índia": "Serviços de TI", "França": "Perfumes", "Reino Unido": "Bancos", "Austrália": "Minério de Ferro" } },
  { connections: { "China": "Smartphones", "EUA": "Redes Sociais", "Brasil": "Soja", "Japão": "Videogames", "Alemanha": "Carros", "Índia": "Serviços de TI", "França": "Perfumes", "Reino Unido": "Bancos", "Austrália": "Minério de Ferro", "México": "Petróleo", "Rússia": "Gás Natural" } }
];

let currentLevel = 0;
let selectedCountry = null;
let score = 0;
let errors = 0;
let correctConnectionsMade = 0;
let timeLeft = 60;
let timer;

const canvas = document.getElementById("lines");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const levelDisplay = document.getElementById("level");
const errorsDisplay = document.getElementById("errors");

let correctPairs = []; // array de objetos {countryElement, productElement} para redesenhar linhas verdes

// Redimensiona o canvas
function resizeCanvas() {
  const game = document.getElementById("game");
  canvas.width = game.offsetWidth;
  canvas.height = game.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);

// posição central do elemento
function getCenterPosition(element) {
  const rect = element.getBoundingClientRect();
  const parentRect = document.getElementById("game").getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - parentRect.left,
    y: rect.top + rect.height / 2 - parentRect.top
  };
}

// embaralhar array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// embaralhar filhos do container
function shuffleItems(containerId) {
  const container = document.getElementById(containerId);
  const items = Array.from(container.children);
  const shuffled = shuffle(items);
  container.innerHTML = "";
  shuffled.forEach(item => container.appendChild(item));
}

// Carrega nível
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  const countriesContainer = document.getElementById("countries");
  const productsContainer = document.getElementById("products");

  countriesContainer.innerHTML = "";
  productsContainer.innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  correctPairs = []; // limpa linhas verdes

  Object.keys(level.connections).forEach(country => {
    const countryDiv = document.createElement("div");
    countryDiv.className = "item";
    countryDiv.dataset.country = country;
    countryDiv.textContent = country;
    countriesContainer.appendChild(countryDiv);

    const productDiv = document.createElement("div");
    productDiv.className = "item";
    productDiv.dataset.product = level.connections[country];
    productDiv.textContent = level.connections[country];
    productsContainer.appendChild(productDiv);
  });

  shuffleItems("countries");
  shuffleItems("products");
  resizeCanvas();

  document.querySelectorAll("#countries .item").forEach(country => {
    country.addEventListener("click", () => {
      selectedCountry = country;
    });
  });

  document.querySelectorAll("#products .item").forEach(product => {
    product.addEventListener("click", () => {
      if (!selectedCountry) return;

      const countryName = selectedCountry.dataset.country;
      const productName = product.dataset.product;
      const correctConnections = levels[currentLevel].connections;

      const countryPos = getCenterPosition(selectedCountry);
      const productPos = getCenterPosition(product);

      if (correctConnections[countryName] === productName) {
        // linha verde permanente
        ctx.beginPath();
        ctx.moveTo(countryPos.x, countryPos.y);
        ctx.lineTo(productPos.x, productPos.y);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 3;
        ctx.stroke();

        // marca o par correto para redesenhar
        correctPairs.push({ countryElement: selectedCountry, productElement: product });

        score++;
        correctConnectionsMade++;
        scoreDisplay.textContent = "Pontuação: " + score;

        if (correctConnectionsMade === Object.keys(correctConnections).length) {
          setTimeout(() => {
            if (currentLevel < levels.length - 1) {
              alert("🎉 Nível concluído! Avançando...");
              currentLevel++;
              startLevel();
            } else {
              alert("🏆 Parabéns! Você completou todos os níveis!");
            }
          }, 300);
        }

      } else {
        // linha vermelha temporária
        ctx.beginPath();
        ctx.moveTo(countryPos.x, countryPos.y);
        ctx.lineTo(productPos.x, productPos.y);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();

        errors++;
        errorsDisplay.textContent = "Erros: " + errors;

        // apagar linha vermelha após 3 segundos e redesenhar verdes
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          correctPairs.forEach(pair => {
            const cPos = getCenterPosition(pair.countryElement);
            const pPos = getCenterPosition(pair.productElement);
            ctx.beginPath();
            ctx.moveTo(cPos.x, cPos.y);
            ctx.lineTo(pPos.x, pPos.y);
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        }, 3000);

        if (errors >= 4) {
          alert("❌ Muitos erros! O jogo será reiniciado.");
          resetGame();
        }
      }

      selectedCountry = null;
    });
  });

  levelDisplay.textContent = "Nível: " + (levelIndex + 1);
}

// Timer do nível
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Tempo: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏰ Tempo esgotado! O jogo será reiniciado.");
      resetGame();
    }
  }, 1000);
}

// Inicia o nível
function startLevel() {
  correctConnectionsMade = 0;
  errors = 0;
  errorsDisplay.textContent = "Erros: 0";
  timeLeft = 60;
  timerDisplay.textContent = "Tempo: 60";
  selectedCountry = null;
  loadLevel(currentLevel);
  startTimer();
}

// Reset completo do jogo
function resetGame() {
  currentLevel = 0;
  score = 0;
  scoreDisplay.textContent = "Pontuação: 0";
  startLevel();
}

document.getElementById("reset").addEventListener("click", resetGame);

// Iniciar jogo
startLevel();
