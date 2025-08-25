export interface SEOMetaData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  language: string;
  alternateLanguages?: Array<{ lang: string; url: string }>;
}

export class SEOManager {
  private static instance: SEOManager;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
  }

  public static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  public updateMetaTags(metaData: SEOMetaData): void {
    // Title 업데이트
    document.title = metaData.title;

    // 기존 메타 태그들 제거 (dynamic tags만)
    this.removeExistingMetaTags();

    // 기본 메타 태그들
    this.setMetaTag('description', metaData.description);
    this.setMetaTag('keywords', metaData.keywords);
    this.setMetaTag('language', metaData.language);
    this.setMetaTag('robots', 'index, follow, max-image-preview:large');
    this.setMetaTag('author', 'Mini Arcade Team');
    this.setMetaTag('generator', 'Mini Arcade - Classic Games Platform');

    // Open Graph 메타 태그들
    this.setPropertyTag('og:type', 'website');
    this.setPropertyTag('og:title', metaData.ogTitle || metaData.title);
    this.setPropertyTag(
      'og:description',
      metaData.ogDescription || metaData.description
    );
    this.setPropertyTag('og:url', metaData.ogUrl || window.location.href);
    this.setPropertyTag('og:site_name', 'Mini Arcade');
    this.setPropertyTag(
      'og:locale',
      metaData.language === 'ko' ? 'ko_KR' : 'en_US'
    );

    if (metaData.ogImage) {
      this.setPropertyTag('og:image', metaData.ogImage);
      this.setPropertyTag('og:image:width', '1200');
      this.setPropertyTag('og:image:height', '630');
      this.setPropertyTag('og:image:alt', metaData.ogTitle || metaData.title);
    }

    // Twitter 카드 메타 태그들
    this.setNameTag('twitter:card', 'summary_large_image');
    this.setNameTag('twitter:title', metaData.ogTitle || metaData.title);
    this.setNameTag(
      'twitter:description',
      metaData.ogDescription || metaData.description
    );
    if (metaData.ogImage) {
      this.setNameTag('twitter:image', metaData.ogImage);
    }

    // Canonical URL
    this.setCanonicalLink(metaData.canonicalUrl || window.location.href);

    // Alternate languages (hreflang)
    if (metaData.alternateLanguages) {
      metaData.alternateLanguages.forEach((alt) => {
        this.setAlternateLink(alt.lang, alt.url);
      });
    }

    // 현재 언어 설정
    document.documentElement.lang = metaData.language;
  }

  private removeExistingMetaTags(): void {
    const selectorsToRemove = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[name="language"]',
      'meta[name="robots"]',
      'meta[name="author"]',
      'meta[name="generator"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'link[rel="canonical"]',
      'link[rel="alternate"][hreflang]',
    ];

    selectorsToRemove.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });
  }

  private setMetaTag(name: string, content: string): void {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  private setPropertyTag(property: string, content: string): void {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = content;
    document.head.appendChild(meta);
  }

  private setNameTag(name: string, content: string): void {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  private setCanonicalLink(href: string): void {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    document.head.appendChild(link);
  }

  private setAlternateLink(hreflang: string, href: string): void {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = href;
    document.head.appendChild(link);
  }

  public getMetaDataForMainMenu(language: 'ko' | 'en'): SEOMetaData {
    const baseUrl = this.baseUrl;

    if (language === 'ko') {
      return {
        title: '🕹️ Mini Arcade - 클래식 아케이드 게임 플랫폼',
        description:
          '무료로 즐기는 클래식 아케이드 게임! 갤러그, 테트리스, 스네이크 등 추억의 게임들을 브라우저에서 바로 플레이하세요. PC와 모바일 모두 지원.',
        keywords:
          '아케이드게임, 무료게임, 갤러그, 테트리스, 스네이크, 클래식게임, 브라우저게임, 온라인게임, 레트로게임',
        ogTitle: '🕹️ Mini Arcade - 클래식 아케이드 게임을 무료로!',
        ogDescription:
          '갤러그, 테트리스, 스네이크 등 추억의 아케이드 게임을 브라우저에서 무료로 즐겨보세요. PC와 모바일 모두 지원합니다.',
        ogImage: `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}?lang=ko`,
        language: 'ko',
        alternateLanguages: [
          { lang: 'en', url: `${baseUrl}?lang=en` },
          { lang: 'ko', url: `${baseUrl}?lang=ko` },
        ],
      };
    } else {
      return {
        title: '🕹️ Mini Arcade - Classic Arcade Games Platform',
        description:
          'Play classic arcade games for free! Enjoy nostalgic games like Galaga, Tetris, Snake and more directly in your browser. Supports both PC and mobile.',
        keywords:
          'arcade games, free games, galaga, tetris, snake, classic games, browser games, online games, retro games',
        ogTitle: '🕹️ Mini Arcade - Classic Arcade Games for Free!',
        ogDescription:
          'Experience nostalgic arcade games like Galaga, Tetris, Snake and more in your browser for free. Optimized for both PC and mobile.',
        ogImage: `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}?lang=en`,
        language: 'en',
        alternateLanguages: [
          { lang: 'en', url: `${baseUrl}?lang=en` },
          { lang: 'ko', url: `${baseUrl}?lang=ko` },
        ],
      };
    }
  }

  public getMetaDataForGalagaGame(language: 'ko' | 'en'): SEOMetaData {
    const baseUrl = this.baseUrl;

    if (language === 'ko') {
      return {
        title: '🚀 갤러그 슈터 - Mini Arcade에서 무료로 플레이',
        description:
          '클래식 갤러그 스타일 우주 슈팅 게임을 무료로 즐기세요! 적을 처치하고 파워업을 획득하여 최고 점수에 도전하세요.',
        keywords:
          '갤러그, 슈팅게임, 우주게임, 아케이드게임, 무료게임, 갤러그게임, 스페이스슈터',
        ogTitle: '🚀 갤러그 슈터 - 클래식 우주 슈팅 게임',
        ogDescription:
          '추억의 갤러그 게임을 현대적으로 재해석! 우주선을 조종하여 적을 물리치고 최고 점수에 도전하세요.',
        ogImage: `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}#galaga?lang=ko`,
        language: 'ko',
        alternateLanguages: [
          { lang: 'en', url: `${baseUrl}#galaga?lang=en` },
          { lang: 'ko', url: `${baseUrl}#galaga?lang=ko` },
        ],
      };
    } else {
      return {
        title: '🚀 Galaga Shooter - Play Free on Mini Arcade',
        description:
          'Play the classic Galaga-style space shooting game for free! Defeat enemies, collect power-ups, and challenge for the highest score.',
        keywords:
          'galaga, shooting game, space game, arcade game, free game, galaga game, space shooter',
        ogTitle: '🚀 Galaga Shooter - Classic Space Shooting Game',
        ogDescription:
          'Experience the nostalgic Galaga game with a modern twist! Control your spaceship, defeat enemies, and aim for the highest score.',
        ogImage: `${baseUrl}/og-image.png`,
        ogUrl: `${baseUrl}#galaga?lang=en`,
        language: 'en',
        alternateLanguages: [
          { lang: 'en', url: `${baseUrl}#galaga?lang=en` },
          { lang: 'ko', url: `${baseUrl}#galaga?lang=ko` },
        ],
      };
    }
  }

  public addStructuredData(): void {
    // 기존 구조화된 데이터 제거
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Mini Arcade',
      applicationCategory: 'Game',
      applicationSubCategory: 'Arcade Game',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Free classic arcade games platform featuring Galaga, Tetris, Snake and more nostalgic games playable directly in web browsers.',
      url: window.location.origin + window.location.pathname,
      author: {
        '@type': 'Organization',
        name: 'Mini Arcade Team',
      },
      softwareVersion: '1.0.0',
      datePublished: '2024-12-01',
      inLanguage: ['en', 'ko'],
      isAccessibleForFree: true,
      genre: ['Arcade', 'Action', 'Puzzle'],
      gamePlatform: ['Web Browser', 'Mobile', 'Desktop'],
      playMode: 'SinglePlayer',
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }
}

export const seoManager = SEOManager.getInstance();
