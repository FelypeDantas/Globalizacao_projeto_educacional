const quizData = [
    {
        question: "O que significa globalização?",
        options: ["Isolamento de países e culturas", "Integração econômica, cultural e tecnológica entre países", "Crescimento populacional rápido", "Redução do comércio internacional"],
        answer: 1
    },
    {
        question: "Qual é um efeito positivo da globalização?",
        options: ["Diminuição do acesso à informação", "Aumento da diversidade cultural e tecnológica", "Restrição das viagens internacionais", "Menor intercâmbio comercial"],
        answer: 1
    },
    {
        question: "Qual setor é mais diretamente impactado pela globalização?",
        options: ["Agricultura local apenas", "Comércio, tecnologia e cultura", "Apenas entretenimento", "Nenhum setor"],
        answer: 1
    },
    {
        question: "O que são empresas multinacionais?",
        options: ["Empresas que operam em mais de um país", "Empresas que vendem apenas localmente", "Organizações sem fins lucrativos", "Pequenas empresas familiares"],
        answer: 0
    },
    {
        question: "Como a globalização influencia o emprego?",
        options: ["Cria oportunidades de trabalho internacional", "Elimina totalmente empregos locais", "Não tem impacto", "Reduz apenas empregos tecnológicos"],
        answer: 0
    },
    {
        question: "Qual dessas tecnologias impulsionou a globalização?",
        options: ["Máquina a vapor", "Internet e telecomunicações", "Arado manual", "Lâmpada elétrica"],
        answer: 1
    },
    {
        question: "O conceito de “aldeia global” se refere a:",
        options: ["Urbanização de pequenas cidades", "A proximidade cultural e informacional entre países", "Aumento do isolamento cultural", "Crescimento de vilarejos"],
        answer: 1
    },
    {
        question: "O que é comércio internacional?",
        options: ["Troca de produtos e serviços entre países", "Venda apenas no mercado interno", "Comércio entre vizinhos de uma cidade", "Troca de moedas entre bancos"],
        answer: 0
    },
    {
        question: "Um desafio da globalização é:",
        options: ["Facilitar o aprendizado de idiomas", "Aumentar desigualdades econômicas e sociais", "Expandir o acesso à tecnologia", "Incentivar a cultura local"],
        answer: 1
    },
    {
        question: "Para estar preparado para o mundo globalizado, você deve:",
        options: ["Ignorar notícias internacionais", "Desenvolver habilidades interculturais e digitais", "Focar apenas em sua cidade", "Evitar aprender novos idiomas"],
        answer: 1
    }
];

let currentQuestion = 0;
let score = 0;

const quiz = document.getElementById('quiz');
const nextBtn = document.getElementById('next-btn');
const resultDiv = document.getElementById('result');

function loadQuestion() {
    const current = quizData[currentQuestion];
    quiz.innerHTML = `<h2>${current.question}</h2>` +
        current.options.map((option, index) => `<div class="option" onclick="selectOption(this, ${index})">${option}</div>`).join('');
}

function selectOption(element, index) {
    const correct = quizData[currentQuestion].answer;
    if(index === correct) {
        element.classList.add('correct');
        score++;
    } else {
        element.classList.add('wrong');
        document.querySelectorAll('.option')[correct].classList.add('correct');
    }
    Array.from(document.getElementsByClassName('option')).forEach(el => el.onclick = null);
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if(currentQuestion < quizData.length) {
        loadQuestion();
        resultDiv.innerHTML = '';
    } else {
        quiz.innerHTML = '';
        nextBtn.style.display = 'none';
        resultDiv.innerHTML = `<h2>Sua pontuação: ${score}/${quizData.length}</h2>` +
            `<p>${score <= 3 ? 'Precisa se atualizar sobre o mundo globalizado.' : score <=7 ? 'Você tem noções básicas, mas pode melhorar.' : 'Excelente! Você está preparado para os desafios globais.'}</p>`;
    }
});

// Carrega a primeira pergunta
loadQuestion();
