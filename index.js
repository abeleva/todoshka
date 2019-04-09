"use strict";
// Import stylesheets
import './style.css';

// Объявляем переменные
const form = document.getElementById('form');
const field = document.getElementById('field');
const dateField = document.getElementById('date-field');
const list = document.getElementById('list');

const button = document.getElementById('button-remove');
const listArray = [];


// Добавляем события

// Добавление элемента списка
form.addEventListener('submit', function(e){
  e.preventDefault();

  const fieldValue = field.value.trim();
  const itemObj = {};
  
  if (!fieldValue) { 
    return;
  }
  
  itemObj.text = fieldValue;
  itemObj.createdDate = new Date();
  itemObj.expiredDate = dateField.valueAsDate;

  listArray.push(itemObj);

  addItem(itemObj);

  // Очищение полей
  field.value = '';
  dateField.value = '';

  // Фильтр
  filterList();

  console.log(itemObj);
});

// Поиск совпадения
field.addEventListener('input', function(){
  
  filterList();
  
});


// Апдейт актуальности
const tm = setInterval(function() {

  updateDeadline();

}, 600); 

// А тут новый элемент списка создадим и добавим
function addItem(object) {
  const itemObj = object;
  const newItem = document.createElement('li');
  const buttonRemove = document.createElement('button');
  const createdDateContainer = document.createElement('div')
  const remainingTime = document.createElement('div');
  const createdDate = object.createdDate; 
  const createdYear = createdDate.getFullYear();
  const createdMonth = createdDate.getMonth();
  const createdDay = createdDate.getDate();
  const dateFieldAsDate = dateField.valueAsDate;


  newItem.className = 'list-group-item';
  newItem.innerText = object.text;

  list.appendChild(newItem);

  listArray[listArray.length - 1].node = newItem;

  // Добавляем кнопку удаления

  function click(e){
    this.closest('.list-group-item').remove();
  }

  buttonRemove.onclick = function(e) {
    this.closest('.list-group-item').remove();
  }
  buttonRemove.className = 'button-remove';
  buttonRemove.innerText = 'Удалить';
  newItem.appendChild(buttonRemove);

  // Дата создания
  
  createdMonth = formatMonth(createdMonth);
  const dateText = `Создано: ${createdDay}.${createdMonth}.${createdYear}`;
  createdDateContainer.innerText = dateText;
  createdDateContainer.className = 'created-date';
  newItem.appendChild(createdDateContainer);
  

  // Добавление оставшегося времени
  remainingTime.className = 'remaining-time' 
  newItem.appendChild(remainingTime);

  updateDeadline();
}

// Formatting day 
function formatDay(createdDay) {
  if (createdDay < 10) {
    createdDay = `0${createdDay}`;
  }

  return createdDay;
}

// Formatting month 
function formatMonth(createdMonth) {
  createdMonth = createdMonth + 1;
  if (createdMonth < 10) {
    createdMonth = `0${createdMonth}`;
  }

  return createdMonth;
}

// Deadline 
function calcRmainingTime(deadline) {
  const remainingTimeArray = dhm(deadline - new Date());
  return `Осталось ${remainingTimeArray[0]}д. ${remainingTimeArray[1]}ч. ${remainingTimeArray[2]}м. ${remainingTimeArray[3]}с.`;
}
function updateDeadline() {
  const deadlines = [];

  // Пройтись по всем итемам и обновить оставшееся время
  for (let i = 0; i < listArray.length; i++) {
    const node = listArray[i].node;
    const deadline = node.lastElementChild;
    const exp = listArray[i].expiredDate;
    deadline.innerText = calcRmainingTime(exp);

    if (checkDeadline(exp)) { 
      node.style.background = 'pink';  
    }
  }
}

// Проверка актуальности
function checkDeadline(deadline) {
  var dayMs = 24*60*60*1000;
  return deadline - new Date() < dayMs;
}

// Filter
function filterList() {
  const listItems = document.querySelectorAll('#list > li');

  listItems.forEach(function(item, i){
    const text = listItems[i].innerText.toUpperCase();
    const inputText = field.value.toUpperCase();

    if (text.indexOf(inputText) > -1){
      listItems[i].style.display = '';
    } else {
      listItems[i].style.display = 'none';
    }
  })
}

// Ms to days converter (это из интеренетов)
function dhm(ms){
    const days = Math.floor(ms / (24*60*60*1000));
    const daysms=ms % (24*60*60*1000);
    const hours = Math.floor((daysms)/(60*60*1000));
    const hoursms=ms % (60*60*1000);
    const minutes = Math.floor((hoursms)/(60*1000));
    const minutesms=ms % (60*1000);
    const sec = Math.floor((minutesms)/(1000));
    const remainingTimeArray = [days, hours, minutes, sec];
    return remainingTimeArray;
}