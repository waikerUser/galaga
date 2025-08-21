export class AdManager {
  private interstitialAdElement: HTMLElement | null;
  private rewardAdOverlayElement: HTMLElement | null;
  private sidebarAdsEnabled: boolean;
  private bottomAdEnabled: boolean;
  private adDisplayTimer: number;
  private closeAdButton: HTMLButtonElement | null;
  private selectedReward: string | null;

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

  // 인터스티셜 광고 표시 (게임 오버 후)
  public showInterstitialAd(callback?: () => void): void {
    if (!this.interstitialAdElement) return;

    this.interstitialAdElement.classList.remove('hidden');

    // 광고가 표시될 때 동적 로딩
    setTimeout(() => {
      const adElement =
        this.interstitialAdElement?.querySelector('.adsbygoogle') || null;
      this.loadAd(adElement);
    }, 100);

    console.log('📺 인터스티셜 광고 표시');

    // 5초 카운트다운
    let countdown = 5;
    if (this.closeAdButton) {
      this.closeAdButton.disabled = true;
      this.closeAdButton.textContent = `광고 닫기 (${countdown}초)`;
    }

    const countdownInterval = setInterval(() => {
      countdown--;
      if (this.closeAdButton) {
        this.closeAdButton.textContent = `광고 닫기 (${countdown}초)`;
      }

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        if (this.closeAdButton) {
          this.closeAdButton.disabled = false;
          this.closeAdButton.textContent = '광고 닫기';
        }
      }
    }, 1000);

    // 광고 닫힌 후 콜백 실행
    this.interstitialAdElement.addEventListener(
      'transitionend',
      () => {
        if (callback) callback();
      },
      { once: true }
    );
  }

  private hideInterstitialAd(): void {
    if (this.interstitialAdElement) {
      this.interstitialAdElement.classList.add('hidden');
      console.log('📺 인터스티셜 광고 숨김');
    }
  }

  // 보상형 광고 표시
  public showRewardAd(callback?: (reward: string) => void): void {
    if (!this.rewardAdOverlayElement) return;

    this.rewardAdOverlayElement.classList.remove('hidden');
    this.selectedReward = null;

    // 광고가 표시될 때 동적 로딩
    setTimeout(() => {
      const adElement =
        this.rewardAdOverlayElement?.querySelector('.adsbygoogle') || null;
      this.loadAd(adElement);
    }, 100);

    console.log('🎁 보상형 광고 표시');

    // 보상 선택 초기화
    const rewardOptions = document.querySelectorAll('.reward-option');
    rewardOptions.forEach((option) => {
      option.classList.remove('selected');
    });

    // 콜백 저장
    if (callback) {
      (this.rewardAdOverlayElement as any).rewardCallback = callback;
    }
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
      const callback = (this.rewardAdOverlayElement as any)?.rewardCallback;
      if (callback) {
        callback(this.selectedReward);
      }
      this.hideRewardAd();
    }, 2000); // 2초 후 보상 지급 (실제로는 광고 시청 완료 후)
  }

  private skipRewardAd(): void {
    console.log('⏭️ 보상형 광고 건너뛰기');
    this.hideRewardAd();
  }

  private hideRewardAd(): void {
    if (this.rewardAdOverlayElement) {
      this.rewardAdOverlayElement.classList.add('hidden');
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

  // 광고 수익 통계 (선택사항)
  public getAdStats(): { impressions: number; clicks: number } {
    // 실제 구현에서는 Google Analytics나 AdSense 데이터와 연동
    return {
      impressions: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 50),
    };
  }
}
