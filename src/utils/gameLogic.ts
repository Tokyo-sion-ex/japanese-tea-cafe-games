// ゲームの進行管理
export const calculateGrowth = (plantedTime) => {
  const now = new Date();
  const planted = new Date(plantedTime);
  const diffHours = (now - planted) / (1000 * 60 * 60);
  return Math.min(100, diffHours * 10);
};

// レベリング計算
export const calculateLevel = (experience) => {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

// 価格計算（レベル補正）
export const calculatePrice = (basePrice, level) => {
  return Math.floor(basePrice * (1 + level * 0.1));
};

// 茶葉の成長速度（季節補正）
export const getGrowthRate = (season) => {
  const rates = {
    '春': 1.5,
    '夏': 1.2,
    '秋': 1.0,
    '冬': 0.7
  };
  return rates[season] || 1.0;
};
