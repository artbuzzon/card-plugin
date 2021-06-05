const getEl = (id) => {
  const el = document.querySelector(id);
  if (el) {
    return el;
  } else {
    throw new Error(`There is no element with the id ${id} in the DOM`);
  }
};

const getAllEls = (id) => {
  const els = document.querySelectorAll(id);
  if (els) {
    return els;
  } else {
    throw new Error(`There is no element with the id ${id} in the DOM`);
  }
};

const append = (query, element) => {
  const root = getEl(query);
  root.appendChild(element);
  return root;
};

const createEl = (el) => {
  return document.createElement(el);
};

export {
  getEl,
  getAllEls,
  append,
  createEl,
};
