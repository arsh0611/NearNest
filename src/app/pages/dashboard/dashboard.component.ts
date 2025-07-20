import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  people = [
    { name: 'Alice Smith', location: 'Downtown' },
    { name: 'Bob Johnson', location: 'Suburb' },
    { name: 'Charlie Rose', location: 'Uptown' },
    { name: 'Dana Lee', location: 'City Center' }
  ];
}
