import { songLibrary } from '../store/songs';

export async function preloadAssets() {
  // 获取 assets 目录下的所有图片
  const assetsContext = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,gif,webp}', { eager: true });
  
  // 预加载函数
  const preloadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(null);
      img.onerror = (e) => {
        console.error(`Failed to load image: ${url}`);
        reject(e);
      };
      img.src = url;
    });
  };

  // 从 songLibrary 获取歌名列表
  const coverImages = songLibrary
    .map(song => `/cover-images/${song.title}@0.25x.jpg`);

  // 收集所有需要加载的图片URL
  const imagePromises = [
    // 加载 assets 目录的图片
    ...Object.entries(assetsContext).map(([path, module]) => {
      // @ts-ignore
      return preloadImage(module.default);
    }),
    
    // 加载 public 目录下的图片
    ...coverImages.map(path => preloadImage(path))
  ];

  try {
    await Promise.all(imagePromises);
    return true;
  } catch (error) {
    console.error('Some images failed to load:', error);
    return false;
  }
} 