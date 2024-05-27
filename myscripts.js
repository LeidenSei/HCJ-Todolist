let A = JSON.parse(localStorage.getItem("myKey")) || [];
let idCounter = A.length > 0 ? Math.max(...A.map(item => item.id)) + 1 : 0;
const myList = document.getElementById("contents");

// Hàm hiển thị danh sách và cập nhật giao diện người dùng
function render() {
  showList(A);
  removeChecked(A);
  countAll(A);
  applyConditionOverscroll(A);
}

// Kiểm tra overscroll
function applyConditionOverscroll(data) {
  const myDiv = document.getElementById("overscroll_check");
  if (data.length > 6) {
    myDiv.classList.add("overscroll-size");
  } else {
    myDiv.classList.remove("overscroll-size");
  }
}

// Hàm tạo và hiển thị danh sách công việc
function showList(data, editId = null) {
  const generateListItemHTML = (item) => {
    const isChecked = item.status ? "checked" : "";
    const isDisabled = editId !== null && item.id == editId ? "" : "disabled";
    const iconFix = editId !== null && item.id == editId ? "fa-solid fa-user-pen" : "fa-solid fa-pencil";
    const inputTextClass = item.status ? "text-input" : "";

    return `
      <div class="list-content">
        <div class="list-item">
          <div class="check-item">
            <input type="checkbox" onclick="changeStatus(event)" class="status-checkbox" ${isChecked}>
            <input type="hidden" class="item-id" value="${item.id}">
          </div>
          <div class="input-text">
            <input type="text" size="65" class="work-input ${inputTextClass}" onkeydown="handleEnter(event, this, ${item.id})" value="${item.work}" ${isDisabled}>
          </div>
          <div class="list-icon">
            <button onclick="fixList(event)"><i class="${iconFix}"></i></button>
            <button onclick="remove(event)"><i class="fa-solid fa-x"></i></button>
          </div>
        </div>
      </div>
    `;
  };

  myList.innerHTML = data.map(generateListItemHTML).join("");
}

// Hàm lọc các công việc theo trạng thái
function filterByStatus(obj) {
  return !obj.status;
}

// Hàm xóa tất cả các công việc đã hoàn thành
function removeDone() {
  A = A.filter(filterByStatus);
  localStorage.setItem("myKey", JSON.stringify(A));
  render();
}

// Hiển thị hoặc ẩn nút "Remove Checked"
function removeChecked(data) {
  const targetElement = document.getElementById("remove_checked");
  if (data.length !== 0) {
    targetElement.innerHTML = `<button class="remove-button" onclick="removeDone()">Remove Checked <i class="fa-solid fa-x"></i></button>`;
  } else {
    targetElement.innerHTML = ``;
  }
}

// Hiển thị tiến trình hoàn thành công việc
function countAll(data) {
  const completedCount = data.reduce((count, obj) => count + (obj.status ? 1 : 0), 0);
  const totalCount = data.length;
  const percentageCompleted = totalCount ? (completedCount / totalCount) * 100 : 0;
  const targetElement2 = document.getElementById("task_check");

  if (data.length !== 0) {
    targetElement2.innerHTML = `
      <div class="task-done">
        <div class="progress" style="background-color: #96e34a; width: ${percentageCompleted}%;" ></div>
        <div class="count-complete" style="display: flex; justify-content: center; align-items: center;" >
          <p><span>${completedCount}</span> of <span>${totalCount}</span> task done</p>
        </div>
      </div>
    `;
  } else {
    targetElement2.innerHTML = ``;
  }
}

// Thêm một công việc mới
function AddWork() {
  let text = document.getElementById("add_work").value;
  let status = false;
  let id = idCounter++;
  addArray(id, text, status);
  render();
}

function handleAppWork(event) {
  if (event.key === "Enter") {
    AddWork();
  }
}

// Cập nhật local storage với công việc mới
function addArray(id, text, status) {
  A.push({ id: id, work: text, status: status });
  localStorage.setItem("myKey", JSON.stringify(A));
}

// Thay đổi trạng thái của một công việc
function changeStatus(event) {
  let listItem = event.target.closest(".list-item");
  let id = listItem.querySelector(".item-id").value;
  let status = event.target.checked;
  updateStatus(id, status);
  updateTaskStatus(listItem, status);
  countAll(A);
  applyConditionOverscroll(A);
}

// Cập nhật trạng thái công việc trong local storage
function updateStatus(id, status) {
  A.forEach((object) => {
    if (object.id == id) object.status = status;
  });
  localStorage.setItem("myKey", JSON.stringify(A));
}

// Cập nhật trạng thái của một công việc trong giao diện
function updateTaskStatus(listItem, status) {
  const inputText = listItem.querySelector(".work-input");
  if (status) {
    inputText.classList.add("text-input");
  } else {
    inputText.classList.remove("text-input");
  }
}

// Sửa một công việc
let statusFix=false;
function fixList(event) {
  statusFix=!statusFix
  if(statusFix){
    let listItem = event.target.closest(".list-item");
    let id = listItem.querySelector(".item-id").value;
    showList(A, id);
  }else{
    showList(A, null);
  }
  
}

// Xử lý sự kiện "Enter" để cập nhật công việc
function handleEnter(event, workInput, id) {
  if (event.key === "Enter") {
    updateWork(id, workInput.value);
    showList(A, null);
  }
}

// Cập nhật công việc trong local storage
function updateWork(id, work) {
  A.forEach((object) => {
    if (object.id == id) object.work = work;
  });
  localStorage.setItem("myKey", JSON.stringify(A));
}

// Xóa một công việc theo ID
function removeObjectById(id) {
  A = A.filter((obj) => obj.id !== id);
  localStorage.setItem("myKey", JSON.stringify(A));
}

// Xóa một công việc
function remove(event) {
  let listItem = event.target.closest(".list-item");
  let id = parseInt(listItem.querySelector(".item-id").value);
  removeObjectById(id);
  listItem.remove();
  countAll(A);
  removeChecked(A);
  applyConditionOverscroll(A);
}

// Khởi tạo ứng dụng khi tải trang
window.onload = function () {
  render();
};
