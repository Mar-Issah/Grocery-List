//what we do in the UI we do same in local storage such as add, edit, delete, clear etc so write double fxns
//wrtite fxn to display, show container etc

//**********SELECT ITEMS***********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//****************EDIT OPTIONS*****************
//this is for the edit and edit btn //the chosen item, whether its been editd and its id
let editElement;
let editFlag = false;
let editID = "";

//****************EVENT LISTENERS**************
//create call back fxns below
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

//most important . set up item so that anytime user comes back to the app the left off list will still be available
window.addEventListener("DOMContentLoaded", setUpItems);

//***************FUNCTIONS*********************
//if you click on submit, ideally it is suppose to submit to server but we nedd to prevent the default from the element
function addItem(e) {
	e.preventDefault();
	const value = grocery.value;
	const id = new Date().getTime().toString();
	//you are not going to do this on a serious project but we want a unique id and dont want to use an external libary or calculate the number and increment it so just cheating

	//we convert to string becos later when you access it will come back as a string so we might as well set it to a string

	//validating long way wld have been value !== ""
	if (value && !editFlag) {
		createListItems(id, value);

		displayAlert("An item has been added to the list", "success");
		container.classList.add("show-container");

		//add to local srorage
		addToLocalStorage(id, value);
		//set back to default
		setBackToDefault();
	} else if (value && editFlag) {
		//come back after the editItem fxn and set the input value(after editing
		editElement.innerHTML = value;
		displayAlert("item changed", "success");

		//edit the item in local storage. the editID not the id
		editLocalStorage(editID, value);
		setBackToDefault();
	} else {
		// alert.textContent = "Please enter items!";
		// alert.classList.add("alert-danger");
		displayAlert("please enter items!", "danger");
	}
}

//--------------------------------------------------------
//set a function to display the alert since we be display multiple alerts. receive the text to display and the css action(to be added or removed) to take effect
function displayAlert(text, action) {
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);

	//remove alert after some time. settimeout takes a fxn and seconds in ms
	setTimeout(() => {
		alert.textContent = "";
		alert.classList.remove(`alert-${action}`);
	}, 1500);
}

//-------------------------------------------------------------
//for the clear button
//select the items in the grocery-list inner html for each of them . remove them from the grocery list(parent)
function clearItems() {
	const items = document.querySelectorAll(".grocery-item");
	if (items.length > 0) {
		items.forEach((item) => {
			list.removeChild(item);
		});
	}
	//and then remove the clear button, show the alert, set back to default and remove all from local storage
	container.classList.remove("show-container");
	displayAlert("Your list is empty", "danger");
	setBackToDefault();
	//localStorage.removeItem("list");
}

//------------------------------------------------------------
//set back to default: clear everything
function setBackToDefault() {
	grocery.value = "";
	editFlag = false;
	editID = "";
	submitBtn.textContent = "submit";
}

//-------------------------------------------------------------
function deleteItem(elem) {
	//climb up the parent to get grocery-item i.e.the article. remove grocery-item(child) from grocery-list
	const element = elem.currentTarget.parentElement.parentElement;
	list.removeChild(element);

	//retrieve the id which was created earlier from the item and pass it to the remove from local storage fxn
	const id = element.dataset.id;

	//notice that the clear item button and container still there so remvove, display alert and set to default
	if (list.children.length === 0) {
		container.classList.remove("show-container");
	}
	displayAlert("item removed", "danger");
	setBackToDefault();

	//now remove from local storage
	removeFromLocalStorage(id);
}

//-------------------------------------------------------------
function editItem(elem) {
	//get the article here again and get the item to edit
	const element = elem.currentTarget.parentElement.parentElement;

	//the item to edit is the sibling to the button container
	editElement = elem.currentTarget.parentElement.previousElementSibling;
	//console.log(editElement); <p class="title">milk</p>

	//now that we have the paragraph we can edit its contents,set the edit flag to true and also get the items id.change the sub,it to edit btn
	grocery.value = editElement.innerHTML;
	editFlag = true;
	editID = element.dataset.id;
	submitBtn.textContent = "edit";
	//after doing this go back to the addItem fxn to be able to add the item after editing
}

//**************************LOCAL STORAGE**********************
function addToLocalStorage(id, value) {
	const grocery = { id, value }; //using ES6 object property shorthand

	const items = getLocalStorage();

	//console.log(items); the first time will be empty
	//after getting the array empty or not push the grocery inside the array and then set to local storage name it list
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
//make it easy by creating a fxn
function getLocalStorage() {
	//console.log(grocery);   {id: "1607890784493", value: "milk"}
	//first get the list array if empty create new array and add the new item. use ternary operator instd of if stmnt
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
}
//local storage API
//set item
//get item
//remove item
//save as string

//how does local storage work  for references
// localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

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
//the function creates the list items cut from the addlistitem. you will need it twice
function createListItems(id, value) {
	//to add item to the list create the grocery list (article element)dynamically whicw will appear when item are added
	const element = document.createElement("article");
	//now add class
	element.classList.add("grocery-item");
	//now add data-id(custom id) and use the id as its value
	const attr = document.createAttribute("data-id");
	attr.value = id;
	//The setAttributeNode() method adds a new Attr node to the specified element. in this case this sets up the article node
	element.setAttributeNode(attr);
	//finally add you html
	element.innerHTML = `<p class="title">${value}</p>
					
							<div class="btn-container">
								<button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
								<button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
                            </div>`;

	//over here you can have access to the edit and delete btns since they appear afer an item has been added. use element. not document. since it is not in the document(html)
	const deleteBtn = element.querySelector(".delete-btn");
	const editBtn = element.querySelector(".edit-btn");
	deleteBtn.addEventListener("click", deleteItem);
	editBtn.addEventListener("click", editItem);

	//now we want to make this above created element a child of grocery-list as list, display alert and show the container
	list.appendChild(element);
}
