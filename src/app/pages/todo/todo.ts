import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http-service';
import { LoginService } from '../../services/login-service';
import { Todo } from '../../models/todo.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { TodoListItem } from '../../components/todo-list-item/todo-list-item';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    TodoListItem
  ]
})
export class TodoPage implements OnInit {

  todoList: WritableSignal<Todo[]> = signal<Todo[]>([]);
  todoInput = new FormControl('');

  constructor(private http: HttpService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.http.get<{ todos: Todo[] }>('todos').subscribe({
      next: (data) => this.todoList.set(data.todos),
      error: (err) => console.error(err)
    });
  }

  addTodo(): void {
    if (!this.todoInput.value) return;

    const newTodo = {
      todo: this.todoInput.value,
      completed: false,
      userId: this.loginService.currentUser.id
    };

    this.http.post<{ todo: Todo }>('todos/add', newTodo).subscribe({
      next: (res) => {
        this.todoList.set([...this.todoList(), res.todo]);
        this.todoInput.reset();
      },
      error: (err) => console.error('Fehler beim Hinzufügen:', err)
    });
  }

  // Update Todo (allgemein, z.B. für Edit-Funktion)
  updateTodo(updatedTodo: Todo): void {
    this.http.put(`todos/${updatedTodo.id}`, updatedTodo).subscribe({
      next: () => {
        this.todoList.set(
          this.todoList().map(t => t.id === updatedTodo.id ? updatedTodo : t)
        );
      },
      error: (err) => console.error('Fehler beim Aktualisieren:', err)
    });
  }

  // Toggle abgeschlossen / nicht abgeschlossen
  checkTodo(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.updateTodo(updatedTodo);
  }

  deleteTodo(todo: Todo): void {
    this.http.delete(`todos/${todo.id}`).subscribe({
      next: () => {
        this.todoList.set(this.todoList().filter(t => t.id !== todo.id));
      },
      error: (err) => console.error(err)
    });
  }
}
