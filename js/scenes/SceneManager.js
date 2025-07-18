import { FadeTransition } from '../transitions/fade.js';
import { SlideTransition } from '../transitions/slide.js';
import { ZoomTransition } from '../transitions/zoom.js';
import { CurtainTransition } from '../transitions/curtain.js';

export class SceneManager {
    constructor() {
        this.currentScene = null;
        this.currentSceneName = null;
        this.scenes = new Map();
        this.container = document.getElementById('scene-container');
        this.currentEffect = 'fade';
        this.transitions = {
            fade: FadeTransition,
            slide: SlideTransition,
            zoom: ZoomTransition,
            curtain: CurtainTransition
        };
        this.isTransitioning = false;
    }

    initialize() {
        // シーンの作成（タイトルと学校ゲートのみ）
        this.createScene('title', '../src/images/title.png');
        this.createScene('schoolGate', '../src/images/school-gate.png');
        
        // 最初のシーンを表示
        this.resetToTitle();

        // エフェクトボタンのイベントリスナー設定
        document.querySelectorAll('.effect-button').forEach(button => {
            button.addEventListener('click', () => {
                if (this.isTransitioning) return;
                
                // 現在のアクティブボタンを非アクティブに
                document.querySelector('.effect-button.active').classList.remove('active');
                // クリックされたボタンをアクティブに
                button.classList.add('active');
                // エフェクトを設定して実行
                this.currentEffect = button.dataset.effect;
                this.playTransition();
            });
        });
    }

    createScene(name, backgroundImage) {
        const scene = document.createElement('div');
        scene.className = 'scene';
        scene.style.backgroundImage = `url(${backgroundImage})`;
        this.scenes.set(name, scene);
    }

    async showScene(sceneName) {
        const scene = this.scenes.get(sceneName);
        if (!scene) return;

        const previousScene = this.currentScene;
        const transition = this.transitions[this.currentEffect];
        
        if (previousScene) {
            await transition.execute(previousScene, scene);
            if (previousScene.parentNode) {
                this.container.removeChild(previousScene);
            }
        } else {
            await transition.execute(null, scene);
        }

        this.container.appendChild(scene);
        this.currentScene = scene;
        this.currentSceneName = sceneName;
    }

    async playTransition() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // 学校ゲートへの遷移を実行
            await this.showScene('schoolGate');
            
            // 1秒待機
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // タイトルに戻る（エフェクトなし）
            await this.resetToTitle();
        } finally {
            this.isTransitioning = false;
        }
    }

    resetToTitle() {
        // コンテナ内の全ての子要素を削除
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        // タイトルシーンを新しく作成して追加
        const titleScene = this.scenes.get('title');
        titleScene.style.opacity = '1';  // 確実に表示
        titleScene.style.transform = 'none';  // 変形をリセット
        titleScene.style.transition = 'none';  // トランジションを無効化
        
        this.container.appendChild(titleScene);
        this.currentScene = titleScene;
        this.currentSceneName = 'title';

        // 強制的にリフロー
        titleScene.offsetHeight;
    }
} 