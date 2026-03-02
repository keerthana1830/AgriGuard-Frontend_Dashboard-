import React from 'react';
import { BugAntIcon, LeafIcon, SparklesIcon, CloudRainIcon, ClockIcon, ExternalLinkIcon } from './Icons';
import { useTranslation } from '../contexts/LanguageContext';

const resources = [
  { 
    titleKey: 'res_pest_guide_title', 
    descriptionKey: 'res_pest_guide_desc', 
    icon: BugAntIcon,
    url: 'https://extension.umd.edu/resource/pest-identification'
  },
  { 
    titleKey: 'res_organic_farming_title', 
    descriptionKey: 'res_organic_farming_desc', 
    icon: LeafIcon,
    url: 'https://rodaleinstitute.org/why-organic/organic-farming-basics/organic-basics/'
  },
  { 
    titleKey: 'res_soil_health_title', 
    descriptionKey: 'res_soil_health_desc', 
    icon: SparklesIcon,
    url: 'https://www.nrcs.usda.gov/getting-assistance/soil-health/soil-health-101'
  },
  { 
    titleKey: 'res_water_conservation_title', 
    descriptionKey: 'res_water_conservation_desc', 
    icon: CloudRainIcon,
    url: 'https://www.fao.org/land-water/water/water-management/en/'
  },
  { 
    titleKey: 'res_planting_calendar_title', 
    descriptionKey: 'res_planting_calendar_desc', 
    icon: ClockIcon,
    url: 'https://www.almanac.com/gardening/planting-calendar'
  },
];

const ResourceCard: React.FC<{ titleKey: string; descriptionKey: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; url: string }> = ({ titleKey, descriptionKey, icon: Icon, url }) => {
    const { t } = useTranslation();
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-background rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">{t(titleKey)}</h4>
                    <p className="text-sm text-text-secondary mt-1">{t(descriptionKey)}</p>
                </div>
                <ExternalLinkIcon className="w-5 h-5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
        </a>
    );
};

export const ResourcesDashboard: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="p-4 bg-surface rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-text-primary">{t('resources_knowledgeBase')}</h3>
            <p className="mt-2 mb-4 text-text-secondary">{t('resources_guides')}</p>
            <div className="space-y-3">
            {resources.map((resource) => (
                <ResourceCard key={resource.titleKey} {...resource} />
            ))}
            </div>
        </div>
    );
};
