import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { VisualDemoComponent } from './lib/demo/visual-demo.component.js';
import './styles.css';

bootstrapApplication(VisualDemoComponent, {
  providers: [provideAnimations(), provideHttpClient()]
}).catch((err) => console.error(err));
