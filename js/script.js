// quick check
console.log("JavaScript connected successfully!");

// run after DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // small header click demo — safe-guarded
  const headerTitle = document.querySelector("header h1");
  if (headerTitle) {
    headerTitle.addEventListener("click", () => {
      // gentle, non-annoying feedback for dev/testing
      console.log(`Header clicked: ${headerTitle.textContent}`);
    });
  }

  // ---- Active nav-link highlighting (works with nested folders) ----
  const currentPath = decodeURI(window.location.pathname).replace(/\/+$/, ""); // remove trailing slash
  document.querySelectorAll("a.nav-link, .sidebar a").forEach(a => {
    const rawHref = a.getAttribute("href") || "";
    // Resolve relative href against current location to get a pathname we can compare
    let resolvedPath;
    try {
      resolvedPath = new URL(rawHref, window.location.href).pathname.replace(/\/+$/, "");
    } catch (e) {
      resolvedPath = rawHref.replace(/\/+$/, "");
    }

    // Mark active if the anchor path matches, or if current path endsWith anchor path,
    // or if anchor path endsWith current path (covers index, folder-page combos).
    if (
      resolvedPath === currentPath ||
      currentPath.endsWith(resolvedPath) ||
      resolvedPath.endsWith(currentPath)
    ) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });

  // ---- Exercise check buttons (keeps your original logic, with safe guards) ----
  document.querySelectorAll(".btn-check").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest("section");
      if (!section) return;
      const inputs = section.querySelectorAll("input[data-answer]");
      let total = 0, correct = 0, wrongList = [];

      inputs.forEach(inp => {
        total++;
        const expected = (inp.getAttribute("data-answer") || "").trim().toLowerCase();
        const actual = (inp.value || "").trim().toLowerCase();
        if (actual === expected) {
          inp.style.borderColor = "rgba(45,154,106,0.9)"; // success
          correct++;
        } else {
          inp.style.borderColor = "rgba(217,83,79,0.95)"; // danger
          wrongList.push({ expected, actual, input: inp });
        }
      });

      const resultEl = section.querySelector(".exercise-result");
      if (!resultEl) return;

      if (correct === total) {
        resultEl.textContent = `Good. ${correct}/${total} correct.`;
        resultEl.classList.remove("bad");
        resultEl.classList.add("ok");
      } else {
        resultEl.textContent = `${correct}/${total} correct. Incorrect: ${wrongList.map(w => `"${w.actual || '[empty]'}" → expected "${w.expected}"`).join("; ")}`;
        resultEl.classList.remove("ok");
        resultEl.classList.add("bad");
      }
    });
  });

  // Enter key in exercise inputs triggers the check button
  document.querySelectorAll("input[data-answer]").forEach(inp => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const section = inp.closest("section");
        const btn = section ? section.querySelector(".btn-check") : null;
        if (btn) btn.click();
      }
    });
  });
}); // end DOMContentLoaded

// ---- Sidebar toggling (works with .sidebar.open and .overlay.show) ----
(() => {
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.querySelector('.close-btn');
  const overlay = document.getElementById('overlay');

  // helper functions — safe (no error if element missing)
  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
  };
  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  };
  const toggleSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  };

  if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close sidebar automatically when user clicks any link inside it (good UX for nested pages)
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        // Allow the link to navigate, but also close the sidebar for a smooth experience
        closeSidebar();
      }
    });
  }
})();


// ---- Optional: Add simple keyboard shortcut to close sidebar with Escape ----
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-quiz-button");
  const quizContent = document.getElementById("quiz-content");

  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";  // Hide the start button
    quizContent.style.display = "block"; // Show the quiz content
    showQuestion(currentQuestion);
  });

  // ===== Quiz data: 5 questions per past tense =====
  const quizQuestions = [
    // Past Simple
    { question: "I ____ to the store yesterday. (go)", options: ["go","went","gone","going"], answer: "went" },
    { question: "She ____ a movie last night. (watch)", options: ["watched","watch","watches","watching"], answer: "watched" },
    { question: "They ____ all the cookies! (eat)", options: ["ate","eat","eaten","eating"], answer: "ate" },
    { question: "He ____ a letter to his friend. (write)", options: ["wrote","write","written","writing"], answer: "wrote" },
    { question: "We ____ before they arrived. (finish)", options: ["finished","finish","had finished","finishing"], answer: "finished" },

    // Past Continuous
    { question: "I ____ when you called. (cook)", options: ["cooked","was cooking","cook","cooking"], answer: "was cooking" },
    { question: "They ____ in the park at 5 PM. (run)", options: ["run","were running","running","ran"], answer: "were running" },
    { question: "She ____ TV while I cleaned. (watch)", options: ["was watching","watched","watch","watching"], answer: "was watching" },
    { question: "He ____ when it started raining. (sleep)", options: ["was sleeping","slept","sleep","sleeping"], answer: "was sleeping" },
    { question: "We ____ our homework when the power went out. (do)", options: ["did","doing","was doing","do"], answer: "was doing" },

    // Past Perfect
    { question: "I ____ my homework before dinner. (finish)", options: ["finished","had finished","finish","finishing"], answer: "had finished" },
    { question: "She ____ the letter before he arrived. (send)", options: ["sent","had sent","send","sending"], answer: "had sent" },
    { question: "They ____ by the time we got there. (leave)", options: ["left","had left","leave","leaving"], answer: "had left" },
    { question: "He ____ the car before the rain started. (wash)", options: ["washed","had washed","wash","washing"], answer: "had washed" },
    { question: "We ____ the tickets before the show began. (buy)", options: ["bought","had bought","buy","buying"], answer: "had bought" },

    // Past Perfect Continuous
    { question: "I ____ for two hours when she called. (study)", options: ["had been studying","studied","studying","study"], answer: "had been studying" },
    { question: "They ____ all morning when it started raining. (play)", options: ["had been playing","played","playing","play"], answer: "had been playing" },
    { question: "She ____ for weeks before the exam. (prepare)", options: ["had been preparing","prepared","preparing","prepare"], answer: "had been preparing" },
    { question: "He ____ the piano for an hour when I arrived. (practice)", options: ["had been practicing","practiced","practicing","practice"], answer: "had been practicing" },
    { question: "We ____ for days before the event. (plan)", options: ["had been planning","planned","planning","plan"], answer: "had been planning" }
  ];

  // ===== Funny comments =====
  const correctComments = [
    "Your brain just did a flex! 💪",
    "✅ Correct — that's a clean strike!",
    "Legendary! 🎖️",
    "Solid. Grammar gains unlocked.",
    "You crushed it! 🍳"
  ];
  const wrongComments = [
    "Oops — try again! 🤏",
    "Close! The tense played hide-and-seek. 😅",
    "Nope — grammar slipped on a banana peel. 🍌",
    "Wrong — but you’re learning!",
    "Missed it! Sharpen and strike back. ⚔️"
  ];

  let currentQuestion = 0;
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("next-question");
  const quizResultEl = document.getElementById("quiz-result");

  // ===== Show question function =====
  function showQuestion(index) {
    quizResultEl.textContent = "";
    quizResultEl.classList.remove("correct","wrong");

    const q = quizQuestions[index];
    quizQuestionEl.textContent = q.question;

    quizOptionsEl.innerHTML = "";
    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "quiz-option";

      btn.addEventListener("click", () => {
        // Disable all options
        quizOptionsEl.querySelectorAll("button").forEach(b => b.disabled = true);

        // Show result with funny comment
        if(option === q.answer) {
          const comment = correctComments[Math.floor(Math.random()*correctComments.length)];
          quizResultEl.textContent = `✅ Correct! "${option}" — ${comment}`;
          quizResultEl.classList.add("correct");
          quizResultEl.style.color = "var(--positive)";
        } else {
          const comment = wrongComments[Math.floor(Math.random()*wrongComments.length)];
          quizResultEl.textContent = `❌ Wrong! Correct: "${q.answer}" — ${comment}`;
          quizResultEl.classList.add("wrong");
          quizResultEl.style.color = "var(--negative)";
        }

        nextBtn.style.display = "inline-block";
      });

      quizOptionsEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
  }

  // ===== Next question =====
  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if(currentQuestion < quizQuestions.length) {
      showQuestion(currentQuestion);
    } else {
      quizQuestionEl.textContent = "🎉 Quiz Completed!";
      quizOptionsEl.innerHTML = "";
      nextBtn.style.display = "none";
      quizResultEl.textContent = "";
    }
  });

});


document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-quiz-button");
  const quizContent = document.getElementById("quiz-content");

  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    quizContent.style.display = "block";
    showQuestion(currentQuestion);
  });

  // ===== Future Tense Quiz Data (5 questions per tense) =====
  const quizQuestions = [
    // Future Simple
    { question: "I ____ dinner with my family tomorrow evening.", options: ["will eat", "am eat", "eat", "eating"], answer: "will eat" },
    { question: "She ____ the report by Friday.", options: ["will finish", "will finishes", "is finishing", "finishes"], answer: "will finish" },
    { question: "They ____ to the park after school.", options: ["will go", "go", "going", "will goes"], answer: "will go" },
    { question: "He ____ me with my homework later.", options: ["will help", "helps", "helping", "will helps"], answer: "will help" },
    { question: "We ____ the movie at 8 PM tonight.", options: ["will watch", "watch", "are watching", "watches"], answer: "will watch" },

    // Future Continuous
    { question: "At 10 AM tomorrow, I ____ on a Zoom call.", options: ["will be working", "work", "will works", "am working"], answer: "will be working" },
    { question: "She ____ to the radio while cooking dinner tomorrow.", options: ["will be listening", "listens", "is listening", "will listen"], answer: "will be listening" },
    { question: "They ____ on the project all day tomorrow.", options: ["will be working", "work", "are working", "will works"], answer: "will be working" },
    { question: "He ____ football at 6 PM tomorrow.", options: ["will be playing", "plays", "is playing", "will play"], answer: "will be playing" },
    { question: "We ____ at the bus stop at 7 AM tomorrow.", options: ["will be waiting", "wait", "are waiting", "will wait"], answer: "will be waiting" },

    // Future Perfect
    { question: "By next Monday, I ____ the assignment.", options: ["will have completed", "will complete", "complete", "have completed"], answer: "will have completed" },
    { question: "She ____ the book before the end of the week.", options: ["will have read", "will read", "reads", "is reading"], answer: "will have read" },
    { question: "They ____ the tickets by the time we arrive.", options: ["will have bought", "buy", "will buy", "have bought"], answer: "will have bought" },
    { question: "He ____ the project report by 5 PM tomorrow.", options: ["will have finished", "finishes", "will finish", "is finishing"], answer: "will have finished" },
    { question: "We ____ the room cleaned before the guests come.", options: ["will have gotten", "get", "will get", "have gotten"], answer: "will have gotten" },

    // Future Perfect Continuous
    { question: "By 8 PM tomorrow, I ____ for 3 hours.", options: ["will have been studying", "study", "will study", "am studying"], answer: "will have been studying" },
    { question: "She ____ for a week by Monday.", options: ["will have been traveling", "travels", "is traveling", "will travel"], answer: "will have been traveling" },
    { question: "They ____ on the project for months by the end of May.", options: ["will have been working", "work", "will work", "are working"], answer: "will have been working" },
    { question: "He ____ football for 2 hours by 5 PM tomorrow.", options: ["will have been playing", "plays", "is playing", "will play"], answer: "will have been playing" },
    { question: "We ____ the event planning for days by tomorrow.", options: ["will have been planning", "plan", "are planning", "will plan"], answer: "will have been planning" }
  ];

  // ===== Funny comments =====
  const correctComments = ["✅ Correct! Nice one 😎","Perfect! 🎯","Boom! 💥 Correct!","Nice, grammar ninja! 🥷","You got it! 🌟"];
  const wrongComments = ["❌ Oops, try again 😅","Nope! Keep going 🤓","Wrong! But don’t worry 😜","Missed it! Try next ⚡","Not quite! 💡"];

  let currentQuestion = 0;
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("next-question");
  const quizResultEl = document.getElementById("quiz-result");

  // === Shuffle function ===
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function showQuestion(index) {
    quizResultEl.textContent = "";
    quizResultEl.classList.remove("correct","wrong");

    const q = quizQuestions[index];
    quizQuestionEl.textContent = q.question;

    quizOptionsEl.innerHTML = "";

    const shuffledOptions = shuffleArray([...q.options]);

    shuffledOptions.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "quiz-option";

      btn.addEventListener("click", () => {
        quizOptionsEl.querySelectorAll("button").forEach(b => b.disabled = true);

        if(option === q.answer) {
          const comment = correctComments[Math.floor(Math.random()*correctComments.length)];
          quizResultEl.textContent = `${comment} ("${option}")`;
          quizResultEl.classList.add("correct");
        } else {
          const comment = wrongComments[Math.floor(Math.random()*wrongComments.length)];
          quizResultEl.textContent = `${comment} Correct: "${q.answer}"`;
          quizResultEl.classList.add("wrong");
        }

        nextBtn.style.display = "inline-block";
      });

      quizOptionsEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
  }

  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if(currentQuestion < quizQuestions.length) {
      showQuestion(currentQuestion);
    } else {
      quizQuestionEl.textContent = "🎉 Quiz Completed!";
      quizOptionsEl.innerHTML = "";
      nextBtn.style.display = "none";
      quizResultEl.textContent = "";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-quiz-button");
  const quizContent = document.getElementById("quiz-content");

  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    quizContent.style.display = "block";
    showQuestion(currentQuestion);
  });

  // ===== Present Tense Quiz Data (5 questions per tense) =====
  const quizQuestions = [
    // Present Simple
    { question: "I ____ coffee every morning.", options: ["drink", "drinks", "am drink", "drinking"], answer: "drink" },
    { question: "She ____ to school by bus.", options: ["goes", "go", "is going", "going"], answer: "goes" },
    { question: "They ____ football every weekend.", options: ["play", "plays", "are playing", "played"], answer: "play" },
    { question: "He ____ very fast.", options: ["runs", "run", "is run", "running"], answer: "runs" },
    { question: "We ____ English every day.", options: ["study", "studies", "are study", "studying"], answer: "study" },

    // Present Continuous
    { question: "I ____ dinner right now.", options: ["am eating", "eat", "eats", "eating"], answer: "am eating" },
    { question: "She ____ her homework at the moment.", options: ["is doing", "does", "do", "doing"], answer: "is doing" },
    { question: "They ____ TV now.", options: ["are watching", "watch", "watches", "watching"], answer: "are watching" },
    { question: "He ____ on the phone at the moment.", options: ["is talking", "talks", "talk", "talking"], answer: "is talking" },
    { question: "We ____ in the park right now.", options: ["are running", "run", "runs", "running"], answer: "are running" },

    // Present Perfect
    { question: "I ____ finished my homework.", options: ["have", "has", "had", "having"], answer: "have" },
    { question: "She ____ visited London.", options: ["has", "have", "is", "had"], answer: "has" },
    { question: "They ____ completed the project.", options: ["have", "has", "had", "having"], answer: "have" },
    { question: "He ____ eaten breakfast.", options: ["has", "have", "is", "had"], answer: "has" },
    { question: "We ____ seen that movie.", options: ["have", "has", "had", "seeing"], answer: "have" },

    // Present Perfect Continuous
    { question: "I ____ studying for 2 hours.", options: ["have been", "has been", "am", "is"], answer: "have been" },
    { question: "She ____ working here since 2019.", options: ["has been", "have been", "is", "am"], answer: "has been" },
    { question: "They ____ playing football all morning.", options: ["have been", "has been", "are", "is"], answer: "have been" },
    { question: "He ____ reading the book since yesterday.", options: ["has been", "have been", "is", "am"], answer: "has been" },
    { question: "We ____ learning English for months.", options: ["have been", "has been", "are", "is"], answer: "have been" }
  ];

  // ===== Funny comments =====
  const correctComments = ["✅ Correct! Nice one 😎","Perfect! 🎯","Boom! 💥 Correct!","Nice, grammar ninja! 🥷","You got it! 🌟"];
  const wrongComments = ["❌ Oops, try again 😅","Nope! Keep going 🤓","Wrong! But don’t worry 😜","Missed it! Try next ⚡","Not quite! 💡"];

  let currentQuestion = 0;
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("next-question");
  const quizResultEl = document.getElementById("quiz-result");

  // === Shuffle function ===
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function showQuestion(index) {
    quizResultEl.textContent = "";
    quizResultEl.classList.remove("correct","wrong");

    const q = quizQuestions[index];
    quizQuestionEl.textContent = q.question;

    quizOptionsEl.innerHTML = "";

    const shuffledOptions = shuffleArray([...q.options]);

    shuffledOptions.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "quiz-option";

      btn.addEventListener("click", () => {
        quizOptionsEl.querySelectorAll("button").forEach(b => b.disabled = true);

        if(option === q.answer) {
          const comment = correctComments[Math.floor(Math.random()*correctComments.length)];
          quizResultEl.textContent = `${comment} ("${option}")`;
          quizResultEl.classList.add("correct");
        } else {
          const comment = wrongComments[Math.floor(Math.random()*wrongComments.length)];
          quizResultEl.textContent = `${comment} Correct: "${q.answer}"`;
          quizResultEl.classList.add("wrong");
        }

        nextBtn.style.display = "inline-block";
      });

      quizOptionsEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
  }

  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if(currentQuestion < quizQuestions.length) {
      showQuestion(currentQuestion);
    } else {
      quizQuestionEl.textContent = "🎉 Quiz Completed!";
      quizOptionsEl.innerHTML = "";
      nextBtn.style.display = "none";
      quizResultEl.textContent = "";
    }
  });
});
