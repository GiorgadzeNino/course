import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Granted manually after payment is confirmed. Enforced by Security Rules. */
  hasFullAccess: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  /** The signed-in Firebase user, or null. */
  readonly user$: Observable<User | null> = authState(this.auth);

  /** The user's profile document, or null when signed out. */
  readonly appUser$: Observable<AppUser | null> = this.user$.pipe(
    switchMap(user => user
      ? docData(doc(this.firestore, 'users', user.uid)) as Observable<AppUser | undefined>
      : of(undefined)),
    map(profile => profile ?? null)
  );

  readonly isAdmin$: Observable<boolean> = this.user$.pipe(
    switchMap(user => user
      ? docData(doc(this.firestore, 'admins', user.uid)) as Observable<unknown>
      : of(undefined)),
    map(adminDoc => !!adminDoc)
  );

  async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(credential.user, { displayName });

    const profile: AppUser = {
      uid: credential.user.uid,
      email,
      firstName,
      lastName,
      hasFullAccess: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(this.firestore, 'users', credential.user.uid), profile);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
