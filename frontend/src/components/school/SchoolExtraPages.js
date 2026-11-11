import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from '../ui/EmeresCard';
import EmeresBadge from '../ui/EmeresBadge';
import EmeresButton from '../ui/EmeresButton';
import EmeresInput from '../ui/EmeresInput';
import {
  Users,
  Briefcase,
  Target,
  Star,
  FileText,
  Megaphone,
  BookOpen,
  Trash2,
  Plus,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const STATUS_LABELS = {
  received: { label: 'Reçues', variant: 'secondary' },
  reviewing: { label: 'En examen', variant: 'warning' },
  interview: { label: 'Entretien', variant: 'accent' },
  accepted: { label: 'Acceptées', variant: 'success' },
  rejected: { label: 'Refusées', variant: 'error' }
};

const DOCUMENT_TYPES = [
  { value: 'convention', label: 'Convention de stage' },
  { value: 'attestation', label: 'Attestation' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'autre', label: 'Autre' }
];

export const StudentProgressPage = ({ students }) => {
  const attached = (students || []).filter((s) => s.attachment_status === 'attached');

  return (
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-teal-600" />
          Progression des étudiants rattachés
        </EmeresCardTitle>
        <EmeresCardDescription>
          Candidatures et compétences de vos {attached.length} étudiant(s) rattaché(s)
        </EmeresCardDescription>
      </EmeresCardHeader>
      <EmeresCardContent>
        {attached.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun étudiant rattaché. Rattachez des étudiants ou générez une invitation.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium">Étudiant</th>
                  <th className="py-2 pr-4 font-medium">Formation</th>
                  <th className="py-2 pr-4 font-medium">Compétences</th>
                  <th className="py-2 pr-4 font-medium">Candidatures</th>
                  <th className="py-2 font-medium">Placement</th>
                </tr>
              </thead>
              <tbody>
                {attached.map((student) => (
                  <tr key={student.user_id || student.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {student.field_of_study || student.degree_preparing || '—'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {(student.main_skills || []).slice(0, 3).join(', ') || '—'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{student.applications_count || 0}</td>
                    <td className="py-3">
                      {student.accepted_count > 0 ? (
                        <EmeresBadge variant="success" size="xs">
                          {student.accepted_count} acceptée(s)
                        </EmeresBadge>
                      ) : (
                        <EmeresBadge variant="secondary" size="xs">En recherche</EmeresBadge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </EmeresCardContent>
    </EmeresCard>
  );
};

export const PlacementStatsPage = ({ schoolStats }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get(`${API}/school/analytics`, authHeaders())
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(null));
  }, []);

  const statusCounts = analytics?.applications_by_status || {};
  const total = analytics?.total_applications || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EmeresCard>
          <EmeresCardContent className="text-center">
            <div className="text-3xl font-bold text-teal-700">{schoolStats?.placement_rate ?? 0} %</div>
            <div className="text-sm text-gray-600 mt-1">Taux de placement</div>
          </EmeresCardContent>
        </EmeresCard>
        <EmeresCard>
          <EmeresCardContent className="text-center">
            <div className="text-3xl font-bold text-blue-700">{total}</div>
            <div className="text-sm text-gray-600 mt-1">Candidatures totales</div>
          </EmeresCardContent>
        </EmeresCard>
        <EmeresCard>
          <EmeresCardContent className="text-center">
            <div className="text-3xl font-bold text-green-700">{statusCounts.accepted || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Acceptées</div>
          </EmeresCardContent>
        </EmeresCard>
      </div>

      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Candidatures par statut
          </EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-3">
          {Object.entries(STATUS_LABELS).map(([key, { label, variant }]) => {
            const count = statusCounts[key] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <EmeresBadge variant={variant} size="xs" className="w-28 justify-center">{label}</EmeresBadge>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm text-gray-600 w-20 text-right">{count} ({pct} %)</span>
              </div>
            );
          })}
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/school/analytics`, authHeaders())
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12 text-gray-600">
          Chargement des analytics…
        </EmeresCardContent>
      </EmeresCard>
    );
  }

  const topSkills = analytics?.top_skills || [];
  const sectors = Object.entries(analytics?.offers_by_sector || {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Top compétences de vos étudiants
          </EmeresCardTitle>
          <EmeresCardDescription>Compétences déclarées dans leurs profils</EmeresCardDescription>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-2">
          {topSkills.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucune compétence déclarée.</p>
          ) : (
            topSkills.map(([skill, count]) => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 text-sm">{skill}</span>
                <EmeresBadge variant="primary" size="xs">{count} étudiant(s)</EmeresBadge>
              </div>
            ))
          )}
        </EmeresCardContent>
      </EmeresCard>

      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Offres ciblées par secteur
          </EmeresCardTitle>
          <EmeresCardDescription>Secteurs des offres visées par vos étudiants</EmeresCardDescription>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-2">
          {sectors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucune candidature avec offre identifiée.</p>
          ) : (
            sectors.map(([sector, count]) => (
              <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 text-sm">{sector}</span>
                <EmeresBadge variant="secondary" size="xs">{count} offre(s)</EmeresBadge>
              </div>
            ))
          )}
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

export const SatisfactionPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/school/evaluations`, authHeaders())
      .then((res) => setEvaluations(res.data))
      .catch(() => setEvaluations([]))
      .finally(() => setLoading(false));
  }, []);

  const ratings = evaluations.map((e) => e.rating).filter((r) => typeof r === 'number');
  const average = ratings.length > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12 text-gray-600">Chargement…</EmeresCardContent>
      </EmeresCard>
    );
  }

  return (
    <div className="space-y-6">
      <EmeresCard>
        <EmeresCardContent className="text-center">
          <Star className="h-8 w-8 text-amber-500 mx-auto" />
          <div className="text-3xl font-bold text-gray-900 mt-2">{average || '—'} / 5</div>
          <div className="text-sm text-gray-600">{ratings.length} évaluation(s) reçue(s)</div>
        </EmeresCardContent>
      </EmeresCard>

      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle>Évaluations détaillées</EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-3">
          {evaluations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune évaluation pour le moment.
            </p>
          ) : (
            evaluations.map((evaluation) => (
              <div key={evaluation.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {evaluation.formation_name || 'Formation non précisée'}
                  </div>
                  {evaluation.comment && (
                    <div className="text-xs text-gray-600 mt-1">{evaluation.comment}</div>
                  )}
                </div>
                <EmeresBadge variant={evaluation.rating >= 4 ? 'success' : evaluation.rating >= 3 ? 'warning' : 'error'} size="xs">
                  {evaluation.rating}/5
                </EmeresBadge>
              </div>
            ))
          )}
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

export const OpportunitiesPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/offers?limit=200`)
      .then((res) => setOffers(res.data))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12 text-gray-600">
          Chargement des offres…
        </EmeresCardContent>
      </EmeresCard>
    );
  }

  return (
    <EmeresCard>
      <EmeresCardHeader>
        <EmeresCardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-teal-600" />
          Offres actives sur la plateforme
        </EmeresCardTitle>
        <EmeresCardDescription>
          {offers.length} offre(s) — à partager avec vos étudiants
        </EmeresCardDescription>
      </EmeresCardHeader>
      <EmeresCardContent className="space-y-3">
        {offers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucune offre active pour le moment.
          </p>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg flex-wrap">
              <div className="min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">{offer.title}</div>
                <div className="text-xs text-gray-600">
                  {offer.company_name || 'Entreprise'} · {offer.location || '—'}
                  {offer.duration ? ` · ${offer.duration}` : ''}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {(offer.skills_required || []).slice(0, 3).map((skill) => (
                  <EmeresBadge key={skill} variant="secondary" size="xs">{skill}</EmeresBadge>
                ))}
              </div>
            </div>
          ))
        )}
      </EmeresCardContent>
    </EmeresCard>
  );
};

export const DocumentsPage = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', document_type: 'convention', description: '' });
  const [saving, setSaving] = useState(false);

  const loadDocuments = () => {
    axios.get(`${API}/school/documents`, authHeaders())
      .then((res) => setDocuments(res.data))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadDocuments, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Le titre du document est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API}/school/documents`, form, authHeaders());
      toast.success('Document ajouté');
      setForm({ title: '', document_type: 'convention', description: '' });
      loadDocuments();
    } catch (error) {
      toast.error("Impossible d'ajouter le document.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`${API}/school/documents/${documentId}`, authHeaders());
      toast.success('Document supprimé');
      loadDocuments();
    } catch (error) {
      toast.error('Impossible de supprimer le document.');
    }
  };

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12 text-gray-600">Chargement…</EmeresCardContent>
      </EmeresCard>
    );
  }

  return (
    <div className="space-y-6">
      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Nouveau document
          </EmeresCardTitle>
          <EmeresCardDescription>Conventions, attestations et documents administratifs</EmeresCardDescription>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-3">
          <EmeresInput
            placeholder="Titre du document *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={form.document_type}
            onChange={(e) => setForm({ ...form, document_type: e.target.value })}
          >
            {DOCUMENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <EmeresInput
            placeholder="Description (optionnel)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <EmeresButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Ajout…' : 'Ajouter le document'}
          </EmeresButton>
        </EmeresCardContent>
      </EmeresCard>

      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle>Documents ({documents.length})</EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucun document enregistré.</p>
          ) : (
            documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{document.title}</div>
                  <div className="text-xs text-gray-600">
                    {DOCUMENT_TYPES.find((t) => t.value === document.document_type)?.label || document.document_type}
                    {document.description ? ` · ${document.description}` : ''}
                  </div>
                </div>
                <EmeresButton variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </EmeresButton>
              </div>
            ))
          )}
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

export const CommunicationPage = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', body: '' });
  const [saving, setSaving] = useState(false);

  const loadAnnouncements = () => {
    axios.get(`${API}/school/announcements`, authHeaders())
      .then((res) => setAnnouncements(res.data))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadAnnouncements, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Le titre et le message sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${API}/school/announcements`, form, authHeaders());
      toast.success(`Annonce envoyée à ${res.data.notified_students} étudiant(s) rattaché(s)`);
      setForm({ title: '', body: '' });
      loadAnnouncements();
    } catch (error) {
      toast.error("Impossible d'envoyer l'annonce.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EmeresCard>
        <EmeresCardContent className="text-center py-12 text-gray-600">Chargement…</EmeresCardContent>
      </EmeresCard>
    );
  }

  return (
    <div className="space-y-6">
      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-teal-600" />
            Nouvelle annonce
          </EmeresCardTitle>
          <EmeresCardDescription>
            Envoyée en notification à tous vos étudiants rattachés
          </EmeresCardDescription>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-3">
          <EmeresInput
            placeholder="Titre de l'annonce *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-24"
            placeholder="Message *"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <EmeresButton variant="primary" icon={<Megaphone className="h-4 w-4" />} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Envoi…' : 'Envoyer l\'annonce'}
          </EmeresButton>
        </EmeresCardContent>
      </EmeresCard>

      <EmeresCard>
        <EmeresCardHeader>
          <EmeresCardTitle>Annonces envoyées ({announcements.length})</EmeresCardTitle>
        </EmeresCardHeader>
        <EmeresCardContent className="space-y-2">
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucune annonce envoyée.</p>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm text-gray-900">{announcement.title}</div>
                <div className="text-xs text-gray-600 mt-1">{announcement.body}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString('fr-FR') : ''}
                </div>
              </div>
            ))
          )}
        </EmeresCardContent>
      </EmeresCard>
    </div>
  );
};

export const LibraryPage = () => (
  <EmeresCard>
    <EmeresCardHeader>
      <EmeresCardTitle className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-teal-600" />
        Bibliothèque pédagogique
      </EmeresCardTitle>
      <EmeresCardDescription>
        Guides et ressources partagés par la communauté Émérés
      </EmeresCardDescription>
    </EmeresCardHeader>
    <EmeresCardContent>
      <p className="text-sm text-gray-500">
        La bibliothèque partagée est en cours de constitution. Vos documents administratifs
        (conventions, attestations) sont gérés dans la page « Gestion documentaire ».
      </p>
    </EmeresCardContent>
  </EmeresCard>
);
