export class CurtainTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            const container = document.getElementById('scene-container');
            
            // カーテン要素の作成
            const curtainContainer = document.createElement('div');
            curtainContainer.style.position = 'absolute';
            curtainContainer.style.top = '0';
            curtainContainer.style.left = '0';
            curtainContainer.style.width = '100%';
            curtainContainer.style.height = '100%';
            curtainContainer.style.zIndex = '100';
            curtainContainer.style.pointerEvents = 'none';

            const curtainLeft = document.createElement('div');
            const curtainRight = document.createElement('div');
            
            // カーテンのスタイル設定
            [curtainLeft, curtainRight].forEach(curtain => {
                curtain.style.position = 'absolute';
                curtain.style.top = '0';
                curtain.style.height = '100%';
                curtain.style.width = '50%';
                curtain.style.backgroundColor = '#000';
                curtain.style.transition = `transform ${duration/2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            });

            // 左右のカーテンの個別設定
            curtainLeft.style.left = '0';
            curtainLeft.style.transform = 'translateX(-100%)';
            
            curtainRight.style.right = '0';
            curtainRight.style.transform = 'translateX(100%)';

            // カーテンをコンテナに追加
            curtainContainer.appendChild(curtainLeft);
            curtainContainer.appendChild(curtainRight);
            container.appendChild(curtainContainer);

            // シーンの初期設定
            if (fromScene) {
                fromScene.style.transition = 'none';
                fromScene.style.opacity = '1';
            }
            
            toScene.style.transition = 'none';
            toScene.style.opacity = '0';
            container.appendChild(toScene);

            // アニメーションの実行
            const animate = async () => {
                // Step 1: カーテンを閉じる
                await new Promise(closeDone => {
                    requestAnimationFrame(() => {
                        curtainLeft.style.transform = 'translateX(0)';
                        curtainRight.style.transform = 'translateX(0)';
                        setTimeout(closeDone, duration/2);
                    });
                });

                // Step 2: シーンの切り替え
                if (fromScene && fromScene.parentNode) {
                    container.removeChild(fromScene);
                }
                toScene.style.opacity = '1';

                // Step 3: カーテンを開く
                await new Promise(openDone => {
                    requestAnimationFrame(() => {
                        curtainLeft.style.transform = 'translateX(-100%)';
                        curtainRight.style.transform = 'translateX(100%)';
                        setTimeout(openDone, duration/2);
                    });
                });

                // Step 4: クリーンアップ
                if (curtainContainer.parentNode) {
                    container.removeChild(curtainContainer);
                }
                resolve();
            };

            // アニメーション開始
            requestAnimationFrame(animate);
        });
    }
} 