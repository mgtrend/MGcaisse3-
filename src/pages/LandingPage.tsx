/**
 * Landing Page moderne et améliorée pour MGcaisse3.0
 * Présente l'application, ses fonctionnalités clés et ses limitations de manière engageante.
 * Optimisée pour mobile avec des visuels attractifs.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button'; // Utilisation du composant Button pour la cohérence
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'; // Utilisation des composants Card
import { cn } from '../lib/utils';

// Icônes (remplacer par des icônes SVG ou une bibliothèque comme Lucide si disponible)
const IconCart = () => <span className="text-2xl">🛒</span>;
const IconMobile = () => <span className="text-2xl">📱</span>;
const IconOffline = () => <span className="text-2xl">🔄</span>;
const IconCalc = () => <span className="text-2xl">🧮</span>;
const IconStock = () => <span className="text-2xl">📦</span>;
const IconAdmin = () => <span className="text-2xl">⚙️</span>;
const IconWarning = () => <span className="text-yellow-500 text-xl">⚠️</span>;
const IconPWA = () => <span className="text-6xl">📱✨</span>; // Icône PWA améliorée

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
      {/* En-tête amélioré */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-indigo-600 mr-2">🧾</span>
              <h1 className="text-2xl font-bold text-gray-900">MGcaisse <span className="text-indigo-600">3.0</span></h1>
            </div>
            <nav className="space-x-4">
              <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">Fonctionnalités</a>
              <a href="#limitations" className="text-sm font-medium text-gray-500 hover:text-gray-900">Limitations</a>
              <a href="#admin" className="text-sm font-medium text-gray-500 hover:text-gray-900">Admin</a>
              <Button asChild size="sm">
                <Link to="/app">Accéder à l'app</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section Revamp */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">MGcaisse 3.0</span>
                <span className="block text-indigo-200 text-3xl sm:text-4xl md:text-5xl mt-2">Votre Caisse Enregistreuse PWA Locale</span>
              </h1>
              <p className="mt-6 text-lg text-indigo-100 sm:text-xl max-w-xl mx-auto lg:mx-0">
                Simple, rapide et optimisée pour mobile. Gérez vos ventes facilement, même hors ligne, grâce à une interface intuitive basée sur des icônes.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" asChild className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg w-full sm:w-auto">
                  <Link to="/app">Tester l'application</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-indigo-200 text-indigo-100 hover:bg-indigo-500 hover:text-white w-full sm:w-auto">
                  <a href="#features">Découvrir les fonctionnalités</a>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              {/* Placeholder pour une image plus attrayante - Remplacer par une vraie image/illustration */}
              <div className="relative mx-auto w-full max-w-md rounded-lg shadow-2xl">
                <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Utiliser une image générée ou une capture d'écran réelle ici */}
                  <img 
                    src="/placeholder-app-screenshot.svg" // Remplacer par une image réelle ou générée
                    alt="Illustration de MGcaisse 3.0" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      // Fallback SVG simple
                      target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23AAA%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22245%22%20y%3D%22240%22%3EApp Screenshot%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités (Utilisation de Cards) */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Fonctionnalités Clés</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une caisse pensée pour vous
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              MGcaisse 3.0 simplifie la gestion de vos ventes avec des outils intuitifs et modernes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[ // Tableau pour générer les cartes de fonctionnalités
              { icon: <IconCart />, title: "Gestion par Icônes", description: "Identifiez et ajoutez vos produits en un clin d'œil grâce aux icônes personnalisables." },
              { icon: <IconMobile />, title: "Optimisé Mobile & PWA", description: "Utilisez l'application sur smartphone ou tablette, même hors ligne. Installez-la pour un accès rapide." },
              { icon: <IconOffline />, title: "Mode Hors-ligne", description: "Continuez à vendre sans connexion internet. Les données sont stockées localement." },
              { icon: <IconCalc />, title: "Calculs Automatiques", description: "Totaux, sous-totaux et TVA calculés instantanément. Générez des reçus clairs." },
              { icon: <IconStock />, title: "Gestion des Stocks Simple", description: "Suivez vos quantités en temps réel avec des indicateurs visuels pour les stocks bas." },
              { icon: <IconAdmin />, title: "Administration Locale", description: "Ajoutez, modifiez ou supprimez vos produits facilement depuis l'interface dédiée." },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 text-lg font-medium text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avertissement Limitations (Section plus visible) */}
      <section id="limitations" className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Important : Limitations Actuelles</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Ce qu'il faut savoir (Version Démo)
            </p>
          </div>

          <Card className="bg-white border-red-200 shadow-lg">
            <CardContent className="pt-6">
              <ul className="space-y-4 text-gray-700">
                {[ // Tableau pour les limitations
                  { text: "Authentification simulée : L'accès admin n'est pas sécurisé.", },
                  { text: "Stockage local uniquement : Données perdues si le cache est vidé.", },
                  { text: "Pas de serveur central : Pas de synchro, backup ou multi-utilisateurs.", },
                  { text: "Paiements simulés : Aucune transaction réelle n'est traitée.", },
                  { text: "Usage non commercial : Ne convient pas pour une utilisation réelle sans backend.", },
                ].map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <IconWarning />
                    <span className="ml-3 text-base">{limitation.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-gray-600 text-sm">
                Pour une solution complète, un développement backend est nécessaire.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section PWA Améliorée */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Progressive Web App</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Installez MGcaisse comme une App
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Profitez d'un accès rapide depuis votre écran d'accueil et d'une utilisation fluide même sans connexion internet.
              </p>
              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Comment l'installer :</h3>
                <ol className="space-y-3 text-gray-700 text-sm">
                  <li><strong>Chrome (Mobile/Desktop) :</strong> Menu ⋮ → "Installer l'application" / "Ajouter à l'écran d'accueil".</li>
                  <li><strong>Safari (iOS) :</strong> Bouton Partager → "Sur l'écran d'accueil".</li>
                  <li><strong>Autres navigateurs :</strong> Recherchez une option similaire dans le menu.</li>
                </ol>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 flex justify-center">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-8 rounded-full shadow-xl">
                <IconPWA />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accès Admin */}
      <section id="admin" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Administration</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Gérez vos produits
          </p>
          <p className="mt-4 max-w-xl text-lg text-gray-500 mx-auto">
            Accédez à l'interface d'administration locale pour ajouter, modifier ou supprimer vos produits et leurs icônes.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link to="/admin">Accéder au mode administration</Link>
            </Button>
            <p className="mt-4 text-sm text-yellow-600 flex items-center justify-center">
              <IconWarning /> <span className="ml-2">Rappel : Mode non sécurisé, données locales uniquement.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start items-center">
              <span className="text-3xl font-bold text-white mr-2">🧾</span>
              <h2 className="text-xl font-bold">MGcaisse 3.0</h2>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right text-sm text-gray-400">
              <p>Contact : <a href="mailto:onz.sbz@gmail.com" className="text-indigo-400 hover:text-indigo-300">onz.sbz@gmail.com</a></p>
              <p>Version 3.0 - Démo</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-xs text-gray-500">
            <p>&copy; 2025 MGcaisse. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
