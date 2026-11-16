// 每個單元使用同一套程式，題目從各頁的 quiz-data 讀取。
const quizArea = document.getElementById("quiz");
const quizData = document.getElementById("quiz-data");

if (quizArea && quizData) {
  const questions = JSON.parse(quizData.textContent);

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function showQuestion() {
    answered = false;
    quizArea.replaceChildren();

    const current = questions[currentIndex];

    const progress = document.createElement("p");
    progress.className = "meta";
    progress.textContent =
      `第 ${currentIndex + 1} / ${questions.length} 題`;

    const title = document.createElement("h3");
    title.textContent = current.question;
    title.tabIndex = -1;

    const optionsArea = document.createElement("div");
    optionsArea.className = "quiz-options";

    const feedback = document.createElement("p");
    feedback.className = "feedback";
    feedback.setAttribute("role", "status");

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "button";
    nextButton.textContent =
      currentIndex === questions.length - 1 ? "查看成績" : "下一題";
    nextButton.hidden = true;

    current.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.textContent =
        `${String.fromCharCode(65 + optionIndex)}. ${option}`;

      button.addEventListener("click", () => {
        // 防止同一題重複計分。
        if (answered) return;
        answered = true;

        const isCorrect = optionIndex === current.answerIndex;

        if (isCorrect) {
          score += 1;
        }

        const optionButtons =
          optionsArea.querySelectorAll("button");

        optionButtons.forEach((item, index) => {
          item.disabled = true;

          if (index === current.answerIndex) {
            item.classList.add("correct");
          }
        });

        if (!isCorrect) {
          button.classList.add("incorrect");
        }

        feedback.textContent =
          `${isCorrect ? "答對了！" : "答錯了。"} ` +
          `正確答案：${current.options[current.answerIndex]}。` +
          ` ${current.explanation}`;

        nextButton.hidden = false;
        nextButton.focus();
      });

      optionsArea.append(button);
    });

    nextButton.addEventListener("click", () => {
      currentIndex += 1;

      if (currentIndex < questions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });

    quizArea.append(
      progress,
      title,
      optionsArea,
      feedback,
      nextButton
    );

    // 第一題不自動捲動，讓使用者先閱讀單字和例句。
    if (currentIndex > 0) {
      title.focus();
    }
  }

  function showResult() {
    quizArea.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = `完成！你的分數是 ${score}/${questions.length}`;
    title.tabIndex = -1;

    const message = document.createElement("p");
    message.textContent =
      score === questions.length
        ? "全部答對！也可以試著把例句唸出來。"
        : "可以回頭複習單字和例句，再挑戰一次。";

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "button";
    restartButton.textContent = "重新練習";

    restartButton.addEventListener("click", () => {
      currentIndex = 0;
      score = 0;
      showQuestion();
      quizArea.querySelector("h3").focus();
    });

    quizArea.append(title, message, restartButton);
    title.focus();
  }

  showQuestion();
}