import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface Todo {
      id: string;
      text: string;
      completed: boolean;
}

let todos: Todo[] = [];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// GET /todos - List all todos
app.get('/todos', (req: Request, res: Response) => {
      res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', (req: Request, res: Response) => {
      const { text } = req.body;
      if (!text) {
            return res.status(400).json({ error: 'Text is required' });
      }
      const newTodo: Todo = {
            id: generateId(),
            text,
            completed: false,
      };
      todos.push(newTodo);
      res.status(201).json(newTodo);
});

// PUT /todos/:id - Toggle completion
app.put('/todos/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
      }
      // Toggle completed status unless specifically provided in body
      if (req.body.completed !== undefined) {
            todo.completed = req.body.completed;
      } else {
            todo.completed = !todo.completed;
      }
      res.json(todo);
});

// DELETE /todos/:id - Remove a todo
app.delete('/todos/:id', (req: Request, res: Response) => {
      const { id } = req.params;
      const initialLength = todos.length;
      todos = todos.filter((t) => t.id !== id);

      if (todos.length === initialLength) {
            return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(204).send();
});

app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
});
