import type { Achievement, UserData, PlayerStats } from '../types';
import { LeafIcon, TrophyIcon, BugAntIcon, CurrencyDollarIcon, MoonIcon, PlusCircleIcon, SparklesIcon } from '../components/Icons';

export const ALL_ACHIEVEMENTS: readonly Achievement[] = [
    { id: 'first_scan', nameKey: 'ach_first_scan_name', descriptionKey: 'ach_first_scan_desc', icon: LeafIcon },
    { id: 'ten_scans', nameKey: 'ach_ten_scans_name', descriptionKey: 'ach_ten_scans_desc', icon: SparklesIcon },
    { id: 'healthy_check', nameKey: 'ach_healthy_check_name', descriptionKey: 'ach_healthy_check_desc', icon: LeafIcon },
    { id: 'pest_buster', nameKey: 'ach_pest_buster_name', descriptionKey: 'ach_pest_buster_desc', icon: BugAntIcon },
    { id: 'high_infection', nameKey: 'ach_high_infection_name', descriptionKey: 'ach_high_infection_desc', icon: BugAntIcon },
    { id: 'first_purchase', nameKey: 'ach_first_purchase_name', descriptionKey: 'ach_first_purchase_desc', icon: PlusCircleIcon },
    { id: 'economist', nameKey: 'ach_economist_name', descriptionKey: 'ach_economist_desc', icon: CurrencyDollarIcon },
    { id: 'rank_sprout', nameKey: 'ach_rank_sprout_name', descriptionKey: 'ach_rank_sprout_desc', icon: TrophyIcon },
    { id: 'rank_master', nameKey: 'ach_rank_master_name', descriptionKey: 'ach_rank_master_desc', icon: TrophyIcon },
    { id: 'night_owl', nameKey: 'ach_night_owl_name', descriptionKey: 'ach_night_owl_desc', icon: MoonIcon },
] as const;


export const checkAchievements = (
    userData: UserData,
    playerStats: PlayerStats,
): Achievement[] => {
    const unlockedIds = new Set(userData.unlockedAchievements.map(a => a.id));
    const newAchievements: Achievement[] = [];

    const checkAndAdd = (achievement: Achievement) => {
        if (!unlockedIds.has(achievement.id)) {
            newAchievements.push(achievement);
            unlockedIds.add(achievement.id); // Prevent duplicate adds in same check
        }
    };

    // Scan-based achievements
    if (userData.history.length >= 1) {
        checkAndAdd(ALL_ACHIEVEMENTS[0]); // First Scan
    }
    if (userData.history.length >= 10) {
        checkAndAdd(ALL_ACHIEVEMENTS[1]); // Ten Scans
    }
    if (userData.history.some(h => h.result.infectionLevel < 5)) {
        checkAndAdd(ALL_ACHIEVEMENTS[2]); // Healthy Check
    }
    if (userData.history.some(h => h.result.pestName.toLowerCase() !== 'none')) {
        checkAndAdd(ALL_ACHIEVEMENTS[3]); // Pest Buster
    }
    if (userData.history.some(h => h.result.infectionLevel > 75)) {
        checkAndAdd(ALL_ACHIEVEMENTS[4]); // High Infection
    }
     if (userData.history.some(h => {
        const hour = new Date(h.date).getHours();
        return hour >= 22 || hour < 4;
     })) {
        checkAndAdd(ALL_ACHIEVEMENTS[9]); // Night Owl
    }

    // Purchase-based achievements
    if (userData.purchaseLogs.length >= 1) {
        checkAndAdd(ALL_ACHIEVEMENTS[5]); // First Purchase
    }

    // Stat-based achievements
    if (playerStats.totalSavings > 100) {
        checkAndAdd(ALL_ACHIEVEMENTS[6]); // Economist
    }
    if (playerStats.level >= 2) {
        checkAndAdd(ALL_ACHIEVEMENTS[7]); // Rank Sprout
    }
    if (playerStats.level >= 4) {
        checkAndAdd(ALL_ACHIEVEMENTS[8]); // Rank Master
    }

    return newAchievements;
};
