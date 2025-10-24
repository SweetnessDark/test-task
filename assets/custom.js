document.addEventListener("DOMContentLoaded", () => {
  const quizAnswers = {};
  const quizSection = document.getElementById("sectionQuestions");

  if (quizSection) {
    const answerButtons = quizSection.querySelectorAll(".answers-button");

    answerButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const questionDiv = e.target.closest(".question");
        const questionElement = questionDiv
          ? questionDiv.querySelector(".question-description span")
          : null;

        const questionText = questionElement
          ? questionElement.textContent.trim()
          : `Question ${questionDiv.id}`;

        const answerText = e.target.textContent.trim();

        quizAnswers[questionText] = answerText;

        if (
          e.target.dataset.next === "boxes-game" ||
          e.target.closest("[data-next='boxes-game']")
        ) {
          localStorage.setItem("quizAnswers", JSON.stringify(quizAnswers));
        }
      });
    });
  }

  const form = document.getElementById("userDataForm");
  const inputs = form.querySelectorAll("input[data-validate]");
  const btnToDelivery = document.getElementById("TO_DELIVERY");
  const btnToCart = document.getElementById("toCart");

  const patterns = {
    name: /^[A-Za-zÀ-ÿ' -]{2,30}$/,
    phone: /^[0-9]{6,15}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    city: /^[A-Za-zÀ-ÿ' -]{2,30}$/,
    zip: /^[0-9]{4,10}$/,
    address: /^.{5,100}$/,
    country: /^[A-Za-zÀ-ÿ' -]{2,30}$/,
  };

  function validateInput(input) {
    const type = input.dataset.validate;
    const value = input.value.trim();
    const wrapper = document.getElementById(`${input.id}Wrapper`);
    const invalidField = document.getElementById(`${input.id}Invalid`);

    const regex = patterns[type];
    if (!regex) return true;

    const isValid = regex.test(value);

    if (isValid) {
      wrapper.classList.add("valid");
      wrapper.classList.remove("invalid");
      invalidField?.classList.remove("show");
    } else {
      wrapper.classList.add("invalid");
      wrapper.classList.remove("valid");
      invalidField?.classList.add("show");
    }

    return !!isValid;
  }

  function validateForm() {
    let valid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) valid = false;
    });
    return valid;
  }

  function saveUserData() {
    const data = {};
    inputs.forEach((input) => {
      data[input.name] = input.value.trim();
    });
    localStorage.setItem("userData", JSON.stringify(data));
    return data;
  }

  btnToDelivery.addEventListener("click", () => {
    if (validateForm()) {
      const data = saveUserData();
    } else {
      const firstError = form.querySelector(".invalidField.show");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
    input.addEventListener("input", () => {
      const wrapper = document.getElementById(`${input.id}Wrapper`);
      const invalidField = document.getElementById(`${input.id}Invalid`);
      if (wrapper.classList.contains("invalid")) {
        wrapper.classList.remove("invalid");
        invalidField?.classList.remove("show");
      }
    });
  });

  function showUserAnswers() {
    const answersData = JSON.parse(localStorage.getItem("quizAnswers"));
    const section = document.getElementById("userAnswersSection");
    const list = document.getElementById("userAnswersList");

    if (!answersData || !section || !list) return;

    list.textContent = "";
    Object.entries(answersData).forEach(([question, answer]) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `<strong>${question}</strong><br>${answer}`;
      list.appendChild(li);
    });

    section.style.display = "flex";
  }

  const lastButtons = document.querySelectorAll('[data-next="boxes-game"]');
  lastButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(showUserAnswers, 500);
    });
  });
});
