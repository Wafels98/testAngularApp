import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-todo-list-item',
  imports: [CommonModule, MatCheckboxModule, MatButtonModule, MatInputModule, FormsModule, MatListItem],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.css'
})
export class TodoListItem {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();
  @Output() update = new EventEmitter<Todo>();

  editing = false;
  editText = '';

  startEdit() {
    this.editing = true;
    this.editText = this.todo.todo;
  }

  saveEdit() {
    this.editing = false;
    const updatedTodo = { ...this.todo, todo: this.editText };
    this.update.emit(updatedTodo);
  }
}
