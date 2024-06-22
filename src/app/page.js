'use client';

import './main.css';
import TodoSia from '../komponentebi/TodoSia';
import { useState, useEffect } from 'react';
import { getTodosFromBackend } from '@/services/data';

export default function Home() {
  const [todosList, setTodosList] = useState([]);

  async function reloadTodosList() {
    const todos = await getTodosFromBackend();
    setTodosList(todos);
  }

  useEffect(() => {
    reloadTodosList();
  }, []);

  return (
    <div className='container'>
      <div className='todoApp'>
        <div className='todoHeader'>
          Todos (<span className='todosCount'>{todosList.length}</span>){' '}
        </div>
        <div className='todoBody'>
          <TodoSia
            todosList={todosList}
            setTodosList={setTodosList}
            reloadTodosList={reloadTodosList}
          />
        </div>
      </div>
    </div>
  );
}
