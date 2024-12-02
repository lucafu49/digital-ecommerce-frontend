import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesCrudComponent } from './packages-crud.component';

describe('PackagesCrudComponent', () => {
  let component: PackagesCrudComponent;
  let fixture: ComponentFixture<PackagesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
