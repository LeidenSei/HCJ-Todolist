var A = new Array();
let idCounter = 0;
const myList = document.getElementById("contents");

// Hàm hiển thị danh sách và cập nhật giao diện người dùng
function render() {
  const data = JSON.parse(localStorage.getItem("myKey")) || [];
  showList(data);
  removeChecked(data);
  countAll(data);
}

// Hàm tạo và hiển thị danh sách công việc
function showList(data, id) {
  const generateListItemHTML = (item) => {
    const isChecked = item.status ? "checked" : "";
    const isDisabled = id != null && item.id == id ? "" : "disabled";
    const inputTextClass = item.status ? "text_input" : "";

    return `
      <div class="list_content">
        <div class="list_item">
          <div class="check_item">
            <input type="checkbox" onclick="changeStatus(event)" id="status" ${isChecked}>
            <input type="hidden" id="id" data-id="${item.id}" value="${item.id}">
          </div>
          <div class="input_text">
            <input type="text" size="65" id="work" class="${inputTextClass}" onkeydown="handleEnter(event, this,${item.id})" value="${item.work}" ${isDisabled}>
          </div>
          <div class="list_icon">
            <button onclick="fixList(event)"><i class="fa-solid fa-pencil"></i></button>
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
  let data = JSON.parse(localStorage.getItem("myKey")) || [];
  data = data.filter(filterByStatus);
  localStorage.setItem("myKey", JSON.stringify(data));
  render();
}

// Hiển thị hoặc ẩn nút "Remove Checked"
function removeChecked(data) {
  const targetElement = document.getElementById("remove_checked");
  if (data.length !== 0) {
    targetElement.innerHTML = `<button class="remove_button" onclick="removeDone()">Remove Checked <i class="fa-solid fa-x"></i></button>`;
  } else {
    targetElement.innerHTML = ``;
  }
}

// Hiển thị tiến trình hoàn thành công việc
function countAll(data) {
  const completedCount = data.reduce((count, obj) => count + (obj.status ? 1 : 0), 0);
  const totalCount = data.length;
  const percentageCompleted = (completedCount / totalCount) * 100;
  const targetElement2 = document.getElementById("task_done");

  if (data.length !== 0) {
    targetElement2.innerHTML = `
      <div class="task_done">
        <div class="progress" style="background-color: #96e34a; width: ${percentageCompleted}%;" ></div>
        <div class="count_complete" style="display: flex; justify-content: center; align-items: center;" >
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

// Cập nhật local storage với công việc mới
function addArray(id, text, status) {
  A = JSON.parse(localStorage.getItem("myKey")) || [];
  A.push({ id: id, work: text, status: status });
  localStorage.setItem("myKey", JSON.stringify(A));
}

// Thay đổi trạng thái của một công việc
function changeStatus(event) {
  let listItem = event.target.closest(".list_item");
  let id = listItem.querySelector("#id").value;
  let status = event.target.checked;
  updateStatus(id, status);
  render();
}

// Cập nhật trạng thái công việc trong local storage
function updateStatus(id, status) {
  const data = JSON.parse(localStorage.getItem("myKey"));
  data.forEach((object) => {
    if (object.id == id) object.status = status;
  });
  localStorage.setItem("myKey", JSON.stringify(data));
}

// Sửa một công việc
function fixList(event) {
  const data = JSON.parse(localStorage.getItem("myKey"));
  let listItem = event.target.closest(".list_item");
  let id = listItem.querySelector("#id").value;
  showList(data, id);
}

// Xử lý sự kiện "Enter" để cập nhật công việc
function handleEnter(event, workInput, id) {
  if (event.key === "Enter") {
    updateWork(id, workInput.value);
    const data = JSON.parse(localStorage.getItem("myKey"));
    showList(data, null);
  }
}

// Cập nhật công việc trong local storage
function updateWork(id, work) {
  const data = JSON.parse(localStorage.getItem("myKey"));
  data.forEach((object) => {
    if (object.id == id) object.work = work;
  });
  localStorage.setItem("myKey", JSON.stringify(data));
}

// Xóa một công việc theo ID
function removeObjectById(id) {
  let data = JSON.parse(localStorage.getItem("myKey")) || [];
  data = data.filter((obj) => obj.id !== id);
  localStorage.setItem("myKey", JSON.stringify(data));
  render();
}

// Xóa một công việc
function remove(event) {
  let listItem = event.target.closest(".list_item");
  let id = parseInt(listItem.querySelector("#id").value);
  removeObjectById(id);
}

// Khởi tạo ứng dụng khi tải trang
window.onload = function () {
  render();
};
