import { Component, computed, input,inject, signal } from '@angular/core'; 
import { RouterLink } from '@angular/router'; 
import { Student } from '../../models/student.model'; 
import { SavedService } from '../../services/saved.service';
@Component({ 
selector: 'app-student-card', 
imports: [RouterLink], 
templateUrl: './student-card.html', 
styleUrl: './student-card.css', 
}) 
export class StudentCard { 
readonly student = input.required<Student>(); 
// Did the portrait fail to load? 
private readonly imageFailed = signal(false); 
// The path actually shown: placeholder if the real image failed. 

protected readonly photoSrc = computed(() => 
this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo, 
); 
// Called by the template when the image cannot be loaded. 
protected onImageError(): void { 
this.imageFailed.set(true); 
}

private readonly saved = inject(SavedService); 
// Is THIS student saved? computed() re-runs when the service's list changes. 

protected readonly isSaved = computed(() => this.saved.isSaved(this.student().id)); 
protected onToggleSaved(event: Event): void { 
// The whole card is a link. Without these two lines, a click on the 
// heart would ALSO open the student's profile. 
event.preventDefault(); 
event.stopPropagation(); 
this.saved.toggle(this.student().id); 
} 
} 