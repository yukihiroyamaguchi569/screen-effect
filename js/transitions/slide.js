export class SlideTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            // 新しいシーンを右側に配置
            toScene.style.transform = 'translateX(100%)';
            toScene.style.transition = 'none';
            
            // 次のフレームで遷移を開始
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (fromScene) {
                        fromScene.style.transform = 'translateX(0)';
                        fromScene.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
                        fromScene.style.zIndex = '1';
                        requestAnimationFrame(() => {
                            fromScene.style.transform = 'translateX(-100%)';
                        });
                    }

                    toScene.style.transform = 'translateX(100%)';
                    toScene.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
                    toScene.style.zIndex = '2';
                    
                    requestAnimationFrame(() => {
                        toScene.style.transform = 'translateX(0)';
                    });

                    // 遷移が完了したらresolve
                    setTimeout(() => {
                        if (fromScene) {
                            fromScene.style.transition = 'none';
                        }
                        toScene.style.transition = 'none';
                        resolve();
                    }, duration);
                });
            });
        });
    }
} 