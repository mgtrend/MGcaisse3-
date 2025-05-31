/**
 * Landing Page moderne pour MGcaisse3.0
 * Présente l'application, ses fonctionnalités et ses limitations
 */

import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 mr-2">🧾</span>
              <h1 className="text-xl font-bold text-gray-900">MGcaisse 3.0</h1>
            </div>
            <div>
              <Link
                to="/app"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Accéder à l'application
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  Version 3.0
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">MGcaisse</span>
                  <span className="block text-indigo-600">Votre Caisse Enregistreuse PWA Locale</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Une application de gestion de caisse simple, rapide et fonctionnelle, optimisée pour les appareils mobiles et dotée d'une gestion intuitive des produits par icônes.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link
                  to="/app"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Tester l'application
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="/screenshot.png"
                    alt="Capture d'écran de MGcaisse 3.0"
                    onError={(e) => {
                      // Fallback si l'image n'existe pas
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15e5f69abb1%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15e5f69abb1%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EMGcaisse%203.0%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              MGcaisse 3.0 offre une expérience utilisateur optimisée et des fonctionnalités essentielles pour la gestion de votre caisse.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">🛒</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Gestion de Produits avec Icônes</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Identifiez facilement vos produits grâce aux icônes personnalisables. Une interface intuitive pour une gestion efficace.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">📱</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Optimisé pour Mobile</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Interface responsive adaptée aux smartphones et tablettes. Utilisez l'application efficacement sur tous vos appareils.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">🔄</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Mode Hors-ligne</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Fonctionne sans connexion internet grâce à la technologie PWA. Vos données sont stockées localement dans votre navigateur.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">🧮</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Calculs Automatiques</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Calcul automatique des totaux, sous-totaux et TVA. Générez des reçus détaillés pour vos clients.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">📦</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Gestion des Stocks</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Suivi des stocks en temps réel avec alertes pour les produits en quantité limitée.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <span className="text-white text-2xl">⚙️</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Administration Locale</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Gérez vos produits facilement avec l'interface d'administration intégrée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avertissement Limitations */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Important</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Limitations de cette Version
            </p>
          </div>

          <div className="mt-10 border border-red-200 rounded-lg bg-white p-6 shadow-sm">
            <div className="prose prose-red max-w-none">
              <p className="text-lg font-medium text-red-600">
                Cette application est une démonstration avec des limitations importantes :
              </p>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Authentification simulée et non sécurisée</strong> : L'accès administrateur n'est pas protégé par une véritable authentification sécurisée.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Stockage local uniquement</strong> : Toutes les données sont stockées dans le navigateur (IndexedDB) et peuvent être perdues si vous videz le cache ou les données du navigateur.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Pas de serveur central</strong> : Il n'y a pas de synchronisation entre appareils, pas de sauvegarde automatique, et pas de gestion multi-utilisateurs.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Paiements simulés</strong> : Les méthodes de paiement sont simulées et ne traitent pas de véritables transactions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Usage non commercial</strong> : Cette version ne convient pas à un usage commercial réel sans un développement backend complémentaire.</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-700">
                Pour une solution complète et sécurisée, un backend avec authentification réelle et stockage centralisé serait nécessaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section PWA */}
      <section className="py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Progressive Web App</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Installez l'application sur votre appareil
            </p>
          </div>

          <div className="mt-10 lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                MGcaisse 3.0 est une Progressive Web App (PWA) que vous pouvez installer sur votre appareil pour un accès rapide et une utilisation hors-ligne.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comment installer l'application :</h3>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Sur Chrome (Android/Desktop) : Cliquez sur le menu ⋮ puis "Installer l'application" ou "Ajouter à l'écran d'accueil"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Sur Safari (iOS) : Appuyez sur le bouton de partage puis "Sur l'écran d'accueil"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Une fois installée, l'application s'ouvrira comme une application native et fonctionnera même sans connexion internet</span>
                  </li>
                </ol>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-w-xs">
                <div className="text-center text-6xl mb-4">📱</div>
                <p className="text-center text-gray-700">
                  Accédez à MGcaisse 3.0 depuis l'écran d'accueil de votre appareil
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accès Admin */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Administration</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Gérez vos produits
            </p>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  L'accès administrateur vous permet de gérer vos produits, d'ajouter des icônes et de suivre vos stocks.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400 text-lg">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                      <div className="text-sm text-yellow-700">
                        <p>
                          L'accès administrateur n'est pas sécurisé. Il s'agit d'une fonctionnalité locale sans authentification réelle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Accéder au mode administration
                </Link>
              </div>
              <div className="mt-10 lg:mt-0 flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center text-6xl mb-4">⚙️</div>
                  <p className="text-center text-gray-700">
                    Ajoutez, modifiez et supprimez des produits facilement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-2xl font-bold text-white mr-2">🧾</span>
              <h2 className="text-xl font-bold">MGcaisse 3.0</h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-400">
                Contact: <a href="mailto:onz.sbz@gmail.com" className="text-indigo-400 hover:text-indigo-300">onz.sbz@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left text-gray-400">
              <p>&copy; 2025 MGcaisse. Tous droits réservés.</p>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right text-gray-400">
              <p>Version 3.0 - Démo</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
