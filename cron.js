// table elements 
const table = document.querySelector("table tbody");
const createButton = document.querySelector("#create");
const clearButton = document.querySelector("#clear");
const deleteButton = document.querySelector("#delete");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero to single-digit months
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero to single-digit days

  return `${year}-${month}-${day}`;
}

function generateMockData(){
  const data = [
    
    // ... add more items here
  ];
  let statusList = ["Success", "Failed"]
  let scheduleList = ["Daily", "Hourly", "Weekly", "Monthly"]
  for (let index = 0; index < 40; index++) {
    // Generate a random uppercase letter from A to Z
    let randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      data.push(
        {
          Id: index,
          Name: "Task " + randomLetter,
          Schedule: scheduleList[Math.floor(Math.random()*4)],
          "Success-Count": Math.floor(Math.random()*40),
          "Error-Count": Math.floor(Math.random()*20),
          LastSuccess: formatDate(new Date()),
          LastError: formatDate(new Date()),
          Enabled: true,
          Retries: 3,
          Next: "2023-02-14",
          Status: statusList[Math.floor(Math.random()*2)],
        },
      );
  }
  window.data = data;
}


//events
function addEventListenerCheckbox(){
  table.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (checkbox.tagName === "INPUT" && checkbox.type === "checkbox") {
        let checkedCheckboxes = table.querySelectorAll("input[type=checkbox]:checked");
        if (checkedCheckboxes.length > 0) {
          clearButton.style.display = "inline-block";
          deleteButton.style.display = "inline-block";
        } else {
          clearButton.style.display = "none";
          deleteButton.style.display = "none";
        }
    }
  });
}
  
function addEventListenerToCreateButton(){
  createButton.addEventListener("click", () => {
    window.location.href = "edit.html";
    sessionStorage.setItem("editCronItem", "");
  });
}


function addEventListenerToDeleteButton() {
  deleteButton.addEventListener("click", () => {
    const checkedCheckboxes = table.querySelectorAll("input[type=checkbox]:checked");
    checkedCheckboxes.forEach((checkbox) => {
      const row = checkbox.parentNode.parentNode;
      table.removeChild(row);
    });
    clearButton.style.display = "none";
    deleteButton.style.display = "none";
  });
}

function addEventListenerToSearchInput(){
  const searchInput = document.getElementById('table-search');
  const table = document.getElementById('cron-table-body');
  const rows = table.getElementsByTagName('tr');

  searchInput.addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName('td');
      let shouldDisplay = false;

      for (let j = 0; j < cells.length; j++) {
        const cellText = cells[j].textContent.toLowerCase();
        if (cellText.indexOf(searchTerm) > -1) {
          shouldDisplay = true;
          break;
        }
      }

      if (shouldDisplay) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });

}

function onChecked(){
  $('input[type="checkbox"]:checked').prop('checked',false);
  clearButton.style.display = "none";
  deleteButton.style.display = "none";
}

//end of events

function createCheckBox(){
  const checkboxTd = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkboxTd.appendChild(checkbox);
  addEventListenerCheckbox();

  return checkboxTd;
}


function createEditIcon(item){
  const edit = document.createElement("img");
  edit.className = "edit-icon";
  edit.setAttribute("src", "./edit.svg")
  edit.addEventListener("click",  () => {
    window.location.href = "edit.html?id=" + item.Id;
    sessionStorage.setItem("editCronItem", JSON.stringify(item));
  });

  const editTd = document.createElement("td");
  editTd.appendChild(edit);
  return editTd;
}


function fillRow(tr, cronData){
  for (const key in cronData) {
    const td = document.createElement("td");
    if(key === "Status"){
      if(cronData[key] == "Success"){
          const checkIcon = document.createElement("img");
          checkIcon.className = "success-icon";
          checkIcon.setAttribute("src", "./success.svg")
          td.appendChild(checkIcon);
      }else{
        const checkIcon = document.createElement("img");
          checkIcon.className = "fail-icon";
          checkIcon.setAttribute("src", "./fail.svg")
          td.appendChild(checkIcon);
      }
      td.setAttribute("id", key);
      tr.appendChild(td);
      continue;
    }
    td.textContent = cronData[key];
    td.setAttribute("id", key)
    tr.appendChild(td);
  }
}

function constructTable(){
  //note: window-data is used temporary, 
  //in c# project this data will come from api
  for (const item of window.data) {
    const tr = document.createElement("tr");
    const checkboxTd = createCheckBox();
    tr.appendChild(checkboxTd);
    
    fillRow(tr, item);
    // edit button for each row
    const  editTd =  createEditIcon(item);
    tr.appendChild(editTd);
    table.appendChild(tr);
  }
}
 

generateMockData();
constructTable();
addEventListenerToCreateButton();
addEventListenerToDeleteButton();
addEventListenerToSearchInput();
//   export default data;
  