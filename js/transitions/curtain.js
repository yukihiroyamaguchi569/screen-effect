export class CurtainTransition {
    static async execute(fromScene, toScene, duration = 1000) {
        return new Promise(resolve => {
            // オーバーレイ要素の作成
            const curtainLeft = document.createElement('div');
            const curtainRight = document.createElement('div');
            
            // カーテンのスタイル設定
            [curtainLeft, curtainRight].forEach(curtain => {
                curtain.style.position = 'absolute';
                curtain.style.top = '0';
                curtain.style.height = '100%';
                curtain.style.width = '50%';
                curtain.style.backgroundColor = '#000';
                curtain.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                curtain.style.zIndex = '100';
            });

            // 左右のカーテンの個別設定
            curtainLeft.style.left = '0';
            curtainLeft.style.transform = 'translateX(-100%)';
            
            curtainRight.style.right = '0';
            curtainRight.style.transform = 'translateX(100%)';

            // カーテンを追加
            const container = document.getElementById('scene-container');
            container.appendChild(curtainLeft);
            container.appendChild(curtainRight);

            // 現在のシーンを非表示に
            if (fromScene) {
                fromScene.style.opacity = '1';
                fromScene.style.transition = `opacity ${duration/2}ms ease`;
            }

            // カーテンを閉じる
            requestAnimationFrame(() => {
                curtainLeft.style.transform = 'translateX(0)';
                curtainRight.style.transform = 'translateX(0)';

                // カーテンが閉じきった時点でシーンを切り替え
                setTimeout(() => {
                    if (fromScene) {
                        fromScene.style.opacity = '0';
                        container.removeChild(fromScene);
                    }
                    container.appendChild(toScene);
                    toScene.style.opacity = '1';

                    // カーテンを開く
                    requestAnimationFrame(() => {
                        curtainLeft.style.transform = 'translateX(-100%)';
                        curtainRight.style.transform = 'translateX(100%)';

                        // トランジション完了後にカーテンを削除
                        setTimeout(() => {
                            container.removeChild(curtainLeft);
                            container.removeChild(curtainRight);
                            resolve();
                        }, duration);
                    });
                }, duration);
            });
        });
    }
} 