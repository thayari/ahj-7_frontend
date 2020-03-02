const formCreateTicket = document.querySelector('.form-create-ticket');
const formEditTicket = document.querySelector('.form-edit-ticket');
const ticketsList = document.querySelector('.tickets');
const addButton = document.getElementById('add-button')
const modalEdit = document.getElementById('modal-edit');
const modalAdd = document.getElementById('modal-add');
const modalDelete = document.getElementById('modal-delete');
const cancelButtons = document.querySelectorAll('.cancel');
const url = 'http://localhost:7070/tickets';

let currentId;


ticketsList.addEventListener('click', async (event) => {
  event.preventDefault();
  currentId = event.target.closest('.ticket-item').dataset.id;
  if (event.target.classList.contains('delete')) {
    showModal(modalDelete);
  } else if (event.target.classList.contains('edit')) {
    showModal(modalEdit);
  } else if (event.target.classList.contains('check')) {
    let response = await fetch (url + '/' + currentId, {
      method: 'PUT',
    });
    if (!response.ok) {
      console.error('Ошибка ' + response.status);
    }
    getData();
  } else {
    const descrElem = event.target.closest('.ticket-item').querySelector('.ticket-description');
    if (descrElem) {
      descrElem.parentNode.removeChild(descrElem);
    } else {
      let response = await fetch (url + '/' + currentId);
      if (response.ok) {
        const ticketFull = await response.json();
        const ticketDescription = ticketFull.description;
        event.target.closest('.ticket-item').insertAdjacentHTML('beforeend', `<div class="ticket-description">${ticketDescription}</div>`)
        console.log(ticketFull);
      } else {
        console.error('Ошибка ' + response.status);
      }
    }
  }
});

addButton.addEventListener('click', () => {
  showModal(modalAdd);
});

cancelButtons.forEach((element) => {
  element.addEventListener('click', () => {
    hideModal(element.closest('.modal'));
  });
});

modalDelete.addEventListener('click', async (event) => {
  if (event.target.classList.contains('ok')) {
    let response = await fetch(url + '/' + currentId, {
      method: 'DELETE',
    });
    if (response.ok) {
      getData();
    } else {
      console.error('Ошибка ' + response.status);
    }
    hideModal(modalDelete);
  }
});

formEditTicket.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(formEditTicket);
  let response = await fetch(url + '/' + currentId, {
    method: 'PATCH', 
    body: formData,
  });
  if (!response.ok) {
    console.error('Ошибка ' + response.status);
  }
  getData();
  hideModal(modalAdd);
})


formCreateTicket.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(formCreateTicket);
  let response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  formCreateTicket.reset();
  getData();
  hideModal(modalAdd);
})


async function getData() {
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    makeList(json);
  } else {
    console.error('Ошибка ' + response.status);
  }
}

/**
 * Возвращает html-код элемента списка
 * 
 * @param {object} o - объект Ticket, должен иметь свойства 'status', 'id', 'name', 'created'
*/

function makeListItem(o) {
  let check;
  if (o.status) {
    check = 'checked';
  } else {
    check = 'unchecked';
  }
  const html = `<li class="ticket-item" data-id="${o.id}">
  <div class="ticket-item-wrapper">
    <div class="information">
      <button class="check ${check}"></button>
      <div class="name">${o.name}</div>
      <div class="date">${o.created}</div>
    </div>
    <div class="buttons">
      <button class="edit">✎</button>
      <button class="delete">×</button>
    </div>
  </div>
</li>`
  return html;
}

/**
 * Добавляет элементы в ticketsList
 * 
 * @param {array} arr полученный с сервера список тикетов 
 */

function makeList(arr) {
  ticketsList.innerHTML = '';
  const arrNew = arr.map((item) => makeListItem(item));
  arrNew.forEach((item) => {
    ticketsList.insertAdjacentHTML('beforeend', item)
  });
}

function showModal(element) {
  document.querySelector('.bg').classList.remove('hidden');
  element.classList.remove('hidden');
}

function hideModal(element) {
  document.querySelector('.bg').classList.add('hidden');
  element.classList.add('hidden');
}



getData();