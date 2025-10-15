document.addEventListener("DOMContentLoaded", () => {
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
    const isValid = patterns[type]?.test(value);

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
      console.log("Успешно! Данные формы:", data);
    } else {
      console.log("Форма заполнена некорректно!");
    }
  });

  if (btnToCart) {
    btnToCart.addEventListener("click", () => {
      const data = JSON.parse(localStorage.getItem("userData"));
      if (data) {
        console.log("Данные пользователя из LocalStorage:", data);
      } else {
        console.log("Нет сохранённых данных пользователя.");
      }
    });
  }

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
  });
});
