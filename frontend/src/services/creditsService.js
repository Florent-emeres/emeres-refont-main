/**
 * Service d'intégration des crédits ÉMÉRÉS dans toute l'app
 * Attribution automatique de points pour toutes les actions utilisateur
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

class CreditsService {
  constructor() {
    this.listeners = new Set();
    this.userBalance = null;
  }

  // Ajouter un listener pour les changements de crédits
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Supprimer un listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notifier tous les listeners
  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  // Récupérer le solde utilisateur
  async getUserBalance() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${BACKEND_URL}/api/credits/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const balance = await response.json();
        this.userBalance = balance;
        this.notifyListeners({ type: 'balance_updated', balance });
        return balance;
      }
    } catch (error) {
      console.error('Erreur récupération solde crédits:', error);
    }
    return null;
  }

  // Attribution automatique de points avec notification
  async awardPoints(actionType, metadata = {}, showNotification = true) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${BACKEND_URL}/api/credits/award-points`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Device-Fingerprint': this.getDeviceFingerprint()
        },
        body: JSON.stringify({
          action_type: actionType,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            source: 'auto_integration'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();

        // Anti-fraude / limite atteinte : pas d'erreur, mais pas de points non plus
        if (result.success === false) {
          if (showNotification && window.showCreditsNotification) {
            window.showCreditsNotification({
              type: 'info',
              title: 'Déjà récompensé',
              message: result.message || 'Limite atteinte pour cette action aujourd\u2019hui.',
              duration: 4000
            });
          }
          return null;
        }

        // Mettre à jour le solde
        await this.getUserBalance();

        // Notifier les listeners
        this.notifyListeners({
          type: 'points_awarded',
          points: result.points_awarded,
          action: actionType,
          message: result.message
        });

        // Afficher notification si demandé
        if (showNotification && window.showCreditsNotification) {
          window.showCreditsNotification({
            type: 'success',
            title: '🎉 Points gagnés !',
            message: `+${result.points_awarded} points pour ${this.getActionLabel(actionType)}`,
            duration: 4000
          });
        }

        return result;
      } else {
        const error = await response.json();
        console.warn('Attribution points échouée:', error.detail);

        // Afficher notification d'erreur si pertinente (pas de spam pour les limites)
        if (showNotification && !error.detail?.includes('limits exceeded') && window.showCreditsNotification) {
          window.showCreditsNotification({
            type: 'info',
            title: 'Points non attribués',
            message: error.detail || 'Limite atteinte ou action déjà réalisée',
            duration: 2000
          });
        }
      }
    } catch (error) {
      console.error('Erreur attribution points:', error);
    }
    return null;
  }

  // Obtenir le label d'une action pour l'affichage
  getActionLabel(actionType) {
    const labels = {
      daily_login: 'connexion quotidienne',
      profile_completed: 'profil complété',
      application_sent: 'candidature envoyée',
      company_review: 'avis entreprise',
      cv_update: 'CV mis à jour',
      skill_test: 'test de compétences',
      cv_evaluation: 'évaluation CV',
      flash_advice: 'conseil flash',
      objective_reached: 'objectif atteint',
      program_completed: 'programme terminé',
      job_posted: 'offre publiée',
      intern_recruited: 'stagiaire recruté',
      training_given: 'formation donnée',
      student_supported: 'étudiant accompagné',
      partnership_created: 'partenariat créé',
      event_organized: 'événement organisé'
    };
    return labels[actionType] || actionType;
  }

  // Générer un fingerprint simple pour l'anti-fraude
  getDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('ÉMÉRÉS fingerprint', 2, 2);

    return btoa(
      navigator.userAgent +
      screen.width + screen.height +
      new Date().getTimezoneOffset() +
      canvas.toDataURL()
    ).slice(0, 32);
  }

  // Actions automatiques spécifiques
  async onLogin() {
    return await this.awardPoints('daily_login', { source: 'login' });
  }

  async onApplicationSent(offerId, companyName) {
    return await this.awardPoints('application_sent', {
      offer_id: offerId,
      company_name: companyName
    });
  }

  async onProfileCompleted(completionPercentage) {
    if (completionPercentage >= 90) {
      return await this.awardPoints('profile_completed', {
        completion_percentage: completionPercentage
      });
    }
    return null;
  }

  async onCvUpdated() {
    return await this.awardPoints('cv_update', { source: 'cv_generator' });
  }

  async onCompanyReview(companyId, rating) {
    return await this.awardPoints('company_review', {
      company_id: companyId,
      rating: rating
    });
  }

  async onSkillTestCompleted(testType, score) {
    return await this.awardPoints('skill_test', {
      test_type: testType,
      score: score
    });
  }

  // Actions mentor
  async onCvEvaluation(studentId) {
    return await this.awardPoints('cv_evaluation', {
      student_id: studentId,
      service_type: 'free_cv_evaluation'
    });
  }

  async onFlashAdvice(studentId, topic) {
    return await this.awardPoints('flash_advice', {
      student_id: studentId,
      advice_topic: topic
    });
  }

  async onObjectiveReached(studentId, objectiveType) {
    return await this.awardPoints('objective_reached', {
      student_id: studentId,
      objective_type: objectiveType
    });
  }

  // Actions entreprise
  async onJobPosted(jobId, jobTitle) {
    return await this.awardPoints('job_posted', {
      job_id: jobId,
      job_title: jobTitle
    });
  }

  async onInternRecruited(internId, jobId) {
    return await this.awardPoints('intern_recruited', {
      intern_id: internId,
      job_id: jobId
    });
  }

  async onTrainingGiven(trainingType, participantCount) {
    return await this.awardPoints('training_given', {
      training_type: trainingType,
      participant_count: participantCount
    });
  }

  // Actions institution
  async onStudentSupported(studentId, supportType) {
    return await this.awardPoints('student_supported', {
      student_id: studentId,
      support_type: supportType
    });
  }

  async onPartnershipCreated(partnerType, partnerName) {
    return await this.awardPoints('partnership_created', {
      partner_type: partnerType,
      partner_name: partnerName
    });
  }

  async onEventOrganized(eventType, participantCount) {
    return await this.awardPoints('event_organized', {
      event_type: eventType,
      participant_count: participantCount
    });
  }

  // Vérifier si l'utilisateur peut utiliser des crédits pour un achat
  async canUseCredits(orderTotalEuros, creditsToUseEuros) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return { can_use: false, message: 'Non connecté' };

      const response = await fetch(`${BACKEND_URL}/api/credits/can-use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_total_euros: orderTotalEuros,
          credits_to_use_euros: creditsToUseEuros
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erreur vérification crédits:', error);
    }
    return { can_use: false, message: 'Erreur système' };
  }

  // Dépenser des crédits
  async spendCredits(creditsAmountEuros, orderId, metadata = {}) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${BACKEND_URL}/api/credits/spend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credits_amount_euros: creditsAmountEuros,
          order_id: orderId,
          metadata: metadata
        })
      });

      if (response.ok) {
        const result = await response.json();

        // Mettre à jour le solde
        await this.getUserBalance();

        // Notifier les listeners
        this.notifyListeners({
          type: 'credits_spent',
          amount: creditsAmountEuros,
          order_id: orderId
        });

        return result;
      }
    } catch (error) {
      console.error('Erreur dépense crédits:', error);
    }
    return null;
  }
}

// Instance globale
const creditsService = new CreditsService();

export default creditsService;
