import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-juridico-natural',
  templateUrl: './juridico-natural.component.html',
  styleUrls: ['./juridico-natural.component.scss']
})
export class JuridicoNaturalComponent implements OnInit {
  public natural = 1;
  public juridica = 2;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  public personaNatural(): void {
    console.log('Persona natural');
    this.router.navigate(['auth/login', this.natural]);
  }

  public personaJuridica(): void {
    console.log('Persona jurdicia');
    this.router.navigate(['auth/login', this.juridica]);
  }

}
