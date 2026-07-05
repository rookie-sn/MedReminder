import checkIcon from '../assets/check.png'
import trashIcon from '../assets/trash.png'

const formatLocalDate = (dateStr) => {
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const localDate = new Date(parts[0], parts[1] - 1, parts[2])
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
      return localDate.toLocaleDateString(undefined, options)
    }
    return dateStr
  } catch (e) {
    return dateStr
  }}

export default function ReminderList({ meds, onToggleTaken, onDelete }) {
  const sortedMeds = [...meds].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
  const groupedByDate = sortedMeds.reduce((groups, med) => {
    const key = med.date
    if (!groups[key]) {
        groups[key] = []}
    groups[key].push(med)
    return groups
  }, {})
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Reminders</h2>
      {meds.length === 0 ? ( //if null or empty
        <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500 font-medium">All clear! No reminders set.</p>
          <p className="text-xs text-slate-400 mt-0.5">Use the form above to add one.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {Object.entries(groupedByDate).map(([date, dateMeds]) => (
            <div key={date} className="space-y-2">
              <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 select-none">
                <span>📅</span> {formatLocalDate(date)}
              </div>
           <div className="space-y-2">
                {dateMeds.map((med) => (<div key={med.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${med.taken
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800': 'bg-slate-50 border-slate-100 hover:border-indigo-100'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <button type="button" onClick={() => onToggleTaken(med.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all active:scale-90 flex-shrink-0 overflow-hidden cursor-pointer ${med.taken
                         ? 'border-emerald-500' : 'border-slate-300 hover:border-indigo-500'}`}>
                        {med.taken ? ( <img src={checkIcon} alt="Checked" className="w-full h-full object-cover" /> ) : null}
                      </button>
                      <div className="truncate">
                        <p className={`text-sm font-semibold truncate ${med.taken ? 'line-through opacity-60' : 'text-slate-700'}`}>
                          {med.name}</p> 
                        <div className={`text-[11px] ${med.taken ? 'text-emerald-600 opacity-80' : 'text-slate-400'} flex items-center gap-1 mt-0.5`}>
                          <span>⏰ {med.time}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${med.taken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {med.taken ? 'Taken' : 'Pending'} </span>
                      <button type="button"  onClick={() => onDelete(med.id)} className="hover:bg-rose-50 p-1.5 rounded-xl transition-all cursor-pointer"  title="Delete Reminder">  
                        <img src={trashIcon} alt="Delete" className="w-5 h-5 object-contain" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


