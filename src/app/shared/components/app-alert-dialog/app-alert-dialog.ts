import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlertDialogData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-app-alert-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './app-alert-dialog.html',
  styleUrl: './app-alert-dialog.scss',
})
export class AppAlertDialogComponent {
   readonly dialogRef = inject(MatDialogRef<AppAlertDialogComponent>);
  readonly data = inject<AlertDialogData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'cancel';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }
}
