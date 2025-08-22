export class AdManager {
  private interstitialAdElement: HTMLElement | null;
  private rewardAdOverlayElement: HTMLElement | null;
  private sidebarAdsEnabled: boolean;
  private bottomAdEnabled: boolean;
  private adDisplayTimer: number;
  private closeAdButton: HTMLButtonElement | null;
  private selectedReward: string | null;
  private currentInterstitialCallback: (() => void) | null; // 인터스티셜 광고 콜백 저장
  private currentRewardCallback: ((reward: string) => void) | null; // 보상형 광고 콜백 저장

  constructor() {
    this.interstitialAdElement = document.getElementById('interstitial-ad');
    this.rewardAdOverlayElement = document.getElementById('reward-ad-overlay');
    this.closeAdButton = document.getElementById(
      'close-ad'
    ) as HTMLButtonElement;
    this.sidebarAdsEnabled = false;
    this.bottomAdEnabled = false;
    this.adDisplayTimer = 0;
    this.selectedReward = null;
    this.currentInterstitialCallback = null;
    this.currentRewardCallback = null;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 인터스티셜 광고 닫기 버튼
    if (this.closeAdButton) {
      this.closeAdButton.addEventListener('click', () =>
        this.hideInterstitialAd()
      );
    }

    // 보상형 광고 이벤트
    const rewardOptions = document.querySelectorAll('.reward-option');
    rewardOptions.forEach((option) => {
      option.addEventListener('click', () => {
        this.selectReward((option as HTMLElement).dataset.reward || '');
      });
    });

    const watchRewardAdButton = document.getElementById('watch-reward-ad');
    const skipRewardAdButton = document.getElementById('skip-reward-ad');

    if (watchRewardAdButton) {
      watchRewardAdButton.addEventListener('click', () => this.watchRewardAd());
    }

    if (skipRewardAdButton) {
      skipRewardAdButton.addEventListener('click', () => this.skipRewardAd());
    }
  }

  // 상단 배너 광고 표시/숨김
  public showTopBannerAd(): void {
    const topBannerAd = document.getElementById('top-banner-ad');
    if (topBannerAd) {
      topBannerAd.classList.remove('hidden');
      // 광고가 표시될 때 동적 로딩
      setTimeout(() => {
        this.loadAd(topBannerAd.querySelector('.adsbygoogle'));
      }, 100);
    }
  }

  public hideTopBannerAd(): void {
    const topBannerAd = document.getElementById('top-banner-ad');
    if (topBannerAd) {
      topBannerAd.classList.add('hidden');
    }
  }

  // 사이드바 광고 표시/숨김
  public showSidebarAds(): void {
    if (this.sidebarAdsEnabled) return;

    const leftAd = document.getElementById('sidebar-ad-left');
    const rightAd = document.getElementById('sidebar-ad-right');

    if (leftAd && rightAd) {
      leftAd.classList.remove('hidden');
      rightAd.classList.remove('hidden');
      this.sidebarAdsEnabled = true;

      // 광고가 표시될 때 동적 로딩
      setTimeout(() => {
        this.loadAd(leftAd.querySelector('.adsbygoogle'));
        this.loadAd(rightAd.querySelector('.adsbygoogle'));
      }, 100);

      console.log('📱 사이드바 광고 표시');
    }
  }

  public hideSidebarAds(): void {
    const leftAd = document.getElementById('sidebar-ad-left');
    const rightAd = document.getElementById('sidebar-ad-right');

    if (leftAd && rightAd) {
      leftAd.classList.add('hidden');
      rightAd.classList.add('hidden');
      this.sidebarAdsEnabled = false;
      console.log('📱 사이드바 광고 숨김');
    }
  }

  // 하단 배너 광고 표시/숨김
  public showBottomBannerAd(): void {
    const bottomBannerAd = document.getElementById('bottom-banner-ad');
    if (bottomBannerAd && !this.bottomAdEnabled) {
      bottomBannerAd.classList.remove('hidden');
      this.bottomAdEnabled = true;

      // 광고가 표시될 때 동적 로딩
      setTimeout(() => {
        this.loadAd(bottomBannerAd.querySelector('.adsbygoogle'));
      }, 100);

      console.log('📺 하단 배너 광고 표시');
    }
  }

  public hideBottomBannerAd(): void {
    const bottomBannerAd = document.getElementById('bottom-banner-ad');
    if (bottomBannerAd) {
      bottomBannerAd.classList.add('hidden');
      this.bottomAdEnabled = false;
      console.log('📺 하단 배너 광고 숨김');
    }
  }

  // 인터스티셜 광고 비활성화 (사용자 요청으로 팝업 광고 제거)
  public showInterstitialAd(callback?: () => void): void {
    console.log('📺 인터스티셜 광고 비활성화됨 - 바로 콜백 실행');

    // 광고 표시 없이 바로 콜백 실행
    if (callback) {
      callback();
    }

    return;
  }

  private hideInterstitialAd(): void {
    // 인터스티셜 광고 비활성화로 인해 사용되지 않음
    console.log('📺 인터스티셜 광고 숨김 메서드 - 비활성화됨');
    return;
  }

  // 보상형 광고 비활성화 (사용자 요청으로 제거)
  public showRewardAd(callback?: (reward: string) => void): void {
    console.log('🎁 보상형 광고 비활성화됨 - 바로 콜백 실행');

    // 광고 표시 없이 바로 콜백 실행 (빈 문자열로 보상 없음을 나타냄)
    if (callback) {
      callback(''); // 빈 문자열로 보상 없음 표시
    }

    return;
  }

  private selectReward(reward: string): void {
    this.selectedReward = reward;
    console.log(`🎯 보상 선택: ${reward}`);

    // 선택된 보상 하이라이트
    const rewardOptions = document.querySelectorAll('.reward-option');
    rewardOptions.forEach((option) => {
      option.classList.remove('selected');
      if ((option as HTMLElement).dataset.reward === reward) {
        option.classList.add('selected');
      }
    });
  }

  private watchRewardAd(): void {
    if (!this.selectedReward) {
      alert('보상을 먼저 선택해주세요!');
      return;
    }

    console.log(`📺 보상형 광고 시청 시작: ${this.selectedReward}`);

    // 실제로는 광고 시청 완료 후 보상 지급
    setTimeout(() => {
      // 저장된 콜백으로 보상 지급
      if (this.currentRewardCallback && this.selectedReward) {
        console.log(`🎁 보상 지급: ${this.selectedReward}`);
        this.currentRewardCallback(this.selectedReward);
        this.currentRewardCallback = null; // 콜백 실행 후 초기화
      }

      // 광고 숨김 (콜백은 이미 실행했으므로 hideRewardAd에서 중복 실행 방지)
      if (this.rewardAdOverlayElement) {
        this.rewardAdOverlayElement.classList.add('hidden');
        this.selectedReward = null;
        console.log('🎁 보상형 광고 숨김 (보상 지급 완료)');
      }
    }, 2000); // 2초 후 보상 지급 (실제로는 광고 시청 완료 후)
  }

  private skipRewardAd(): void {
    console.log('⏭️ 보상형 광고 건너뛰기');
    this.hideRewardAd();
  }

  private hideRewardAd(): void {
    if (this.rewardAdOverlayElement) {
      this.rewardAdOverlayElement.classList.add('hidden');

      // 저장된 콜백 실행 (보상 없이 닫힌 경우 빈 문자열 전달)
      if (this.currentRewardCallback) {
        console.log('🔄 보상형 광고 콜백 실행 (게임 재개)');
        this.currentRewardCallback(''); // 빈 문자열로 보상 없음을 나타냄
        this.currentRewardCallback = null; // 콜백 실행 후 초기화
      }

      this.selectedReward = null;
      console.log('🎁 보상형 광고 숨김');
    }
  }

  // 적응형 광고 로딩 (AdSense 재로딩)
  public refreshAds(): void {
    try {
      // AdSense 광고 재로딩
      if (typeof (window as any).adsbygoogle !== 'undefined') {
        (window as any).adsbygoogle.forEach((ad: any) => {
          try {
            ad.push({});
          } catch (e) {
            console.warn('광고 로딩 중 오류:', e);
          }
        });
      }
    } catch (error) {
      console.warn('광고 새로고침 중 오류:', error);
    }
  }

  // 동적 광고 로딩
  private loadAd(adElement: Element | null): void {
    if (!adElement) {
      console.warn('광고 요소를 찾을 수 없습니다.');
      return;
    }

    try {
      // AdSense가 로드되었는지 확인
      if (typeof (window as any).adsbygoogle !== 'undefined') {
        // 광고가 이미 로드되었는지 확인
        if (adElement.getAttribute('data-adsbygoogle-status') === 'done') {
          console.log('광고가 이미 로드되었습니다.');
          return;
        }

        // 광고 로드
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
        console.log('✅ 광고 로드 성공');
      } else {
        console.warn('AdSense 스크립트가 아직 로드되지 않았습니다.');
        // 잠시 후 재시도
        setTimeout(() => this.loadAd(adElement), 500);
      }
    } catch (error) {
      console.error('광고 로드 중 오류:', error);
    }
  }

  // 모바일 광고 크기 자동 조정
  public optimizeAdsForMobile(): void {
    const isMobile = window.innerWidth <= 767;
    const isSmallMobile = window.innerWidth <= 480;

    if (isMobile) {
      // 모바일에서 사이드바 광고 숨김
      this.hideSidebarAds();

      // 상하단 광고 크기 최적화
      this.optimizeBannerAdSize(isSmallMobile);

      console.log(
        `📱 모바일 광고 최적화 적용: ${isSmallMobile ? '작은' : '일반'} 모바일`
      );
    } else {
      // 데스크톱에서 사이드바 광고 표시
      this.showSidebarAds();
    }
  }

  private optimizeBannerAdSize(isSmallMobile: boolean): void {
    const adElements = document.querySelectorAll('.ad-container .adsbygoogle');

    adElements.forEach((adElement) => {
      const element = adElement as HTMLElement;

      if (isSmallMobile) {
        // 작은 모바일에서는 더 작은 광고
        element.style.minHeight = '60px';
        element.style.maxHeight = '80px';
      } else {
        // 일반 모바일에서는 중간 크기 광고
        element.style.minHeight = '70px';
        element.style.maxHeight = '100px';
      }
    });
  }

  // 광고 배치 상태 확인
  public getCurrentAdLayout(): string {
    const isMobile = window.innerWidth <= 767;
    const sidebarVisible = this.sidebarAdsEnabled;
    const topVisible = !document
      .getElementById('top-banner-ad')
      ?.classList.contains('hidden');
    const bottomVisible = this.bottomAdEnabled;

    if (isMobile) {
      return `모바일: 상단${topVisible ? '✓' : '✗'} 하단${
        bottomVisible ? '✓' : '✗'
      }`;
    } else {
      return `데스크톱: 상단${topVisible ? '✓' : '✗'} 사이드${
        sidebarVisible ? '✓' : '✗'
      } 하단${bottomVisible ? '✓' : '✗'}`;
    }
  }

  // 광고 성능 추적
  public trackAdPerformance(adType: string, action: 'view' | 'click'): void {
    const timestamp = new Date().toISOString();
    const deviceType = window.innerWidth <= 767 ? 'mobile' : 'desktop';

    // 로컬 스토리지에 성능 데이터 저장 (실제로는 분석 서비스로 전송)
    const performanceData = {
      adType,
      action,
      deviceType,
      timestamp,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent.substring(0, 100),
    };

    const existingData = JSON.parse(
      localStorage.getItem('adPerformance') || '[]'
    );
    existingData.push(performanceData);

    // 최근 100개 기록만 보관
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100);
    }

    localStorage.setItem('adPerformance', JSON.stringify(existingData));

    console.log(`📊 광고 성능 추적: ${adType} ${action} (${deviceType})`);
  }

  // 광고 수익 통계 (선택사항)
  public getAdStats(): { impressions: number; clicks: number } {
    // 실제 구현에서는 Google Analytics나 AdSense 데이터와 연동
    return {
      impressions: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 50),
    };
  }
}
