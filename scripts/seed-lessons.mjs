/**
 * Uploads lesson Markdown from content/<courseId>/NN.md to Firestore at
 * courses/<courseId>/lessons/<NN>.
 *
 * Signs in with an admin account, because Security Rules only let admins write
 * lesson documents. Credentials come from the environment so they are never
 * stored in the repo:
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... node scripts/seed-lessons.mjs rxjs
 *
 * Lessons listed in FREE_LESSONS are marked free:true and are readable by
 * anyone. Everything else needs a granted account.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC6bQLdofUSBk4uGbPF0t28rxrW0fUFqpc',
  authDomain: 'courses-cd807.firebaseapp.com',
  projectId: 'courses-cd807',
  storageBucket: 'courses-cd807.firebasestorage.app',
  messagingSenderId: '338540305062',
  appId: '1:338540305062:web:70299620c4b20068b17267',
};

/** Lesson numbers that stay readable without payment, per course. */
const FREE_LESSONS = {
  rxjs: [1, 2, 3],
  angular: [1],
};

const courseId = process.argv[2];
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!courseId) {
  console.error('usage: node scripts/seed-lessons.mjs <courseId>');
  process.exit(1);
}
if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const contentDir = join(here, '..', 'content', courseId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

await signInWithEmailAndPassword(auth, email, password);
console.log(`signed in as ${email}`);

const files = (await readdir(contentDir))
  .filter(name => name.endsWith('.md'))
  .sort();

if (!files.length) {
  console.error(`no .md files in ${contentDir}`);
  process.exit(1);
}

const free = FREE_LESSONS[courseId] ?? [];

for (const file of files) {
  const num = Number(file.replace('.md', ''));
  if (!Number.isInteger(num)) {
    console.warn(`skipping ${file} — name must be the lesson number, e.g. 01.md`);
    continue;
  }

  const body = await readFile(join(contentDir, file), 'utf8');
  await setDoc(doc(db, 'courses', courseId, 'lessons', String(num)), {
    num,
    free: free.includes(num),
    body,
    updatedAt: new Date().toISOString(),
  });

  console.log(`  ${courseId}/${num} — ${free.includes(num) ? 'free' : 'paid'} — ${body.length} chars`);
}

console.log('done');
process.exit(0);
