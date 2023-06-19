const contactContainer = document.querySelector("#contact-container");
const addForm = document.querySelector(".add-contact");
const addName = document.querySelector("#name");
const addSurname = document.querySelector("#surname");
const addImg = document.querySelector("#img");
const addNumber = document.querySelector("#num");

const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal");
const editInputName = document.querySelector("#edit-input-name");
const editInputSurname = document.querySelector("#edit-input-surname");
const editInputImg = document.querySelector("#edit-input-img");
const editInputNumber = document.querySelector("#edit-input-number");

const editCancel = document.querySelector("#edit-cancel");
const editSubmit = document.querySelector(".edit-submit");

const API = "http://localhost:8000/contacts";
//?get
async function getContacts() {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

//?getOne
async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//? post
async function addContact(newContact) {
  const res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//?delete

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

//? patch

async function editContact(newData, id) {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//?render
render();
async function render() {
  const data = await getContacts();
  contactContainer.innerHTML = "";
  data.forEach((item) => {
    contactContainer.innerHTML += `
      <div class="contact-item">
      <img src ="${item.img}" alt=""  />
    <span>${item.name}</span>
    <span>${item.surname}</span>
    <span>${item.number}</span>
      <div>
        <button id = "${item.id}"class="edit-btn">Edit</button>
        <button id= "${item.id}" class="delete-btn">Delete</button>
      </div>

    </div>
      `;
  });
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (
    !addName.value.trim() ||
    !addSurname.value.trim() ||
    !addNumber.value.trim()
  ) {
    addName.value = "";
    addNumber.value = "";
    return;
  }

  const list = {
    name: addName.value,
    surname: addSurname.value,
    img: addImg.value,
    number: addNumber.value,
  };

  addName.value = "";
  addSurname.value = "";
  addImg.value = "";
  addNumber.value = "";

  await addContact(list);

  render();
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await deleteContact(e.target.id);
    render();
  }
});
let id = null;
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editModal.style.visibility = "visible";
    let editList = await getOneContact(e.target.id);
    id = e.target.id;
    editInputName.value = editList.name;
    editInputSurname.value = editList.surname;
    editInputImg.value = editList.img;
    editInputNumber.value = editList.number;
    editInputName.focus();
  }
});

function closeEdit() {
  editModal.style.visibility = "hidden";
}

closeModalBtn.addEventListener("click", closeEdit);
editCancel.addEventListener("click", closeEdit);

editSubmit.addEventListener("click", async () => {
  if (
    !editInputName.value.trim() ||
    !editInputSurname.value.trim() ||
    !editInputNumber.value.trim()
  ) {
    return;
  }

  const newData = {
    name: editInputName.value,
    surname: editInputSurname.value,
    img: editInputImg.value,
    number: editInputNumber.value,
  };

  await editContact(newData, id);
  render();
  closeEdit();
});
