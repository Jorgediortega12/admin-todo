'use client'
import { useSession } from 'next-auth/react'; 

export default function ProfilePage() {

  const { data: session } = useSession(); 

  return (
    <div>
      <h1 className='mb-1'>Page Profile</h1>
      <hr className='mb-2' />
      <div className='flex flex-col gap-1 capitalize'>
        <span>{session?.user?.name}</span>
        <span>{session?.user?.email}</span>
        <span>{session?.user?.image}</span>
        <span>{session?.user?.id ?? 'NO-UUID'}</span>
        <span>{session?.user?.roles?.join(',') ?? ['No-role']}</span>
      </div>
    </div>
  );
}