import { Component, OnInit, computed, inject, signal } from '@angular/core'; 
 
import { StaffMember } from '../../models/staff.model'; 
import { StaffService } from '../../services/staff.service'; 
type SortMode = 'featured' | 'name';

@Component({ 
  selector: 'app-staff-page', 
  templateUrl: './staff-page.html', 
  styleUrl: './staff-page.css', 
}) 
export class StaffPage implements OnInit { 
  private readonly staffService = inject(StaffService); 
 
  protected readonly staff = signal<StaffMember[]>([]); 
  protected readonly loading = signal(true); 
  protected readonly errorMessage = signal(''); 
   protected readonly searchText = signal(''); 
  protected readonly selectedDepartment = signal('all'); 
  protected readonly sortBy = signal<SortMode>('featured'); 
  
  ngOnInit(): void { 
    this.staffService.getStaff().subscribe({ 
      next: (data) => { 
        this.staff.set(data); 
        this.loading.set(false); 
      }, 
      error: () => { 
        this.errorMessage.set('We could not load the staff list. Please try again.'); 
        this.loading.set(false); 
      }, 
    }); 
  } 
} 