import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-number-of-players',
  templateUrl: './number-of-players.component.html',
  styleUrls: ['./number-of-players.component.scss'],
})
export class NumberOfPlayersComponent {
  genderOption = '';

  constructor(public dialogRef: MatDialogRef<NumberOfPlayersComponent>) {}

  choiceGender(gender: string): void {
    this.dialogRef.close({ gender });
  }
}
