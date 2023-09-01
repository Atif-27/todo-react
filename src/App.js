import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from './useLocalStorage';

export default function App() {
  // const [todoList, setTodoList] = useState(function () {
  //   const todo = localStorage.getItem('todoList');
  //   return JSON.parse(todo);
  // });
  // useEffect(
  //   function () {
  //     localStorage.setItem('todoList', JSON.stringify(todoList));
  //   },
  //   [todoList]
  // );
  const [todoList, setTodoList] = useLocalStorage([], 'todoList');
  function insertHandler(newTodo) {
    setTodoList((todo) => [newTodo, ...todo]);
  }
  function deleteHandler(id) {
    setTodoList((todo) => todo.filter((el) => el.id !== id));
  }
  function toggleHandler(id) {
    setTodoList((todo) =>
      todo.map((el) => (el.id === id ? { ...el, status: !el.status } : el))
    );
  }
  return (
    <section className="todo-container">
      <Logo />
      <Form insertHandler={insertHandler} />
      <List
        itemList={todoList}
        setItemList={setTodoList}
        deleteHandler={deleteHandler}
        toggleHandler={toggleHandler}
      />
    </section>
  );
}

function Logo() {
  return <div className="logo">To-Do List 🚀</div>;
}

// !+++++++++FORM++++++++++++++
function Form({ insertHandler }) {
  // * SUBMIT HANDLER
  const [newTodo, setNewTodo] = useState('');
  function submitHandler(e) {
    e.preventDefault();
    const newList = { content: newTodo, id: Date.now(), status: false };
    insertHandler(newList);
    setNewTodo([]);
  }

  return (
    <div className="form">
      <form onSubmit={(e) => submitHandler(e)}>
        <input
          required
          type="text"
          placeholder="Add a todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        ></input>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

function List({ itemList, deleteHandler, toggleHandler, setItemList }) {
  const [sortValue, setSortValue] = useState('added');
  let tempList = itemList;
  if (sortValue === 'added') tempList = itemList;
  else if (sortValue === 'description') {
    tempList = itemList
      .slice()
      .sort((a, b) => a.content.localeCompare(b.content));
  } else if (sortValue === 'completed') {
    tempList = itemList.slice().sort((a, b) => a.status - b.status);
  }
  function handleClear() {
    const res = window.confirm('Are you sure?');
    res && setItemList([]);
  }
  return (
    <>
      {tempList.length === 0 ? (
        <span className="nothing">List is empty</span>
      ) : (
        <>
          <div className="option">
            <div className="icon"></div>
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="added">Sort by Added</option>
              <option value="description">Sort by Description</option>
              <option value="completed">Sort by Completed</option>
            </select>
            <button className="clear" onClick={handleClear}>
              Clear List
            </button>
          </div>
          <ul className="list">
            <AnimatePresence>
              {tempList.map((el) => (
                <motion.div
                  key={el.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Todo
                    key={el.id}
                    element={el}
                    deleteHandler={deleteHandler}
                    toggleHandler={toggleHandler}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </ul>
          <Data todoList={itemList} />
        </>
      )}
    </>
  );
}

function Todo({ element, deleteHandler, toggleHandler }) {
  return (
    <li
      className={element.status ? 'todo-item complete' : 'todo-item'}
      onClick={() => toggleHandler(element.id)}
    >
      <span>{element.content}</span>
      <button className="delete" onClick={() => deleteHandler(element.id)}>
        ❌
      </button>
    </li>
  );
}

function Data({ todoList }) {
  const total = todoList.length;
  const done = todoList.filter((el) => el.status).length;
  const percentage = (done / total) * 100;
  return (
    <div className="data">
      {done
        ? `${done} Tasks Done out of ${total} (${
            percentage.toFixed(1) % 1 === 0
              ? percentage.toFixed(0)
              : percentage.toFixed(1)
          }%)`
        : `Let's get some stuff done⚡`}
    </div>
  );
}
