import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pollution } from '../model/pollution.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PollutionService } from '../service/pollution';
import { DataStore } from '../data/datastore';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrls: ['./pollution-form.css']
})
export class PollutionFormComponent implements OnInit {
  // On n'utilise plus @Output car on est une page routée
  types = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

  form: FormGroup;
  today: string;
  isEditMode = false;
  pollutionId: number | null = null;
  loading = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private dataStore: DataStore,
    private pollutionService: PollutionService
  ) {
    this.today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      dateObservation: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.pattern(/^[-+]?\d+(\.\d+)?$/), Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.pattern(/^[-+]?\d+(\.\d+)?$/), Validators.min(-180), Validators.max(180)]],
      photoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.pollutionId = +params['id'];
        this.loadPollution(this.pollutionId);
      }
    });
  }

  loadPollution(id: number): void {
    this.loading = true;
    this.pollutionService.getPollutionById(id).subscribe({
      next: (p) => {
        this.form.patchValue({
          titre: p.titre,
          type: p.type,
          description: p.description,
          dateObservation: p.dateObservation,
          lieu: p.lieu,
          latitude: p.latitude,
          longitude: p.longitude,
          photoUrl: p.photoUrl
        });
        
        // If there's a Base64 image, show preview
        if (p.photoUrl && p.photoUrl.startsWith('data:image')) {
          this.imagePreview = p.photoUrl;
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pollution', err);
        this.router.navigate(['/pollutions']);
        this.loading = false;
      }
    });
  }

  get formControls() {
    return this.form.controls;
  }

  submitDeclaration(): void {
    if (!this.form) { return; }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: Pollution = {
      titre: (value.titre || '').trim(),
      type: value.type,
      description: (value.description || '').trim(),
      dateObservation: value.dateObservation,
      lieu: (value.lieu || '').trim(),
      latitude: Number(value.latitude),
      longitude: Number(value.longitude),
      photoUrl: value.photoUrl ? value.photoUrl.trim() : undefined
    };

    if (this.isEditMode && this.pollutionId) {
      this.dataStore.updatePollution(this.pollutionId, payload).subscribe({
        next: () => {
          console.log('Pollution mise à jour');
          this.router.navigate(['/pollutions', this.pollutionId]);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.dataStore.addPollution(payload).subscribe({
        next: () => {
          console.log('Pollution créée avec succès via NGXS');
          this.router.navigate(['/pollutions']);
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          alert('Erreur lors de l\'enregistrement de la pollution');
        }
      });
    }
  }

  onGoToList(): void {
    this.router.navigate(['/pollutions']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Validate file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop grande (max 5MB)');
        return;
      }

      this.selectedFile = file;
      this.compressAndPreviewImage(file);
    }
  }

  private compressAndPreviewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Compress image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate new dimensions (max 1200px width/height)
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Base64 with compression (quality 0.7)
        const base64String = canvas.toDataURL('image/jpeg', 0.7);
        this.imagePreview = base64String;
        this.form.patchValue({ photoUrl: base64String });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.form.patchValue({ photoUrl: '' });
  }
}
