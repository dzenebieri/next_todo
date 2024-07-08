import { ObjectId } from 'mongodb';
import { todos } from '@/services/mongo';

export async function POST(req, { params }) {
  const { todoId } = params; // Extract todoId from the URL parameters

  if (!todoId) {
    return new Response(JSON.stringify({ error: 'Todo ID is required' }));
  }

  const { task, completed } = await req.json(); // Extract task and completion state from the request body

  const updateData = {};
  if (task !== undefined) {
    updateData.task = task;
  }
  if (completed !== undefined) {
    updateData.completed = completed;
  }

  const result = await todos.updateOne(
    { _id: new ObjectId(todoId) },
    { $set: updateData }
  );

  return new Response(JSON.stringify({ message: 'Todo updated successfully' }));
}
