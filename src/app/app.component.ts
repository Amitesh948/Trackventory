import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { ProductModule } from './modules/product/product.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AuthModule,CoreModule,ProductModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'userAuth-system';
}
