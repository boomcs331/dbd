// app/page.tsx

import EventForm from './components/EventForm'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4"style={ { textAlign: 'center',color: '#24a2fa'}}>แบบฟอร์มสมาชิก</h1>
      <EventForm />
    </main>
  )
}
