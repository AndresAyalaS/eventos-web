import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { AppAlertDialogComponent } from './app-alert-dialog';

describe('AppAlertDialog', () => {
  let component: AppAlertDialogComponent;
  let fixture: ComponentFixture<AppAlertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAlertDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Aviso', message: 'Mensaje', type: 'info' } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppAlertDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
