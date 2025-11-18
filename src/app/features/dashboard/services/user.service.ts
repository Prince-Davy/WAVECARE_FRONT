import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthTokenService } from "@app/features/auth/services/auth-token.service";
import { environment } from "@environments/environment";
import { Observable } from "rxjs";
import { Page } from "../models/page";
import { UserViewDTO } from "../models/user-view-dto";
import { UserDetailDTO } from "../models/user-detail-dto";
import { UserDetailUpdateDTO } from "../models/user-detail-update";

@Injectable({ providedIn: 'root' })
export class UserService {
	private readonly apiUrl = `${environment.apiUrl}/api`;
	private readonly apiUrlUsers = `${this.apiUrl}/users`;

	constructor(private http: HttpClient, private authTokenService: AuthTokenService) { }

	getUsers(
		page: number,
		size: number,
		listKeywords: string[],
		sortField?: string,
		sortDirection?: string): Observable<Page<UserViewDTO>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size);

		if (sortField && sortDirection) {
			params = params.set('sort', `${sortField},${sortDirection}`);
		}

		listKeywords.forEach(keyword => {
			params = params.append('listKeywords', keyword);
		});

		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});

		return this.http.get<Page<UserViewDTO>>(this.apiUrlUsers, { headers, params });
	}

	getUser(id: number): Observable<UserDetailDTO> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});

		return this.http.get<UserDetailDTO>(`${this.apiUrlUsers}/${id}`, { headers });
	}

	getUserRoles(): Observable<string[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});

		return this.http.get<string[]>(`${this.apiUrlUsers}/roles`, { headers });
	}

	updateUser(userDetailUpdateDTO: UserDetailUpdateDTO): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});
		return this.http.put<void>(`${this.apiUrlUsers}/${userDetailUpdateDTO.id}`, { lastName: userDetailUpdateDTO.lastName, firstName: userDetailUpdateDTO.firstName,role: userDetailUpdateDTO.role }, { headers });
	}
}
