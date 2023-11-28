"use strict";
const storage = localStorage;

const table = document.querySelector("table");
const todo = document.getElementById("todo");
const priority = document.querySelector("select");
const deadline = document.querySelector('input[type="date"]');
const submit = document.getElementById("submit");

let list = [];

document.addEventListener("DOMContentLoaded", () => {
  //ストレージデータの読み込み
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  //JSONをオブジェクトの配列に変換して配列listに代入する
  list = JSON.parse(json);
  for (const item of list) {
    addItem(item);
  }
});

const addItem = (item) => {
  const tr = document.createElement("tr");

  //完了チェックボックスを追加する
  for (const prop in item) {
    const td = document.createElement("td");
    if (prop == "done") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener("change", checkBoxListener);
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }
  table.append(tr);
};

const checkBoxListener = (ev) => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  const currentTr = ev.currentTarget.parentElement.parentElement;
  const idx = trList.indexOf(currentTr) - 1;
  list[idx].done = ev.currentTarget.checked;
  storage.todoList = JSON.stringify(list);
};
const check = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
const today = new Date();
console.log(today.toLocaleDateString());

submit.addEventListener("click", () => {
  const item = {
    todo: todo.value,
    priority: priority.value,
    deadline: deadline.value,
    done: false,
  };
  if (deadline.value == "") {
    window.alert("期日を入力してください");
    return;
  }
  if (todo.value.length > 20) {
    window.alert("文字数か多すぎます");
    return;
  }
  if (todo.value == "") {
    window.alert("タスクを入力してください");
    return;
  }
  if (check(new Date(deadline.value))) {
    window.alert("日付が過去になっています");
    return;
  }
  console.log(new Date()); // Thu Oct 13 2022 09:51:22 GMT+0900 (日本標準時)

  console.log(check(new Date()));

  console.log(check(new Date("2022-10-14")));

  console.log(check(new Date("2022-10-12")));
  item.done = false;

  todo.value = "";
  priority.value = "普";
  deadline.value = "";

  addItem(item);
  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const filterButton = document.createElement("button");
filterButton.textContent = "優先度(高)で絞り込み";
filterButton.id = "priority"; //cssでの装飾用に
const main = document.querySelector("main");
main.appendChild(filterButton);

filterButton.addEventListener("click", () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
  for (const item of list) {
    if (item.priority == "高") {
      addItem(item);
    }
  }
});

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除";
remove.id = "remove"; //css装飾用
const br = document.createElement("br"); //改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener("click", () => {
  clearTable();
  // 1. 未完了のTODOを抽出して定数listを置き換え
  list = list.filter((item) => item.done == false);
  // 2. TODOデータをテーブルに追加
  for (const item of list) {
    addItem(item);
  }
  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
});
