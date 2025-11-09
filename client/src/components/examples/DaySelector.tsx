import { useState } from 'react';
import DaySelector from '../DaySelector';

export default function DaySelectorExample() {
  const [day, setDay] = useState<'friday' | 'saturday' | 'sunday'>('friday');
  
  return <DaySelector selectedDay={day} onSelectDay={setDay} />;
}
