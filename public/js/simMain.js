import {Anima} from "./Classes/Anima.js";

//bootstrap dropdowns
const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))

//dropdown lists vars
const animaSpdBtn = document.querySelector('#animaSpdBtn');
const animaSpdList = document.querySelector('#animaSpdList');
const spdListArray = [1, 2, 3, 4, 5, "All"]
const animaOneBtn = document.querySelector('#animaOneBtn');
const animaOneList = document.querySelector('#animaOneList');
const animaTwoBtn = document.querySelector('#animaTwoBtn');
const animaTwoList = document.querySelector('#animaTwoList');
const animaThreeBtn = document.querySelector('#animaThreeBtn');
const animaThreeList = document.querySelector('#animaThreeList');
const enemyBtn = document.querySelector('#enemyBtn');
const enemyList = document.querySelector('#enemyList');

//get a

for (let i = 0; i < spdListArray.length; i++) {
    const spd = spdListArray[i];
    const li = document.createElement("li");

    li.setAttribute("class", "dropdown-item");
    li.innerText = spd;
    animaSpdList.appendChild(li);
}