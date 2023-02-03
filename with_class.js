var todoObjectList;

class Todo_Class {
  constructor(item) {
    this.ulElement = item;
  }

  add() {
    const todoInput = document.querySelector("#myInput").value;
    if (todoInput == "") {
      alert("You did not enter any item!");
    } else {
      const todoObject = {
        id: todoObjectList.length,
        todoText: todoInput,
        isDone: false,
      };

      fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoObject),
      })
        .then((res) => res.json())
        .then((json) => todoObjectList.unshift(json))
        .then(() => {
          this.display();
          document.querySelector("#myInput").value = "";
        });
    }
  }

  done_undone(x) {
    const selectedTodoIndex = todoObjectList.findIndex((item) => item.id == x);
    // console.log(selectedTodoIndex);
    if (todoObjectList[selectedTodoIndex] == undefined) return;
    // console.log(todoObjectList[selectedTodoIndex].isDone);
    todoObjectList[selectedTodoIndex].isDone == false ? (todoObjectList[selectedTodoIndex].isDone = true) : (todoObjectList[selectedTodoIndex].isDone = false);

    // console.log(todoObjectList[selectedTodoIndex]);

    var id = todoObjectList[selectedTodoIndex].id;
    fetch("http://localhost:8000/todos/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoObjectList[selectedTodoIndex]),
    }).then(() => this.display());
  }

  deleteElement(z) {
    const selectedDelIndex = todoObjectList.findIndex((item) => item.id == z);

    todoObjectList.splice(selectedDelIndex, 1);

    fetch("http://localhost:8000/todos/" + z, {
      method: "DELETE",
    }).then(() => this.display());
  }

  display() {
    fetch("http://localhost:8000/todos")
      .then((res) => res.json())
      .then((json) => (todoObjectList = json))
      .then(() => {
        this.ulElement.innerHTML = "";

        todoObjectList.forEach((object_item) => {
          const liElement = document.createElement("li");
          const delBtn = document.createElement("i");

          liElement.innerText = object_item.todoText;
          liElement.setAttribute("data-id", object_item.id);

          delBtn.setAttribute("data-id", object_item.id);
          delBtn.classList.add("far", "fa-trash-alt");

          liElement.appendChild(delBtn);

          delBtn.addEventListener("click", function (e) {
            const deleteId = e.target.getAttribute("data-id");
            myTodoList.deleteElement(deleteId);
          });

          liElement.addEventListener("click", function (e) {
            const selectedId = e.target.getAttribute("data-id");
            myTodoList.done_undone(selectedId);
          });

          if (object_item.isDone) {
            liElement.classList.add("checked");
          }

          this.ulElement.appendChild(liElement);
        });
      });
  }
}

////-----MAIN PROGRAM------------
const listSection = document.querySelector("#myUL");

myTodoList = new Todo_Class(listSection);
myTodoList.display();

document.querySelector(".addBtn").addEventListener("click", function () {
  myTodoList.add();
});

document.querySelector("#myInput").addEventListener("keydown", function (e) {
  if (e.keyCode == 13) {
    myTodoList.add();
  }
});
