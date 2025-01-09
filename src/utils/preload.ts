export async function preloadAssets() {
  // 获取 assets 目录下的所有图片
  const assetsContext = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,gif,webp}', { eager: true });
  
  // 预加载函数
  const preloadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(null);
      img.onerror = reject;
      img.src = url;
    });
  };

  // 收集所有需要加载的图片URL
  const imagePromises = [
    // 加载 assets 目录的图片
    ...Object.keys(assetsContext).map(path => 
      preloadImage(path.replace('/src', ''))
    ),
    
    // 加载 cover-images 中的 0.25x 图片
    ...Array.from({ length: 12 }, (_, i) => 
      preloadImage(`/cover-images/${i + 1}-0.25x.jpg`)
    ),
    
    // 加载 shards/spot 下的所有图片
    ...Array.from({ length: 9 }, (_, i) => 
      preloadImage(`/shards/spot/${i + 1}.png`)
    )
  ];

  try {
    await Promise.all(imagePromises);
    return true;
  } catch (error) {
    console.error('Some images failed to load:', error);
    return false;
  }
} 