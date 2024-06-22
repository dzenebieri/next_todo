import React, { useState } from 'react';
import {
  deleteTodoOnBackend,
  editIsChecked,
  editTodoOnBackend,
  createTodoOnBackend,
} from '@/services/data';

export default function TodoSia({ todosList, setTodosList, reloadTodosList }) {
  const [newTask, setNewTask] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkedTodos, setCheckedTodos] = useState([]);

  async function handleAddTodo() {
    if (newTask.trim()) {
      setLoading(true);
      await createTodoOnBackend(newTask);
      setNewTask('');
      await reloadTodosList();
      setLoading(false);
    }
  }

  async function deleteTodo(todoId) {
    setLoading(true);
    await deleteTodoOnBackend(todoId);
    await reloadTodosList();
    setLoading(false);
  }

  async function handleCheckboxClick(isChecked, todoId) {
    setLoading(true);
    await editIsChecked(todoId, isChecked);

    if (isChecked) {
      setCheckedTodos([...checkedTodos, todoId]);
    } else {
      setCheckedTodos(checkedTodos.filter((id) => id !== todoId));
    }

    await reloadTodosList();
    setLoading(false);
  }

  async function handleEdit(todoId) {
    if (editTask.trim()) {
      setLoading(true);
      await editTodoOnBackend(todoId, editTask);
      setEditMode(null);
      setEditTask('');
      await reloadTodosList();
      setLoading(false);
    }
  }

  function handleEditClick(todo) {
    setEditMode(todo._id);
    setEditTask(todo.task);
  }

  const uncheckedTodos = todosList.filter(
    (todo) => !checkedTodos.includes(todo._id)
  );

  return (
    <div className='todoList'>
      <div className='addTodo'>
        <input
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder='Enter todo here'
        />
        <button onClick={handleAddTodo} disabled={loading}>
          {loading ? 'Adding...' : 'Submit'}
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        uncheckedTodos.map((todo) => (
          <div className='todoItem' key={todo._id}>
            <div className='todoCheckbox'>
              <input
                checked={checkedTodos.includes(todo._id)}
                onChange={(event) =>
                  handleCheckboxClick(event.target.checked, todo._id)
                }
                type='checkbox'
              />
            </div>
            <div className='todoName'>
              {editMode === todo._id ? (
                <input
                  type='text'
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
              ) : (
                todo.task
              )}
            </div>
            <div className='actions'>
              {editMode === todo._id ? (
                <span className='btnSave' onClick={() => handleEdit(todo._id)}>
                  Save
                </span>
              ) : (
                <span className='btnEdit' onClick={() => handleEditClick(todo)}>
                  Edit
                </span>
              )}
              <span className='btnDelete' onClick={() => deleteTodo(todo._id)}>
                Delete
              </span>
            </div>
          </div>
        ))
      )}
      {checkedTodos.length > 0 && (
        <div className='checkedTodos'>
          <h2>Checked Todos:</h2>
          {checkedTodos.map((todoId) => {
            const checkedTodo = todosList.find((todo) => todo._id === todoId);
            return (
              <div key={todoId}>
                <p>{checkedTodo ? checkedTodo.task : 'Todo not found'}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
