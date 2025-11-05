// Get references to HTML elements
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDesc");

  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  // Check if user entered both fields
  if (title === "" || desc === "") {
    alert("Please enter both a title and description!");
    return;
  }

  // Create task div
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

  // Create title and description elements
  const taskTitle = document.createElement("h3");
  taskTitle.textContent = title;

  const taskDesc = document.createElement("p");
  taskDesc.textContent = desc;

  // Create buttons
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Mark as Completed";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  // Add functionality to buttons
  completeBtn.addEventListener("click", () => {
    const isCompleted = taskTitle.classList.toggle("completed");
    taskDesc.classList.toggle("completed");
    completeBtn.textContent = isCompleted
      ? "Mark as Incomplete"
      : "Mark as Completed";
  });

  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(taskDiv);
  });

  editBtn.addEventListener("click", () => {
    if (editBtn.textContent === "Edit") {
      // Switch to edit mode
      const titleEdit = document.createElement("input");
      titleEdit.type = "text";
      titleEdit.value = taskTitle.textContent;

      const descEdit = document.createElement("textarea");
      descEdit.value = taskDesc.textContent;

      taskDiv.replaceChild(titleEdit, taskTitle);
      taskDiv.replaceChild(descEdit, taskDesc);

      editBtn.textContent = "Save";

      // Save changes
      editBtn.addEventListener("click", function saveChanges() {
        if (editBtn.textContent === "Save") {
          taskTitle.textContent = titleEdit.value;
          taskDesc.textContent = descEdit.value;

          taskDiv.replaceChild(taskTitle, titleEdit);
          taskDiv.replaceChild(taskDesc, descEdit);

          editBtn.textContent = "Edit";
          editBtn.removeEventListener("click", saveChanges);
        }
      });
    }
  });

  // Add everything inside task div
  taskDiv.appendChild(taskTitle);
  taskDiv.appendChild(taskDesc);
  taskDiv.appendChild(completeBtn);
  taskDiv.appendChild(editBtn);
  taskDiv.appendChild(deleteBtn);

  // Add task to list
  taskList.appendChild(taskDiv);

  // Clear input fields
  titleInput.value = "";
  descInput.value = "";
}
