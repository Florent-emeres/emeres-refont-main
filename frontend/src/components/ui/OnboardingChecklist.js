import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Rocket } from 'lucide-react';
import EmeresCard, { EmeresCardContent, EmeresCardDescription, EmeresCardHeader, EmeresCardTitle } from './EmeresCard';
import EmeresButton from './EmeresButton';

const OnboardingChecklist = ({ title, steps, onNavigate, className = '' }) => {
  if (!steps || steps.length === 0) return null;

  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  if (allDone) return null;

  const percent = Math.round((doneCount / steps.length) * 100);

  return (
    <EmeresCard className={`border-teal-100 bg-gradient-to-br from-teal-50/60 to-white ${className}`}>
      <EmeresCardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-emeres-primary flex items-center justify-center">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <EmeresCardTitle className="text-base">{title}</EmeresCardTitle>
              <EmeresCardDescription>
                {doneCount}/{steps.length} terminé{doneCount > 1 ? 's' : ''} — quelques minutes suffisent
              </EmeresCardDescription>
            </div>
          </div>
          <span className="text-sm font-semibold text-teal-700 whitespace-nowrap">{percent}%</span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-emeres-primary transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </EmeresCardHeader>
      <EmeresCardContent>
        <div className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.label}
              onClick={() => !step.done && onNavigate && onNavigate(step.page)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                step.done
                  ? 'border-teal-100 bg-teal-50/60'
                  : 'border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm cursor-pointer'
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm font-medium ${
                    step.done ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}
                >
                  {step.label}
                </div>
                {!step.done && step.description && (
                  <div className="text-xs text-gray-500 truncate">{step.description}</div>
                )}
              </div>
              {!step.done && (
                <ArrowRight className="h-4 w-4 text-teal-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </EmeresCardContent>
    </EmeresCard>
  );
};

export default OnboardingChecklist;
