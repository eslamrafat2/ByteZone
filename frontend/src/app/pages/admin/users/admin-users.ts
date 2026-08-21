import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminService, AdminUser } from '../../../services/admin.service';
@Component({selector:'app-admin-users',standalone:true,imports:[DatePipe],templateUrl:'./admin-users.html',styleUrl:'../admin-shared.css'})
export class AdminUsers{private readonly service=inject(AdminService);readonly users=signal<AdminUser[]>([]);readonly loading=signal(true);readonly error=signal('');constructor(){this.load()}load(){this.loading.set(true);this.service.getUsers().subscribe({next:u=>{this.users.set(u);this.loading.set(false)},error:e=>{this.error.set(e?.error?.message||'Unable to load users.');this.loading.set(false)}})}}
