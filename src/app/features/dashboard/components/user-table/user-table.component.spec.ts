import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserTableComponent } from './user-table.component';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';
import { UserViewDTO } from '../../models/user-view-dto';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { By } from '@angular/platform-browser';
import { Page } from '../../models/page';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {return of({});}
}

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers: UserViewDTO[] = [
    {
        id: "0",
        firstName: "Prénom 1",
        lastName: "Nom 1",
        email: "email1@email.com",
        role: "USER",
        locked: false,
        creationDate: new Date()
    },
    {
        id: "1",
        firstName: "Prénom 2",
        lastName: "Nom 2",
        email: "email2@email.com",
        role: "USER",
        locked: false,
        creationDate: new Date()
    }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    userServiceSpy.getUsers.and.returnValue(
      of({content: [], totalElements: 0, totalPages: 0, size: 10})
    )
    await TestBed.configureTestingModule({
      imports: [
        UserTableComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader}
        })
      ],
      providers: [{provide: UserService, useValue: userServiceSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche les colonnes attendues', () => {
    const expected = ["firstName", "lastName", "email", "role", "locked", "creationDate", "update", "delete"];
    expect(component.displayedColumns).toEqual(expected);
  })

  it('charge et affiche les utilisateurs dans la table', async () => {
    userServiceSpy.getUsers.and.returnValue(
      of({ content: mockUsers, totalElements: 2, totalPages: 1, size: 10})
    );

    component.ngAfterViewInit?.();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const table = await loader.getHarness(MatTableHarness);

    const text = await table.getCellTextByIndex();
    expect(text.length).toBe(2);
    expect(text[0].some(cell => cell.includes('Prénom 1'))).toBeTrue();
    expect(text[1].some(cell => cell.includes('Prénom 2'))).toBeTrue();
  })

  it('paginates with MatPaginatorHarness and recalls the service', fakeAsync(async () => {
    userServiceSpy.getUsers.and.returnValues(
      of({ content: mockUsers, totalElements: 20, totalPages: 10, size: 2 }), // page 0
      of({ content: mockUsers, totalElements: 20, totalPages: 10, size: 2 }) // page 1
    );

    component.pageSize = 2;
    component.pageSizeOptions = [2, 5, 10];
    component.ngAfterViewInit?.();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const paginator = await loader.getHarness(MatPaginatorHarness);

    expect(await paginator.getPageSize()).toBe(2);
    expect(await paginator.getRangeLabel()).toContain('1'); await paginator.goToNextPage();
    fixture.detectChanges();
    tick();

    expect(userServiceSpy.getUsers.calls.count()).toBeGreaterThanOrEqual(2);
  })); 

  /*it("affiche une erreur si pb avec le service", () => {

  })*/

  it("affiche correctement même si liste vide", async () => {
    userServiceSpy.getUsers.and.returnValue(
      of({content: [], totalElements: 0, totalPages: 10, size: 0})
    );
    fixture.detectChanges();
    await fixture.whenStable();

    // Vérifier si la table existe encore
    const table = fixture.debugElement.query(By.css('.mat-mdc-table'))
    expect(table).toBeTruthy();

    // Vérifier si la pagination indique bien '0 sur 0'
    const paginatorRange = fixture.debugElement.query(By.css('.mat-mdc-paginator-range-label')).nativeElement;
    expect(paginatorRange.textContent.trim()).toBe('0 of 0');
  })

  it("trie correctement les utilisateurs par colonne", async () => {
    userServiceSpy.getUsers.and.returnValue(
      of({content: mockUsers.reverse(), totalElements: 20, totalPages: 1, size: 20})
    );

    component.ngAfterViewInit?.();
    fixture.detectChanges();
    await fixture.whenStable();

    // Vérifier que le tableau a bien été rempli
    const rows = fixture.debugElement.queryAll(By.css('.mat-mdc-row'));
    expect(rows.length).toBeGreaterThan(0);



    const firstCellBefore = fixture.debugElement.query(By.css('.mat-mdc-row:first-child .mat-mdc-cell:first-child')).nativeElement.textContent.trim();

    const sortColumnArrow = fixture.debugElement.query(By.css('th.mat-sort-header'));
    sortColumnArrow.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    await fixture.whenStable();

    const firstCellAfter = fixture.debugElement.query(By.css('.mat-mdc-row:first-child .mat-mdc-cell:first-child')).nativeElement.textContent.trim();

    expect(firstCellBefore).not.toEqual(firstCellAfter);
  })

  it("change les données lors du changement de page", () => {
    userServiceSpy.getUsers.and.callFake(
      (page: number, size: number, listKeywords: string[]) : Observable<Page<UserViewDTO>> => {
        const start = page * size;
        const end = start + size;
        const pageContent = mockUsers.slice(start, end);
        return of({content: pageContent, totalElements: mockUsers.length, totalPages: Math.ceil(mockUsers.length / size), size: size})
      }
    )

    let resultPage0: any;
    userServiceSpy.getUsers(0, 1, []).subscribe(response => resultPage0 = response);
    expect(resultPage0.content.length).toBe(1);
    expect(resultPage0.content[0].id).toBe(mockUsers[0].id);

    let resultPage1: any;
    userServiceSpy.getUsers(1, 1, []).subscribe(response => resultPage1 = response);
    expect(resultPage1.content.length).toBe(1);
    expect(resultPage1.content[0].id).toBe(mockUsers[1].id);
  })
});
