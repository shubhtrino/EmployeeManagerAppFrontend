import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeeManagerApp';
  employees: Employee[];
  editEmployee: Employee;
  deleteEmp: Employee;

  ngOnInit() {
    this.getEmployees();
  }
  constructor(private employeeService: EmployeeService) { }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public openModal(employee: Employee, mode: string): void {
    const container = document.getElementById('mainContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'update') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmp = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

  addEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form').click();

    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  updateEmployee(employee: Employee): void {
    document.getElementById('edit-employee-form').click();

    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  searchEmployees(key: string): void {
    console.log(key)
    if (key === "") this.getEmployees();
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1
        || employee.email.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1
        || employee.phone.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1
        || employee.jobTitle.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
  }
}
