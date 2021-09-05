import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-restart',
  templateUrl: './restart.component.html',
  styleUrls: ['./restart.component.scss'],
})
export class RestartComponent {
  constructor(
    public dialogRef: MatDialogRef<RestartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  startNewGame(operation: string): void {
    this.dialogRef.close(operation);
  }

  getPlayerValue(value: string, winner: boolean): any {
    const player = this.data.players.find((p: any) => p.turn === winner);

    return value === 'name' ? player.name : player.points;
  }
}
