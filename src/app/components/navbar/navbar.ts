import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { ChangeDetectionStrategy } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [Button, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.router.navigate(['/delete'])
    });

  }


  private router = inject(Router);

  navigateToPage(route: string ){
    this.router.navigate([route])
  }

  navigateToStart() {
    this.router.navigate(['/'])
  }

  navigateToAbout() {
    this.router.navigate(['/about'])
  }

  navigateToMap() {
    this.router.navigate(['/map'])
  }

}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);

}
