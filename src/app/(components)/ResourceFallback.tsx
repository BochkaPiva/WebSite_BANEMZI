"use client";
import { useEffect, useState } from 'react';

export default function ResourceFallback() {
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    // Проверяем загрузку критических ресурсов
    const checkResources = async () => {
      try {
        // Проверяем загрузку CSS
        const cssResponse = await fetch('/_next/static/css/app/layout.css', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (!cssResponse.ok) {
          setFallbackMode(true);
          return;
        }

        // Проверяем загрузку JS
        const jsResponse = await fetch('/_next/static/chunks/main.js', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (!jsResponse.ok) {
          setFallbackMode(true);
        }
      } catch (error) {
        console.warn('Resource loading failed, enabling fallback mode');
        setFallbackMode(true);
      }
    };

    // Проверяем через 2 секунды
    const timer = setTimeout(checkResources, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!fallbackMode) return null;

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">BANEMZI</h1>
        <p className="mb-4">Проблемы с загрузкой ресурсов</p>
        <div className="space-y-2 text-sm">
          <p>Попробуйте:</p>
          <ul className="text-left">
            <li>• Очистить кэш браузера (Ctrl+Shift+Delete)</li>
            <li>• Использовать VPN</li>
            <li>• Перезагрузить страницу</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Перезагрузить
        </button>
      </div>
    </div>
  );
}
