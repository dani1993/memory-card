import { Component, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('turnCard', [
      state(
        'covered',
        style({
          transform: 'none',
        })
      ),
      state(
        'uncovered',
        style({
          transform: 'perspective(600px) rotateY(180deg)',
        })
      ),
      transition('covered => uncovered', [animate('400ms')]),
      transition('uncovered => covered', [animate('400ms')]),
    ]),
  ],
})
export class CardComponent {
  @Input() card: any;
}
