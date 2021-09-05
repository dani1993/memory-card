import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NumberOfPlayersComponent } from './components/number-of-players/number-of-players.component';
import { RestartComponent } from './components/restart/restart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  gameStarted = false;
  cards = ['dog', 'cat', 'lion', 'hawk', 'dolphin', 'zebra'];

  rotatedCards = [];
  gameCards = [];
  matchCount = 0;
  timer: any;

  numberOfPlayers: number;

  players: { points: number; name: string; turn: boolean }[] = [
    { points: 0, name: '', turn: true },
    { points: 0, name: '', turn: false },
  ];

  constructor(private dialog: MatDialog) {}

  choiceNumberOfPlayers(): void {
    const ref = this.dialog.open(NumberOfPlayersComponent, {
      autoFocus: false,
    });

    ref
      .afterClosed()
      .subscribe((resp: { numbers: number; names: string[] }) => {
        if (resp) {
          this.numberOfPlayers = resp.numbers;

          // tolgo la carta aggiunta per i due giocatori
          this.cards = this.cards.filter((card) => card !== 'jolly');

          // se i giocatori sono due, aggiungo una coppia di carte per scongiurare il rischio di pareggio
          if (resp.numbers > 1) {
            this.players[0].name = resp.names[0];
            this.players[1].name = resp.names[1];

            this.cards.push('jolly');
          }

          this.initGame();
        }
      });
  }

  getPlayerInTurn() {
    const playerInTurn = this.players.findIndex((p) => p.turn);

    return this.players[playerInTurn].name;
  }

  private initGame(): void {
    this.gameStarted = true;
    this.gameCards = [];
    this.matchCount = 0;

    this.players = [
      { points: 0, name: this.players[0].name, turn: true },
      { points: 0, name: this.players[1].name, turn: false },
    ];

    this.cards.forEach((card) => {
      const c = {
        image: card,
        condition: 'covered',
      };

      this.gameCards.push({ ...c });
      this.gameCards.push({ ...c });
    });

    this.gameCards = this.shuffle(this.gameCards);
  }

  // Metodo per mescolare le carte, scorre tutte le carte dall'ultima alla prima
  // invertendo volta per volta l'elemento in posizione i con l'elemento in posizione j (randomica)
  private shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  clickCard(index: number) {
    const card = this.gameCards[index];

    if (card.condition === 'covered' && this.rotatedCards.length < 2) {
      this.matchCount++;

      card.condition = 'uncovered';
      this.rotatedCards.push(card);

      if (this.rotatedCards.length > 1) {
        this.matchCards();
      }
    } else if (this.rotatedCards.length === 2 && this.timer) {
      clearTimeout(this.timer);

      this.recoverCards();
    }
  }

  private recoverCards(): void {
    if (this.rotatedCards[0].image !== this.rotatedCards[1].image) {
      this.rotatedCards[0].condition = 'covered';
      this.rotatedCards[1].condition = 'covered';
    }

    if (
      this.numberOfPlayers === 2 &&
      this.rotatedCards[0].image !== this.rotatedCards[1].image
    ) {
      this.players[0].turn = !this.players[0].turn;
      this.players[1].turn = !this.players[1].turn;
    }

    this.rotatedCards = [];
  }

  private matchCards(): void {
    const timeout =
      this.rotatedCards[0].image !== this.rotatedCards[1].image ? 5000 : 0;

    if (
      this.numberOfPlayers === 2 &&
      this.rotatedCards[0].image === this.rotatedCards[1].image
    ) {
      const playerTurn = this.players.findIndex((player) => player.turn);
      this.players[playerTurn].points++;
    }

    this.timer = setTimeout(() => {
      this.recoverCards();

      const covered = this.gameCards.find((c) => c.condition === 'covered');

      if (!covered) {
        const ref = this.dialog.open(RestartComponent, {
          data: {
            matchCount: this.matchCount,
            numberOfPlayers: this.numberOfPlayers,
            players: this.players,
          },
          disableClose: true,
          autoFocus: false,
        });

        ref.afterClosed().subscribe((resp: string) => {
          if (resp === 'new') {
            this.initGame();
          } else if (resp === 'finish') {
            this.gameStarted = false;
          }
        });
      }
    }, timeout);
  }
}
