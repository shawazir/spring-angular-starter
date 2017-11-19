import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {environment} from '../environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	constructor(private httpClient: HttpClient) { }

	serverResponse: string;

	ngOnInit(): void {
		// Make the HTTP request:
		this.httpClient.get(environment.API_ROOT_URL + '/cache/faqs').subscribe(data => {
			// Read the result field from the JSON response.
			this.serverResponse = data + '';
		});
	}

	// title = 'app';
}
