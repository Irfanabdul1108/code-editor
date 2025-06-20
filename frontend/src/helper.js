export const toggleClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) {
    elem.classList.toggle(className);
  }
};

export const removeClass = (el, className) => {
  let elem = document.querySelector(el);
  if (elem) {
    elem.classList.remove(className);
  }
};

export const api_base_url = import.meta.env.VITE_API_BASE_URL;
