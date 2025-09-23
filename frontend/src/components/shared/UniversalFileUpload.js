import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  Upload, 
  File, 
  Image, 
  X, 
  Download,
  FileText,
  FileImage
} from 'lucide-react';

const UniversalFileUpload = ({ 
  label, 
  description, 
  acceptedTypes = [], // ['image/jpeg', 'image/png', 'application/pdf']
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  value = null,
  onChange,
  required = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Configuration des types de fichiers
  const fileTypeConfig = {
    'image/jpeg': { icon: FileImage, color: 'bg-green-100 text-green-800', extension: 'JPG' },
    'image/png': { icon: FileImage, color: 'bg-green-100 text-green-800', extension: 'PNG' },
    'application/pdf': { icon: FileText, color: 'bg-red-100 text-red-800', extension: 'PDF' },
    'application/msword': { icon: File, color: 'bg-blue-100 text-blue-800', extension: 'DOC' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 
      icon: File, color: 'bg-blue-100 text-blue-800', extension: 'DOCX' 
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Vérification du type
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      toast.error(`Type de fichier non accepté. Types autorisés: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Vérification de la taille
    if (file.size > maxSize) {
      toast.error(`Fichier trop volumineux. Taille maximum: ${formatFileSize(maxSize)}`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    
    try {
      // Création d'un objet file avec métadonnées
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        // En production, ici on uploadera le fichier vers le serveur
        // Pour l'instant, on utilise une URL temporaire
        url: URL.createObjectURL(file),
        uploaded: true,
        uploadDate: new Date().toISOString()
      };

      onChange(fileData);
      toast.success('Fichier uploadé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'upload du fichier');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileSelect = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType) => {
    const config = fileTypeConfig[fileType] || { icon: File, color: 'bg-gray-100 text-gray-800', extension: 'FILE' };
    return config;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* Affichage du fichier uploadé */}
      {value && value.uploaded ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const { icon: FileIcon, color } = getFileIcon(value.type);
                return (
                  <div className={`p-2 rounded-lg ${color}`}>
                    <FileIcon className="h-5 w-5" />
                  </div>
                );
              })()}
              <div>
                <p className="font-medium text-sm">{value.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(value.size)} • Uploadé le {new Date(value.uploadDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(value.url, '_blank')}
                className="h-8"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                className="h-8 text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Zone de drop */
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={openFileDialog}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Upload className={`h-12 w-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {uploading ? 'Upload en cours...' : 'Cliquez ou glissez-déposez votre fichier'}
              </p>
              <p className="text-xs text-gray-500">
                {acceptedTypes.length > 0 && (
                  <>
                    Types acceptés: {acceptedTypes.map(type => {
                      const config = fileTypeConfig[type];
                      return config ? config.extension : type.split('/')[1].toUpperCase();
                    }).join(', ')}
                    <br />
                  </>
                )}
                Taille maximum: {formatFileSize(maxSize)}
              </p>
            </div>

            {acceptedTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {acceptedTypes.map(type => {
                  const config = getFileIcon(type);
                  return (
                    <Badge key={type} variant="secondary" className={`text-xs ${config.color}`}>
                      {config.extension}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </div>
  );
};

export default UniversalFileUpload;