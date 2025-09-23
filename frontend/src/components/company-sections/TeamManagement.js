import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Users, 
  Plus, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  Crown,
  User,
  Save,
  X
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TeamManagement = ({ user, companyProfile, onProfileUpdate }) => {
  const { toast } = useToast();
  const [managers, setManagers] = useState(companyProfile?.hr_managers || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [managerForm, setManagerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'hr_manager',
    department: '',
    permissions: []
  });

  const resetForm = () => {
    setManagerForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'hr_manager',
      department: '',
      permissions: []
    });
    setEditingManager(null);
  };

  const handleInputChange = (field, value) => {
    setManagerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionToggle = (permission) => {
    setManagerForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = async () => {
    try {
      let updatedManagers;
      
      if (editingManager) {
        // Modification
        updatedManagers = managers.map(manager => 
          manager.id === editingManager.id 
            ? { ...manager, ...managerForm, updated_at: new Date().toISOString() }
            : manager
        );
      } else {
        // Ajout
        const newManager = {
          id: Date.now().toString(),
          ...managerForm,
          created_at: new Date().toISOString(),
          created_by: user.id
        };
        updatedManagers = [...managers, newManager];
      }

      // Sauvegarder via l'API
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/company`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...companyProfile,
          hr_managers: updatedManagers,
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setManagers(updatedManagers);
        toast.success(editingManager ? 'Manager mis à jour' : 'Manager ajouté avec succès');
        setShowAddModal(false);
        resetForm();
        
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde manager:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (manager) => {
    setManagerForm({
      first_name: manager.first_name || '',
      last_name: manager.last_name || '',
      email: manager.email || '',
      phone: manager.phone || '',
      role: manager.role || 'hr_manager',
      department: manager.department || '',
      permissions: manager.permissions || []
    });
    setEditingManager(manager);
    setShowAddModal(true);
  };

  const handleDelete = async (managerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce manager ?')) {
      try {
        const updatedManagers = managers.filter(m => m.id !== managerId);
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/profile/company`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...companyProfile,
            hr_managers: updatedManagers,
            updated_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          setManagers(updatedManagers);
          toast.success('Manager supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur suppression manager:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      'hr_director': { label: 'Directeur RH', color: 'bg-red-100 text-red-800', icon: Crown },
      'hr_manager': { label: 'Manager RH', color: 'bg-blue-100 text-blue-800', icon: Shield },
      'recruiter': { label: 'Recruteur', color: 'bg-green-100 text-green-800', icon: Users },
      'assistant': { label: 'Assistant RH', color: 'bg-gray-100 text-gray-800', icon: User }
    };
    
    const roleInfo = roles[role] || roles['hr_manager'];
    const Icon = roleInfo.icon;
    
    return (
      <Badge className={`${roleInfo.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {roleInfo.label}
      </Badge>
    );
  };

  const availablePermissions = [
    { id: 'manage_offers', label: 'Gérer les offres' },
    { id: 'manage_applications', label: 'Gérer les candidatures' },
    { id: 'view_analytics', label: 'Voir les statistiques' },
    { id: 'manage_team', label: 'Gérer l\'équipe' },
    { id: 'export_data', label: 'Exporter les données' },
    { id: 'manage_company_profile', label: 'Modifier le profil entreprise' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Équipe RH</h2>
          <p className="text-gray-600">Gérez les accès et permissions de votre équipe</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un manager
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Liste des managers */}
      <div className="grid gap-4">
        {managers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun manager ajouté</h3>
              <p className="text-gray-500 mb-4">Ajoutez des membres à votre équipe RH</p>
              <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier manager
              </Button>
            </CardContent>
          </Card>
        ) : (
          managers.map((manager) => (
            <Card key={manager.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {manager.first_name} {manager.last_name}
                        </h3>
                        {getRoleBadge(manager.role)}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        {manager.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{manager.email}</span>
                          </div>
                        )}
                        {manager.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{manager.phone}</span>
                          </div>
                        )}
                        {manager.department && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>{manager.department}</span>
                          </div>
                        )}
                      </div>
                      
                      {manager.permissions && manager.permissions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">Permissions :</p>
                          <div className="flex flex-wrap gap-1">
                            {manager.permissions.map((permission) => {
                              const permInfo = availablePermissions.find(p => p.id === permission);
                              return (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permInfo?.label || permission}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(manager)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(manager.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal d'ajout/modification */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingManager ? 'Modifier le manager' : 'Ajouter un manager'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du membre de l'équipe RH
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={managerForm.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Jean"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  value={managerForm.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={managerForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={managerForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            {/* Rôle et département */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <select
                  id="role"
                  value={managerForm.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="hr_director">Directeur RH</option>
                  <option value="hr_manager">Manager RH</option>
                  <option value="recruiter">Recruteur</option>
                  <option value="assistant">Assistant RH</option>
                </select>
              </div>
              <div>
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={managerForm.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Ressources Humaines"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={managerForm.permissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingManager ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;