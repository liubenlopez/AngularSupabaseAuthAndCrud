import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  isLoading$ = this.spinnerService.isLoading$;
  isLoadingText$ = this.spinnerService.isLoadingText$;
  spinnerVisible: boolean = false;
  spinnerText: string = "";

  constructor(private readonly spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.isLoading$.subscribe(resp => {
      this.spinnerVisible = resp;
    });
    this.isLoadingText$.subscribe(resp => {
      this.spinnerText = resp;
    });
  }
}
