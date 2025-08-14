document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    startQuiz(content);
  };
  reader.readAsText(file);
});

function startQuiz(content) {
  const quizDiv = document.getElementById('quiz');
  const resultDiv = document.getElementById('result');
  quizDiv.innerHTML = '';
  resultDiv.innerHTML = '';

  const lines = content.split(/\r?\n/);
  const questions = [];
  let current = null;

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('////')) {
      current = { question: line.slice(4).trim(), options: [], correct: '' };
      questions.push(current);
    } else if (line.startsWith('///')) {
      current.options.push(line.slice(3).trim());
    } else if (line.startsWith('//')) {
      current.correct = line.slice(2).trim();
    }
  });

  questions.forEach((q, index) => {
    const qDiv = document.createElement('div');
    const qTitle = document.createElement('h3');
    qTitle.textContent = `${index + 1}. ${q.question}`;
    qDiv.appendChild(qTitle);

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => {
        if (opt === q.correct) {
          btn.style.backgroundColor = '#2e7d32';
          btn.style.color = 'white';
        } else {
          btn.style.backgroundColor = '#c62828';
          btn.style.color = 'white';
        }
        Array.from(qDiv.querySelectorAll('button')).forEach(b => b.disabled = true);
        updateResult(questions);
      };
      qDiv.appendChild(btn);
    });

    quizDiv.appendChild(qDiv);
  });
}

function updateResult(questions) {
  let correctCount = 0;
  questions.forEach(q => {
    const buttons = Array.from(document.querySelectorAll('div h3 + button, div h3 + button + button'));
    buttons.forEach(btn => {
      if (btn.textContent === q.correct && btn.disabled) correctCount++;
    });
  });
  document.getElementById('result').textContent = `Correct answers: ${correctCount} / ${questions.length}`;
}
