import { Service } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  AlertDialogData,
  AppAlertDialogComponent,
} from '../../shared/components/app-alert-dialog/app-alert-dialog';
import { firstValueFrom } from 'rxjs';
import { AppConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/app-confirm-dialog/app-confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly dialog = inject(MatDialog);

  open(data: AlertDialogData): void {
    this.dialog.open(AppAlertDialogComponent, {
      width: '420px',
      disableClose: true,
      data,
    });
  }

  success(title: string, message: string): void {
    this.open({
      title,
      message,
      type: 'success',
    });
  }

  error(title: string, message: string): void {
    this.open({
      title,
      message,
      type: 'error',
    });
  }

  warning(title: string, message: string): void {
    this.open({
      title,
      message,
      type: 'warning',
    });
  }

  info(title: string, message: string): void {
    this.open({
      title,
      message,
      type: 'info',
    });
  }

  async confirm(
    title: string,
    message: string,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
  ): Promise<boolean> {
    const dialogRef = this.dialog.open(AppConfirmDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        title,
        message,
        confirmText,
        cancelText,
      } satisfies ConfirmDialogData,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    return !!result;
  }
}
