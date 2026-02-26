import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthTokenService } from "@app/features/auth/services/auth-token.service";

import { Observable } from "rxjs";
import { Page } from "../models/page";
import { UserViewDTO } from "../models/user-view-dto";
import { UserDetailDTO } from "../models/user-detail-dto";
import { UserDetailUpdateDTO } from "../models/user-detail-update";
import { UserFilters } from "../models/user-filters";
import { UserCreateDTO } from "../components/user-dialog/user-dialog.component";

@Injectable({ providedIn: 'root' })
export class UserService {

	private readonly apiUrlUsers = `/api/users`;

	constructor(private http: HttpClient, private authTokenService: AuthTokenService) { }

  getUsers(
	page: number,
	size: number,
	listKeywords: string[],
	sortField?: string,
	sortDirection?: string,
	filters?: UserFilters  ): Observable<Page<UserViewDTO>> {
  
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
  
    return this.http.get<Page<UserViewDTO>>(this.apiUrlUsers, { params });
  }


	/**
	 * Récupère les détails d'un utilisateur par son ID
	 * @param id ID de l'utilisateur
	 * @returns Observable<UserDetailDTO> Les détails de l'utilisateur
	 */
	getUser(id: number): Observable<UserDetailDTO> {
		return this.http.get<UserDetailDTO>(`${this.apiUrlUsers}/${id}`);
	}

	/**
	 * Récupère la liste des rôles utilisateurs
	 * @returns Observable<string[]> La liste des rôles utilisateurs
	 */
	getUserRoles(): Observable<string[]> {
	return this.http.get<string[]>(`${this.apiUrlUsers}/roles`);
	
	}

	/**
	 * Met à jour un utilisateur
	 * @param userDetailUpdateDTO les informations de l'utilisateur à mettre à jour
	 */
	updateUser(userDetailUpdateDTO: UserDetailUpdateDTO): Observable<void> {
		return this.http.put<void>(`${this.apiUrlUsers}/${userDetailUpdateDTO.id}`, { lastName: userDetailUpdateDTO.lastName, firstName: userDetailUpdateDTO.firstName, role: userDetailUpdateDTO.role, email: userDetailUpdateDTO.email });
	}


	/**
	 * Supprime un utilisateur par son ID
	 * @param userId ID de l'utilisateur à supprimer
	 */
	deleteUser(userId: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrlUsers}/${userId}`);
	}

	createUser(payload: UserCreateDTO): Observable<void> {
		return this.http.post<void>(this.apiUrlUsers, payload);
	}
}
