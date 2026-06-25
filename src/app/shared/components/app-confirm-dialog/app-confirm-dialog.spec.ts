import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { AppConfirmDialogComponent } from './app-confirm-dialog';

describe('AppConfirmDialog', () => {
  let component: AppConfirmDialogComponent;
  let fixture: ComponentFixture<AppConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Confirmar', message: 'Seguro?' } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppConfirmDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
