import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthTokenService } from "@app/features/auth/services/auth-token.service";

import { Observable } from "rxjs";
import { Page } from "../models/page";
import { UserViewDTO } from "../models/user-view-dto";
import { UserDetailDTO } from "../models/user-detail-dto";
import { UserDetailUpdateDTO } from "../models/user-detail-update";
import { AdvancedFilters } from "../components/search-bar/filters/advanced-filters.component";
import { UserFilters } from "../models/user-filters";

@Injectable({ providedIn: 'root' })
export class UserService {

	private readonly apiUrlUsers = `/api/users`;

	constructor(private http: HttpClient, private authTokenService: AuthTokenService) { }

  getUsers(
    page: number,
    size: number,
    sortField?: string,
    sortDirection?: string,
    filters?: UserFilters
  ): Observable<Page<UserViewDTO>> {
  
    const sort = sortField && sortDirection
      ? `${sortField},${sortDirection}`
      : null;
  
    const paramsObj: Record<string, string> = {
      page: String(page),
      size: String(size),
    };
  
    if (filters) {
      paramsObj['filter'] = JSON.stringify(filters);
    }
  
    if (sort) {
      paramsObj['sort'] = sort;
    }
  
    const params = new HttpParams({ fromObject: paramsObj });
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authTokenService.getToken()}`
    });
  
    return this.http.get<Page<UserViewDTO>>(this.apiUrlUsers, { headers, params });
  }


	/**
	 * Récupère les détails d'un utilisateur par son ID
	 * @param id ID de l'utilisateur
	 * @returns Observable<UserDetailDTO> Les détails de l'utilisateur
	 */
	getUser(id: number): Observable<UserDetailDTO> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});

		return this.http.get<UserDetailDTO>(`${this.apiUrlUsers}/${id}`, { headers });
	}

	/**
	 * Récupère la liste des rôles utilisateurs
	 * @returns Observable<string[]> La liste des rôles utilisateurs
	 */
	getUserRoles(): Observable<string[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});

		return this.http.get<string[]>(`${this.apiUrlUsers}/roles`, { headers });
	}

	/**
	 * Met à jour un utilisateur
	 * @param userDetailUpdateDTO les informations de l'utilisateur à mettre à jour
	 */
	updateUser(userDetailUpdateDTO: UserDetailUpdateDTO): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});
		return this.http.put<void>(`${this.apiUrlUsers}/${userDetailUpdateDTO.id}`, { lastName: userDetailUpdateDTO.lastName, firstName: userDetailUpdateDTO.firstName, role: userDetailUpdateDTO.role, email: userDetailUpdateDTO.email }, { headers });
	}


	/**
	 * Supprime un utilisateur par son ID
	 * @param userId ID de l'utilisateur à supprimer
	 */
	deleteUser(userId: string): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});
		return this.http.delete<void>(`${this.apiUrlUsers}/${userId}`, { headers });
	}

	createUser(payload: UserDetailUpdateDTO) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${this.authTokenService.getToken()}`
		});
		return this.http.post<void>(this.apiUrlUsers, payload, { headers });
	}
}
