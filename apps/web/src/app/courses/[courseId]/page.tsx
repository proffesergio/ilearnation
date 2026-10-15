import { redirect, notFound } from 'next/navigation';
import { COURSE_ID } from '@/lib/course';
export default async function Course({ params }: { params: Promise<{ courseId: string }> }) {
  if ((await params).courseId !== COURSE_ID) notFound();
  redirect(`/courses/${COURSE_ID}/getting-started`);
}
