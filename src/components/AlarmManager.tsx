import { useState } from 'react';
import type { Alarm } from '../types';

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

interface Props {
  alarms: Alarm[];
  onAdd: (alarm: Omit<Alarm, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AlarmManager({ alarms, onAdd, onToggle, onDelete }: Props) {
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, true, true]);

  const toggleDay = (index: number) => {
    setDays((prev) => prev.map((d, i) => (i === index ? !d : d)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ time, label: label.trim() || 'Activación de energía', days, enabled: true });
    setLabel('');
  };

  return (
    <section className="panel">
      <h2>Alarmas</h2>
      <form className="alarm-form" onSubmit={handleSubmit}>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="day-picker">
          {DAY_LABELS.map((d, i) => (
            <button
              type="button"
              key={d + i}
              className={days[i] ? 'day active' : 'day'}
              onClick={() => toggleDay(i)}
            >
              {d}
            </button>
          ))}
        </div>
        <button type="submit" className="primary">Agregar alarma</button>
      </form>

      <ul className="alarm-list">
        {alarms.length === 0 && <li className="empty">Aún no tienes alarmas. Crea la primera.</li>}
        {alarms.map((alarm) => (
          <li key={alarm.id} className={alarm.enabled ? 'alarm-item' : 'alarm-item disabled'}>
            <div>
              <strong>{alarm.time}</strong>
              <span className="alarm-label">{alarm.label}</span>
              <div className="days-row">
                {DAY_LABELS.map((d, i) => (
                  <span key={d + i} className={alarm.days[i] ? 'day-chip on' : 'day-chip'}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div className="alarm-actions">
              <button onClick={() => onToggle(alarm.id)}>{alarm.enabled ? 'Pausar' : 'Activar'}</button>
              <button onClick={() => onDelete(alarm.id)} className="danger">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
