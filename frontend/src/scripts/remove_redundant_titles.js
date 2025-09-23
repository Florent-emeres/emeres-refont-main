// Script pour supprimer les titres redondants dans les composants de sections
const fs = require('fs');
const path = require('path');

const componentsDir = '/app/frontend/src/components/company-sections/';
const files = [
  'IntegrationsManagement.js',
  'AdvancedCommunication.js', 
  'AnalyticsDashboard.js',
  'DocumentManagement.js',
  'InternshipTracking.js',
  'TeamManagement.js',
  'CompanyBlog.js'
];

const titlePatterns = [
  { 
    pattern: /\s*{\/\* Header.*?\*\/}\s*<div className="flex.*?<\/div>\s*\n/gs,
    files: ['IntegrationsManagement.js', 'AdvancedCommunication.js', 'AnalyticsDashboard.js', 'DocumentManagement.js', 'InternshipTracking.js', 'TeamManagement.js', 'CompanyBlog.js']
  },
  {
    pattern: /<div className="flex flex-col sm:flex-row.*?<h2 className="text-2xl font-bold text-gray-900">.*?<\/h2>.*?<\/div>\s*<\/div>\s*\n/gs,
    files: ['IntegrationsManagement.js', 'AdvancedCommunication.js', 'AnalyticsDashboard.js', 'DocumentManagement.js', 'InternshipTracking.js', 'TeamManagement.js', 'CompanyBlog.js']
  }
];

files.forEach(fileName => {
  const filePath = path.join(componentsDir, fileName);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern spécifique pour chaque titre redondant
    const titleRemovals = [
      { file: 'IntegrationsManagement.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Intégrations<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'AdvancedCommunication.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Communication avancée<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'AnalyticsDashboard.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Tableau de bord RH<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'DocumentManagement.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Gestion documentaire<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'InternshipTracking.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Suivi des stagiaires<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'TeamManagement.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Équipe RH<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g },
      { file: 'CompanyBlog.js', search: /.*<h2 className="text-2xl font-bold text-gray-900">Image Employeur<\/h2>.*\n.*<p className="text-gray-600">.*<\/p>.*\n/g }
    ];
    
    const removal = titleRemovals.find(r => r.file === fileName);
    if (removal) {
      content = content.replace(removal.search, '');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Titre redondant supprimé dans ${fileName}`);
    }
  }
});

console.log('🎉 Nettoyage des titres redondants terminé !');