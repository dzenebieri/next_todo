import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  deleteTodoOnBackend,
  editIsChecked,
  editTodoOnBackend,
  createTodoOnBackend,
} from '@/services/data';

export default function TodoSia({ todosList, setTodosList, reloadTodosList }) {
  const router = useRouter();
  const [newTask, setNewTask] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [loading, setLoading] = useState(false);

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
        todosList.map((todo) => (
          <div className='todoItem' key={todo._id}>
            <div className='todoCheckbox'>
              <input
                checked={todo.completed}
                onChange={(event) =>
                  handleCheckboxClick(event.target.checked, todo._id)
                }
                type='checkbox'
                onClick={() => router.push('/checkedTodos')} // + - Redirect todos to checkedTodos URL
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
    </div>
  );
}
