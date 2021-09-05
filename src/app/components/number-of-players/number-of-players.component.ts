import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-number-of-players',
  templateUrl: './number-of-players.component.html',
  styleUrls: ['./number-of-players.component.scss'],
})
export class NumberOfPlayersComponent {
  setPlayerNames = false;

  namesForm = new FormGroup({
    firstPlayerName: new FormControl('', Validators.required),
    secondPlayerName: new FormControl('', Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<NumberOfPlayersComponent>) {}

  choicePlayers(numbers: number): void {
    const playerNames = [];
    if (this.setPlayerNames) {
      playerNames.push(this.namesForm.get('firstPlayerName').value);
      playerNames.push(this.namesForm.get('secondPlayerName').value);
    }

    const resp = { numbers: numbers, names: playerNames };

    this.dialogRef.close(resp);
  }
}
