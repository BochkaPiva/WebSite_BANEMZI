export default function RussiaPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">BANEMZI</h1>
        <p className="text-xl mb-8">
          Если сайт загружается медленно, попробуйте:
        </p>
        <div className="space-y-4 text-left">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">1. Альтернативные домены:</h3>
            <ul className="space-y-1">
              <li>• banemzi.vercel.app</li>
              <li>• banemzi-git-master-bochkapivas-projects.vercel.app</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">2. Очистите кэш браузера:</h3>
            <p>Ctrl+Shift+Delete → Очистить данные</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">3. Попробуйте другой браузер:</h3>
            <p>Chrome, Firefox, Edge</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">4. Свяжитесь с нами:</h3>
            <p>Telegram: @banemzi_events</p>
          </div>
        </div>
        <a 
          href="/" 
          className="inline-block mt-8 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  );
}
