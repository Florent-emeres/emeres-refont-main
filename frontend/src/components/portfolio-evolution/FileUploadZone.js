import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Upload, File, Image, Video, Trash2, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';

const FileUploadZone = ({ 
  files = [], 
  onFilesChange, 
  acceptedTypes = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx",
  maxSize = 10, // MB
  required = false,
  label = "Preuves du projet"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = [];
    
    newFiles.forEach(file => {
      // Vérifier la taille
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`);
        return;
      }
      
      // Créer un objet file avec metadata
      const fileObj = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };
      
      validFiles.push(fileObj);
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
      toast.success(`${validFiles.length} fichier(s) ajouté(s)`);
    }
  };

  const removeFile = (fileId) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove && fileToRemove.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Zone de drop */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-gray-500">
            Formats acceptés: Images, Vidéos, PDF, Documents (max {maxSize}MB)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Fichiers ajoutés ({files.length})
          </h4>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {required && files.length === 0 && (
        <p className="text-sm text-red-600">
          Au moins un fichier de preuve est requis pour ce projet
        </p>
      )}
    </div>
  );
};

export default FileUploadZone;