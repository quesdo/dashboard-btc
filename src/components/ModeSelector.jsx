/**
 * Mode Selector Component
 * Toggle between Trading, Macro, and Both modes
 */
export default function ModeSelector({ mode, onModeChange }) {
  const modes = [
    { id: 'trading', label: 'Mode Trading', icon: '📊', desc: 'Court terme (1-7j)' },
    { id: 'macro', label: 'Mode Macro', icon: '🔮', desc: 'Moyen terme (1-3 mois)' },
    { id: 'both', label: 'Mode Complet', icon: '⚖️', desc: 'Vue d\'ensemble' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Sélectionner le mode d'analyse
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === m.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="text-4xl mb-2">{m.icon}</div>
            <div className={`font-bold text-lg mb-1 ${mode === m.id ? 'text-blue-600' : 'text-gray-800'}`}>
              {m.label}
            </div>
            <div className="text-sm text-gray-500">{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
