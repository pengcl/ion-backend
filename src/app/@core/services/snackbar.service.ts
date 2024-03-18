import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  show(content: any, time?: any, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition): void {
    this.snackBar.open(content, '关闭', {
      duration: time ? time : 1000,
      horizontalPosition: horizontalPosition ? horizontalPosition : 'right',
      verticalPosition: verticalPosition ? verticalPosition : 'top',
    });
  }
}
