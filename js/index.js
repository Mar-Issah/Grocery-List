//**********retrieve elements***********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//****************EDIT OPTIONS*****************
let editElement;
let editFlag = false;
let editID = "";

//****************EVENT LISTENERS**************

form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded", setUpItems);

//***************FUNCTIONS*********************

//add grocery item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItems(id, value);

    displayAlert("An item has been added to the list", "success");
    container.classList.add("show-container");

    //add to local srorage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("item changed", "success");

    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter items!", "danger");
  }
}

//--------------------------------------------------------

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert after 1.5s
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}

//-------------------------------------------------------------
//when the clear button is click, all the items are removed the item container is also removed
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container");
  displayAlert("Your list is empty", "danger");
  setBackToDefault();

}

//------------------------------------------------------------
//set back to default function
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

//-------------------------------------------------------------
function deleteItem(elem) {
  const element = elem.currentTarget.parentElement.parentElement;
  list.removeChild(element);

  const id = element.dataset.id;

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();

  //now remove from local storage
  removeFromLocalStorage(id);
}

//-------------------------------------------------------------
//edit item function
function editItem(elem) {
 // target the element to edit e.g <p class="title">milk</p>
  const element = elem.currentTarget.parentElement.parentElement;

  editElement = elem.currentTarget.parentElement.previousElementSibling;

  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //when the item is being edited the edit button is on
  submitBtn.textContent = "edit";
}

//**************************LOCAL STORAGE**********************
function addToLocalStorage(id, value) {
  const grocery = { id, value };

  const items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

//-------------------------------------------------------------
function removeFromLocalStorage(id) {
  const items = getLocalStorage();

  items = items.filter((item) => {
    if (item.id != id) {
      return id;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//--------------------------------------------------------------
function editLocalStorage(editID, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === editID) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//------------------------------------------------------------
//create a function to access the list from local storage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//************************SETUP ITEMS***********************
function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItems(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

//------------------------------------------------------------
//the function creates the list item. You creatw the element dynamically
function createListItems(id, value) {
  const element = document.createElement("article");

  element.classList.add("grocery-item");

  const attr = document.createAttribute("data-id");
  attr.value = id;

  element.setAttributeNode(attr);

  element.innerHTML = `<p class="title">${value}</p>
			<div class="btn-container">
			<button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
			<button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
                            </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}
